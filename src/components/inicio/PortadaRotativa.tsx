'use client';

import Image from 'next/image';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

export type FotoPortada = { src: string; nombre: string };

/** Cada cuánto cambia sola. */
const INTERVALO_MS = 3500;
/** Tras pasar una foto a mano, la rotación espera esto antes de seguir sola. */
const PAUSA_TRAS_TOCAR_MS = 9000;
/** Distancia en px a partir de la cual deslizar cuenta como pasar de foto. */
const UMBRAL_DESLIZAR = 40;

/*
 * Las fotos vienen cortadas en el cuello y en el muslo, y a veces en una manga; el desvanecido
 * de los cuatro bordes evita que ese corte se vea como una línea recta.
 */
const DESVANECIDO =
  'linear-gradient(to bottom, transparent 0, #000 7%, #000 86%, transparent 100%), ' +
  'linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)';

type Rotacion = {
  fotos: FotoPortada[];
  actual: number;
  /** Pasa a la foto siguiente (1) o anterior (-1) y pausa la rotación un rato. */
  pasar(delta: 1 | -1): void;
  /** Detiene la rotación mientras el puntero o el foco estén encima. */
  detener(si: boolean): void;
};

const RotacionContext = createContext<Rotacion | null>(null);

function useRotacion(): Rotacion {
  const ctx = useContext(RotacionContext);
  if (!ctx) throw new Error('Debe usarse dentro de <RotacionPortada>');
  return ctx;
}

/** Lleva la cuenta de qué vestido se muestra y lo cambia solo, con las flechas del teclado o al deslizar. */
export function RotacionPortada({ fotos, children }: { fotos: FotoPortada[]; children: React.ReactNode }) {
  const [actual, setActual] = useState(0);
  const total = fotos.length;
  const pausaHasta = useRef(0);
  const detenida = useRef(false);

  const pasar = useCallback((delta: 1 | -1) => {
    if (total < 2) return;
    pausaHasta.current = Date.now() + PAUSA_TRAS_TOCAR_MS;
    setActual((i) => (i + delta + total) % total);
  }, [total]);

  const detener = useCallback((si: boolean) => {
    detenida.current = si;
  }, []);

  useEffect(() => {
    if (total < 2) return;
    // Con movimiento reducido no cambia sola; se puede pasar a mano.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      // Con la pestaña oculta no avanza, para no gastar descargas que nadie ve.
      if (document.hidden || detenida.current || Date.now() < pausaHasta.current) return;
      setActual((i) => (i + 1) % total);
    }, INTERVALO_MS);
    return () => window.clearInterval(id);
  }, [total]);

  // Flechas del teclado, salvo que se esté escribiendo en un campo.
  useEffect(() => {
    function alTeclear(e: KeyboardEvent) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if ((e.target as HTMLElement | null)?.closest('input, select, textarea')) return;
      if (e.key === 'ArrowRight') pasar(1);
      if (e.key === 'ArrowLeft') pasar(-1);
    }
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [pasar]);

  const valor = useMemo(() => ({ fotos, actual, pasar, detener }), [fotos, actual, pasar, detener]);
  return <RotacionContext.Provider value={valor}>{children}</RotacionContext.Provider>;
}

/** La modelo recortada sobre la luna azul. En celular se pasa de vestido deslizando. */
export function ModeloPortada({ className = '' }: { className?: string }) {
  const { fotos, actual, pasar, detener } = useRotacion();
  const inicioX = useRef<number | null>(null);
  const total = fotos.length;
  if (total === 0) return null;

  // Solo se montan la anterior (se desvanece), la actual y la siguiente (se va descargando).
  const visibles = [...new Set([(actual - 1 + total) % total, actual, (actual + 1) % total])];

  function alSoltar(e: React.PointerEvent) {
    if (inicioX.current === null) return;
    const dx = e.clientX - inicioX.current;
    inicioX.current = null;
    // Deslizar a la izquierda trae la siguiente, como en cualquier galería.
    if (Math.abs(dx) >= UMBRAL_DESLIZAR) pasar(dx < 0 ? 1 : -1);
  }

  return (
    <div
      // pan-y: el dedo sigue pudiendo bajar por la página; el gesto de lado es nuestro.
      className={`relative aspect-[3/4] touch-pan-y select-none ${className}`}
      onPointerDown={(e) => { inicioX.current = e.clientX; }}
      onPointerUp={alSoltar}
      onPointerCancel={() => { inicioX.current = null; }}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') detener(true); }}
      onPointerLeave={() => detener(false)}
    >
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[45%] aspect-square w-[94%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-luna"
      />
      <div
        className="absolute inset-0"
        style={{
          maskImage: DESVANECIDO,
          WebkitMaskImage: DESVANECIDO,
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
        }}
      >
        {visibles.map((i) => (
          <Image
            key={fotos[i].src}
            src={fotos[i].src}
            alt={i === actual ? `Modelo con ${fotos[i].nombre.toLowerCase()}` : ''}
            aria-hidden={i === actual ? undefined : true}
            draggable={false}
            fill
            sizes="(min-width: 900px) 440px, 78vw"
            preload={i === 0}
            loading={i === 0 ? 'eager' : 'lazy'}
            className={`object-contain object-bottom transition-opacity duration-500 ease-out ${i === actual ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
      </div>
    </div>
  );
}
