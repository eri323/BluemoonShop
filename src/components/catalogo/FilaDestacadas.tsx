'use client';

import Image from 'next/image';
import { ETIQUETA_CATEGORIA } from '@/lib/tipos';
import type { Categoria } from '@/lib/tipos';

export type Destacada = { categoria: Categoria; foto: string; cantidad: number };

const BOTON = 'group flex w-[4.75rem] shrink-0 flex-col items-center gap-1.5 text-center disabled:opacity-40 esc:w-24';
const ARO =
  'relative grid size-16 place-items-center overflow-hidden rounded-full bg-superficie-alta outline-2 outline-offset-2 outline-transparent transition-[outline-color] group-aria-pressed:outline-acento-fuerte esc:size-20';

/**
 * Las historias destacadas de la tienda, como en su perfil de Instagram: un círculo con foto
 * por tipo de prenda. Es el filtro principal del catálogo.
 */
export function FilaDestacadas({ destacadas, totalTodo, actual, alElegir }: {
  destacadas: Destacada[];
  /** Prendas que quedan con los demás filtros y sin elegir tipo. */
  totalTodo: number;
  actual: Categoria | undefined;
  alElegir: (categoria: Categoria | undefined) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">Tipo de prenda</legend>
      {/* En celular se desliza de lado, igual que en Instagram; en computador cabe completa. */}
      <div className="sin-barra -mx-4 flex gap-3 overflow-x-auto px-4 py-1 esc:mx-0 esc:flex-wrap esc:gap-5 esc:overflow-visible esc:px-0">
        <button type="button" className={BOTON} aria-pressed={!actual} onClick={() => alElegir(undefined)}>
          <span className={`${ARO} bg-luna font-titulo text-2xl text-texto`}>{totalTodo}</span>
          <span className="text-sm leading-tight">Todo</span>
        </button>
        {destacadas.map(({ categoria, foto, cantidad }) => (
          <button
            key={categoria}
            type="button"
            className={BOTON}
            aria-pressed={actual === categoria}
            // Sin prendas con los demás filtros: no lleva a ningún lado, salvo que ya esté elegida.
            disabled={cantidad === 0 && actual !== categoria}
            onClick={() => alElegir(actual === categoria ? undefined : categoria)}
          >
            <span className={ARO}>
              <Image src={foto} alt="" fill sizes="80px" className="object-cover" />
            </span>
            <span className="text-sm leading-tight">
              {ETIQUETA_CATEGORIA[categoria]} <span className="text-tenue">{cantidad}</span>
            </span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
