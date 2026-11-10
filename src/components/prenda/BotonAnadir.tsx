'use client';

import { useApartados } from '@/components/estado/ApartadosProvider';

/** Botón sobre la foto de una prenda: la añade al pedido o la quita, sin salir de la página. */
export function BotonAnadir({ slug, nombre, className = '' }: { slug: string; nombre: string; className?: string }) {
  const { tiene, alternar } = useApartados();
  const anadida = tiene(slug);

  return (
    <button
      type="button"
      onClick={() => alternar(slug)}
      aria-pressed={anadida}
      aria-label={anadida ? `Quitar ${nombre} del pedido` : `Añadir ${nombre} al pedido`}
      className={`inline-flex min-h-10 items-center rounded-md bg-[rgb(7_8_15/0.72)] px-3 text-sm font-semibold text-white backdrop-blur-sm transition-transform active:scale-95 aria-pressed:bg-acento-fuerte ${className}`}
    >
      {anadida ? 'Añadido' : 'Añadir'}
    </button>
  );
}
