'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export type FotoPortada = { src: string; alt: string };

const INTERVALO_MS = 5000;

/*
 * Las fotos vienen cortadas en el cuello y en el muslo, y a veces en una manga; el desvanecido
 * de los cuatro bordes evita que ese corte se vea como una línea recta.
 */
const DESVANECIDO =
  'linear-gradient(to bottom, transparent 0, #000 7%, #000 86%, transparent 100%), ' +
  'linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)';

/** Modelo recortada de la portada: pasa a la foto siguiente cada 5 segundos. */
export function PortadaRotativa({ fotos, className = '' }: { fotos: FotoPortada[]; className?: string }) {
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

  if (total === 0) return null;

  // Solo se montan la anterior (se desvanece), la actual y la siguiente (se va descargando).
  const visibles = [...new Set([(actual - 1 + total) % total, actual, (actual + 1) % total])];

  return (
    <div className={className}>
      <div className="relative aspect-[3/4]">
        {/* Halo de color detrás de la modelo. */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[46%] aspect-square w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-acento/15 blur-2xl"
        />
        <div className="absolute inset-0" style={{ maskImage: DESVANECIDO, WebkitMaskImage: DESVANECIDO, maskComposite: 'intersect', WebkitMaskComposite: 'source-in' }}>
          {visibles.map((i) => (
            <Image
              key={fotos[i].src}
              src={fotos[i].src}
              alt={i === actual ? fotos[i].alt : ''}
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
      {total > 1 && (
        <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
          {fotos.map((f, i) => (
            <span
              key={f.src}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === actual ? 'w-5 bg-acento' : 'w-1.5 bg-borde'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
