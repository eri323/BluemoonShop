'use client';

import { useApartados } from '@/components/estado/ApartadosProvider';
import { IconoCorazon } from '@/components/nav/iconos';

/** Corazón que agrega o quita una prenda de "Mis apartados". */
export function BotonCorazon({ slug, nombre, className = '' }: { slug: string; nombre: string; className?: string }) {
  const { tiene, alternar } = useApartados();
  const apartada = tiene(slug);

  return (
    <button
      type="button"
      onClick={() => alternar(slug)}
      aria-pressed={apartada}
      aria-label={apartada ? `Quitar ${nombre} de apartados` : `Agregar ${nombre} a apartados`}
      className={`grid size-11 place-items-center rounded-full bg-[rgb(7_8_15/0.6)] text-white backdrop-blur-sm transition-transform active:scale-90 aria-pressed:bg-acento-fuerte ${className}`}
    >
      <IconoCorazon relleno={apartada} />
    </button>
  );
}
