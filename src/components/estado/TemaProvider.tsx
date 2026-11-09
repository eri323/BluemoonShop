'use client';

import { createContext, useContext, useMemo, useSyncExternalStore } from 'react';

export type Tema = 'oscuro' | 'claro';

const CLAVE = 'bm-tema';

/**
 * Se ejecuta en <head> antes de pintar, para que no parpadee el tema al cargar.
 * Debe quedar en línea con lo que hace `aplicar`.
 */
export const SCRIPT_TEMA = `try{document.documentElement.dataset.theme=localStorage.getItem('${CLAVE}')==='claro'?'claro':'oscuro'}catch(e){}`;

const oyentes = new Set<() => void>();

function leer(): Tema {
  return document.documentElement.dataset.theme === 'claro' ? 'claro' : 'oscuro';
}

function aplicar(tema: Tema) {
  document.documentElement.dataset.theme = tema;
  try {
    localStorage.setItem(CLAVE, tema);
  } catch {
    // Sin almacenamiento el tema dura hasta recargar.
  }
  oyentes.forEach((avisar) => avisar());
}

function suscribir(avisar: () => void) {
  oyentes.add(avisar);
  return () => void oyentes.delete(avisar);
}

type ValorTema = { tema: Tema; alternar(): void };

const TemaContext = createContext<ValorTema | null>(null);

export function TemaProvider({ children }: { children: React.ReactNode }) {
  const tema = useSyncExternalStore<Tema>(suscribir, leer, () => 'oscuro');
  const valor = useMemo<ValorTema>(
    () => ({ tema, alternar: () => aplicar(leer() === 'oscuro' ? 'claro' : 'oscuro') }),
    [tema],
  );
  return <TemaContext.Provider value={valor}>{children}</TemaContext.Provider>;
}

export function useTema(): ValorTema {
  const ctx = useContext(TemaContext);
  if (!ctx) throw new Error('useTema debe usarse dentro de <TemaProvider>');
  return ctx;
}
