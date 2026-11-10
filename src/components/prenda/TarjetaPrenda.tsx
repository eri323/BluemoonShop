import Image from 'next/image';
import Link from 'next/link';
import type { Prenda } from '@/lib/tipos';
import { BotonAnadir } from './BotonAnadir';
import { Precio } from './Precio';

export function etiquetaTalla(talla: Prenda['talla']): string {
  return talla === 'Única' ? 'Talla única' : `Talla ${talla}`;
}

/** Tarjeta del catálogo. Toda la tarjeta lleva a la ficha; el botón Añadir la suma al pedido sin salir. */
export function TarjetaPrenda({ prenda, prioridad = false }: { prenda: Prenda; prioridad?: boolean }) {
  const vendida = prenda.estado === 'vendida';

  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-superficie-alta">
        <Image
          src={prenda.fotos[0]}
          alt=""
          fill
          priority={prioridad}
          sizes="(min-width: 900px) 25vw, 50vw"
          className={`object-cover ${vendida ? 'opacity-45 grayscale' : ''}`}
        />
        {vendida && (
          <span className="absolute inset-0 grid place-items-center">
            <span className="sello-vendida text-sm">VENDIDA</span>
          </span>
        )}
      </div>

      <div className="mt-2.5 px-0.5">
        <h3 className="font-texto text-[0.95rem] font-medium leading-snug">
          <Link href={`/prenda/${prenda.slug}`} className="after:absolute after:inset-0 after:rounded-xl">
            {prenda.nombre}
          </Link>
        </h3>
        <p className={`mt-0.5 flex items-baseline justify-between gap-2 text-sm ${vendida ? 'text-tenue' : ''}`}>
          <Precio valor={prenda.precio} className={vendida ? 'line-through' : ''} />
          <span className="text-tenue">{etiquetaTalla(prenda.talla)}</span>
        </p>
      </div>

      {!vendida && <BotonAnadir slug={prenda.slug} nombre={prenda.nombre} className="absolute right-2 top-2 z-10" />}
    </article>
  );
}
