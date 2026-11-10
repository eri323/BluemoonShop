'use client';

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from 'react';
import { guardarSlugs, leerSlugs, sanear } from '@/lib/almacen';
import { getProductos } from '@/lib/catalogo';

const CLAVE = 'bm-apartados';
const VACIO: string[] = [];

/* Almacén fuera de React: una sola lista compartida por toda la página. */
let actual: string[] | null = null;
const oyentes = new Set<() => void>();

function leer(): string[] {
  if (actual === null) actual = sanear(leerSlugs(CLAVE), getProductos());
  return actual;
}

function escribir(siguiente: string[]) {
  actual = sanear(siguiente, getProductos());
  guardarSlugs(CLAVE, actual);
  oyentes.forEach((avisar) => avisar());
}

function suscribir(avisar: () => void) {
  oyentes.add(avisar);
  // Otra pestaña cambió la lista: se vuelve a leer.
  const alCambiar = (e: StorageEvent) => {
    if (e.key !== CLAVE) return;
    actual = null;
    avisar();
  };
  window.addEventListener('storage', alCambiar);
  return () => {
    oyentes.delete(avisar);
    window.removeEventListener('storage', alCambiar);
  };
}

type Apartados = {
  slugs: string[];
  tiene(slug: string): boolean;
  alternar(slug: string): void;
  quitar(slug: string): void;
  vaciar(): void;
};

type VistosMatch = {
  vistos: Set<string>;
  marcar(slug: string): void;
  /** Devuelve una prenda al mazo, para deshacer. */
  desmarcar(slug: string): void;
  reiniciar(): void;
};

const ApartadosContext = createContext<Apartados | null>(null);
const VistosContext = createContext<VistosMatch | null>(null);

export function ApartadosProvider({ children }: { children: React.ReactNode }) {
  // En el servidor y durante la hidratación la lista está vacía; después se lee del navegador.
  const slugs = useSyncExternalStore(suscribir, leer, () => VACIO);

  const apartados = useMemo<Apartados>(
    () => ({
      slugs,
      tiene: (slug) => slugs.includes(slug),
      alternar: (slug) => escribir(leer().includes(slug) ? leer().filter((s) => s !== slug) : [...leer(), slug]),
      quitar: (slug) => escribir(leer().filter((s) => s !== slug)),
      vaciar: () => escribir([]),
    }),
    [slugs],
  );

  // Lo ya deslizado en Match solo dura mientras la página siga abierta.
  const [vistos, setVistos] = useState<Set<string>>(() => new Set());
  const marcar = useCallback((slug: string) => setVistos((prev) => new Set(prev).add(slug)), []);
  const desmarcar = useCallback((slug: string) => setVistos((prev) => {
    const siguiente = new Set(prev);
    siguiente.delete(slug);
    return siguiente;
  }), []);
  const reiniciar = useCallback(() => setVistos(new Set()), []);
  const vistosMatch = useMemo(
    () => ({ vistos, marcar, desmarcar, reiniciar }),
    [vistos, marcar, desmarcar, reiniciar],
  );

  return (
    <ApartadosContext.Provider value={apartados}>
      <VistosContext.Provider value={vistosMatch}>{children}</VistosContext.Provider>
    </ApartadosContext.Provider>
  );
}

export function useApartados(): Apartados {
  const ctx = useContext(ApartadosContext);
  if (!ctx) throw new Error('useApartados debe usarse dentro de <ApartadosProvider>');
  return ctx;
}

export function useVistosMatch(): VistosMatch {
  const ctx = useContext(VistosContext);
  if (!ctx) throw new Error('useVistosMatch debe usarse dentro de <ApartadosProvider>');
  return ctx;
}
