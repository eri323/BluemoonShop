'use client';

import Image from 'next/image';
import { createContext, useContext, useEffect, useState } from 'react';

export type FotoPortada = { src: string; nombre: string };

const INTERVALO_MS = 5000;

/*
 * Las fotos vienen cortadas en el cuello y en el muslo, y a veces en una manga; el desvanecido
 * de los cuatro bordes evita que ese corte se vea como una línea recta.
 */
const DESVANECIDO =
  'linear-gradient(to bottom, transparent 0, #000 7%, #000 86%, transparent 100%), ' +
  'linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)';

type Rotacion = { fotos: FotoPortada[]; actual: number };

const RotacionContext = createContext<Rotacion | null>(null);

function useRotacion(): Rotacion {
  const ctx = useContext(RotacionContext);
  if (!ctx) throw new Error('Debe usarse dentro de <RotacionPortada>');
  return ctx;
}

/** Lleva la cuenta de qué vestido se muestra; la modelo y el pie de foto la leen de aquí. */
export function RotacionPortada({ fotos, children }: { fotos: FotoPortada[]; children: React.ReactNode }) {
  const [actual, setActual] = useState(0);
  const total = fotos.length;

  useEffect(() => {
    if (total < 2) return;
    // Con movimiento reducido se queda en la primera foto.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      // Con la pestaña oculta no avanza, para no gastar descargas que nadie ve.
      if (!document.hidden) setActual((i) => (i + 1) % total);
    }, INTERVALO_MS);
    return () => window.clearInterval(id);
  }, [total]);

  return <RotacionContext.Provider value={{ fotos, actual }}>{children}</RotacionContext.Provider>;
}

/** La modelo recortada sobre la luna azul. */
export function ModeloPortada({ className = '' }: { className?: string }) {
  const { fotos, actual } = useRotacion();
  const total = fotos.length;
  if (total === 0) return null;

  // Solo se montan la anterior (se desvanece), la actual y la siguiente (se va descargando).
  const visibles = [...new Set([(actual - 1 + total) % total, actual, (actual + 1) % total])];

  return (
    <div className={`relative aspect-[3/4] ${className}`}>
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
            fill
            sizes="(min-width: 900px) 440px, 78vw"
            preload={i === 0}
            loading={i === 0 ? 'eager' : 'lazy'}
            className={`object-contain object-bottom transition-opacity duration-700 ease-out ${i === actual ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
      </div>
    </div>
  );
}

/** Nombre del vestido que se está mostrando y su lugar en la serie. */
export function PieDeFoto({ className = '' }: { className?: string }) {
  const { fotos, actual } = useRotacion();
  if (fotos.length === 0) return null;
  return (
    // La foto ya lleva este nombre en su texto alternativo; aquí sería leerlo dos veces.
    <div aria-hidden="true" className={className}>
      <p className="text-sm tabular-nums text-tenue">
        {actual + 1} / {fotos.length}
      </p>
      {/* Alto fijo de dos renglones: en celular lo de abajo no salta cuando cambia el nombre. */}
      <p className="mt-1 min-h-[2.4em] font-titulo text-2xl leading-[1.2]">{fotos[actual].nombre}</p>
    </div>
  );
}
