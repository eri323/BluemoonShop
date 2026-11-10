'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Precio } from '@/components/prenda/Precio';
import { etiquetaTalla } from '@/components/prenda/TarjetaPrenda';
import type { Prenda } from '@/lib/tipos';

/** Distancia en px a partir de la cual soltar la carta decide. */
export const UMBRAL = 90;

export type Decision = 'encanta' | 'paso';

/**
 * Carta de arriba del mazo. Se arrastra con dedo o mouse (eventos de puntero);
 * `salida` la hace volar cuando la decisión vino de un botón o del teclado.
 */
export function CartaMatch({ prenda, salida, alDecidir }: {
  prenda: Prenda;
  salida: Decision | null;
  alDecidir: (d: Decision) => void;
}) {
  const inicio = useRef<{ x: number; id: number } | null>(null);
  const [dx, setDx] = useState(0);
  const [arrastrando, setArrastrando] = useState(false);

  const desplazamiento = salida ? (salida === 'encanta' ? 520 : -520) : dx;
  const fuerza = Math.min(Math.abs(desplazamiento) / UMBRAL, 1);

  function alBajar(e: React.PointerEvent<HTMLDivElement>) {
    if (salida) return;
    inicio.current = { x: e.clientX, id: e.pointerId };
    e.currentTarget.setPointerCapture(e.pointerId);
    setArrastrando(true);
  }

  function alMover(e: React.PointerEvent<HTMLDivElement>) {
    if (!inicio.current || inicio.current.id !== e.pointerId) return;
    setDx(e.clientX - inicio.current.x);
  }

  function alSoltar(e: React.PointerEvent<HTMLDivElement>) {
    if (!inicio.current || inicio.current.id !== e.pointerId) return;
    const recorrido = e.clientX - inicio.current.x;
    inicio.current = null;
    setArrastrando(false);
    if (Math.abs(recorrido) > UMBRAL) {
      alDecidir(recorrido > 0 ? 'encanta' : 'paso');
    } else {
      setDx(0);
    }
  }

  function alCancelar() {
    inicio.current = null;
    setArrastrando(false);
    setDx(0);
  }

  return (
    <div
      onPointerDown={alBajar}
      onPointerMove={alMover}
      onPointerUp={alSoltar}
      onPointerCancel={alCancelar}
      className="absolute inset-0 cursor-grab touch-none select-none overflow-hidden rounded-3xl border border-borde bg-superficie-alta active:cursor-grabbing"
      style={{
        transform: `translateX(${desplazamiento}px) rotate(${desplazamiento / 22}deg)`,
        opacity: salida ? 0 : 1,
        transition: arrastrando ? 'none' : 'transform 260ms ease-out, opacity 260ms ease-out',
      }}
    >
      <Image
        src={prenda.fotos[0]}
        alt={prenda.nombre}
        fill
        priority
        draggable={false}
        sizes="(min-width: 900px) 380px, 90vw"
        className="pointer-events-none object-cover"
      />

      <span
        aria-hidden="true"
        className="absolute left-4 top-5 -rotate-12 rounded-lg border-[3px] border-acento bg-[rgb(7_8_15/0.7)] px-3 py-1 text-xl font-extrabold tracking-wide text-acento"
        style={{ opacity: desplazamiento > 0 ? fuerza : 0 }}
      >
        ME ENCANTA
      </span>
      <span
        aria-hidden="true"
        className="absolute right-4 top-5 rotate-12 rounded-lg border-[3px] border-white bg-[rgb(7_8_15/0.7)] px-3 py-1 text-xl font-extrabold tracking-wide text-white"
        style={{ opacity: desplazamiento < 0 ? fuerza : 0 }}
      >
        PASO
      </span>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgb(7_8_15/0.95)] via-[rgb(7_8_15/0.7)] to-transparent px-4 pb-4 pt-16 text-white">
        <h2 className="text-2xl">{prenda.nombre}</h2>
        <p className="mt-1 flex items-baseline gap-3">
          <Precio valor={prenda.precio} className="text-lg" />
          <span className="text-white/75">{etiquetaTalla(prenda.talla)}</span>
        </p>
      </div>
    </div>
  );
}
