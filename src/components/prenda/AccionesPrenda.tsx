'use client';

import { useApartados } from '@/components/estado/ApartadosProvider';
import { IconoCorazon } from '@/components/nav/iconos';
import type { Prenda } from '@/lib/tipos';
import { EnlaceWhatsApp } from './EnlaceWhatsApp';

/** Botones de la ficha de una prenda disponible. */
export function AccionesPrenda({ prenda }: { prenda: Prenda }) {
  const { tiene, alternar } = useApartados();
  const apartada = tiene(prenda.slug);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <EnlaceWhatsApp prendas={[prenda]} className="flex-1">
        Pedir por WhatsApp
      </EnlaceWhatsApp>
      <button
        type="button"
        onClick={() => alternar(prenda.slug)}
        aria-pressed={apartada}
        className="boton boton-secundario flex-1"
      >
        <IconoCorazon relleno={apartada} />
        {apartada ? 'En tu pedido' : 'Añadir al pedido'}
      </button>
    </div>
  );
}
