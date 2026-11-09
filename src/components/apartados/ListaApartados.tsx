'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useApartados } from '@/components/estado/ApartadosProvider';
import { EnlaceWhatsApp, useOrigen } from '@/components/prenda/EnlaceWhatsApp';
import { Precio } from '@/components/prenda/Precio';
import { etiquetaTalla } from '@/components/prenda/TarjetaPrenda';
import { formatoCOP } from '@/lib/tipos';
import type { Prenda } from '@/lib/tipos';
import { mensajeApartado } from '@/lib/whatsapp';

export function ListaApartados({ prendas }: { prendas: Prenda[] }) {
  const { slugs, quitar } = useApartados();
  const origen = useOrigen();
  const apartadas = slugs.flatMap((slug) => prendas.find((p) => p.slug === slug) ?? []);

  if (apartadas.length === 0) {
    return (
      <div className="rounded-2xl border border-borde bg-superficie px-6 py-12 text-center">
        <p className="font-titulo text-2xl">Aún no has apartado nada</p>
        <p className="mt-2 text-tenue">Toca el corazón de una prenda o juega Match para armar tu lista.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/catalogo" className="boton boton-principal">Ver el catálogo</Link>
          <Link href="/match" className="boton boton-secundario">Jugar Match</Link>
        </div>
      </div>
    );
  }

  const total = apartadas.reduce((suma, p) => suma + p.precio, 0);

  return (
    <div className="esc:grid esc:grid-cols-[minmax(0,1fr)_380px] esc:items-start esc:gap-12">
      <ul className="divide-y divide-borde border-y border-borde">
        {apartadas.map((p) => (
          <li key={p.slug} className="flex items-center gap-4 py-4">
            <Link
              href={`/prenda/${p.slug}`}
              className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-lg bg-superficie-alta"
              aria-hidden="true"
              tabIndex={-1}
            >
              <Image src={p.fotos[0]} alt="" fill sizes="80px" className="object-cover" />
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/prenda/${p.slug}`} className="font-medium leading-snug">{p.nombre}</Link>
              <p className="text-sm text-tenue">{etiquetaTalla(p.talla)}</p>
              <Precio valor={p.precio} />
            </div>
            <button
              type="button"
              onClick={() => quitar(p.slug)}
              aria-label={`Quitar ${p.nombre}`}
              className="min-h-11 shrink-0 px-2 text-sm text-tenue underline underline-offset-4"
            >
              Quitar
            </button>
          </li>
        ))}
      </ul>

      <section
        aria-labelledby="titulo-resumen"
        className="mt-8 rounded-2xl border border-borde bg-superficie p-5 esc:sticky esc:top-24 esc:mt-0"
      >
        <h2 id="titulo-resumen" className="text-2xl">Tu pedido</h2>
        <p className="mt-3 flex items-baseline justify-between">
          <span className="text-tenue">
            {apartadas.length} {apartadas.length === 1 ? 'prenda' : 'prendas'}
          </span>
          <span className="text-2xl font-semibold tabular-nums">{formatoCOP(total)}</span>
        </p>

        <EnlaceWhatsApp prendas={apartadas} className="mt-5 w-full">
          {apartadas.length === 1 ? 'Apartar por WhatsApp' : 'Apartar todo por WhatsApp'}
        </EnlaceWhatsApp>

        <h3 className="mb-2 mt-6 font-texto text-sm font-semibold text-tenue">Así le llega el mensaje a Bluemoon</h3>
        <p className="whitespace-pre-wrap break-words rounded-xl bg-superficie-alta p-4 text-sm">
          {mensajeApartado(apartadas, origen)}
        </p>
      </section>
    </div>
  );
}
