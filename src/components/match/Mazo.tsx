'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useApartados, useVistosMatch } from '@/components/estado/ApartadosProvider';
import { IconoCorazon, IconoEquis } from '@/components/nav/iconos';
import { BotonAnadir } from '@/components/prenda/BotonAnadir';
import { deckMatch, parseFiltros } from '@/lib/filtros';
import { ETIQUETA_ESTILO } from '@/lib/tipos';
import type { Prenda } from '@/lib/tipos';
import { CartaMatch } from './CartaMatch';
import type { Decision } from './CartaMatch';

const DURACION_SALIDA = 240;

function Miniaturas({ prendas, vacio, conAnadir }: { prendas: Prenda[]; vacio: string; conAnadir?: boolean }) {
  if (prendas.length === 0) return <p className="text-tenue">{vacio}</p>;
  return (
    <ul className="grid grid-cols-4 gap-2 esc:grid-cols-3">
      {prendas.map((p) => (
        <li key={p.slug} className="relative">
          <Link
            href={`/prenda/${p.slug}`}
            className="relative block aspect-[4/5] overflow-hidden rounded-lg bg-superficie-alta"
          >
            <Image src={p.fotos[0]} alt={p.nombre} fill sizes="110px" className="object-cover" />
          </Link>
          {conAnadir && <BotonAnadir slug={p.slug} nombre={p.nombre} className="absolute bottom-1 right-1 px-2" />}
        </li>
      ))}
    </ul>
  );
}

export function Mazo({ prendas }: { prendas: Prenda[] }) {
  const params = useSearchParams();
  const { estilo } = parseFiltros(new URLSearchParams(params.toString()));
  const filtros = { estilo, orden: 'nuevo' as const };

  const { vistos, marcar, desmarcar, reiniciar } = useVistosMatch();
  const { slugs, tiene, alternar } = useApartados();

  const total = deckMatch(prendas, new Set(), filtros).length;
  const mazo = deckMatch(prendas, vistos, filtros);
  const actual = mazo[0];
  const apartadas = slugs.flatMap((slug) => prendas.find((p) => p.slug === slug) ?? []);
  // Las que ya pasaron por el mazo y no están apartadas.
  const pasadas = prendas.filter((p) => vistos.has(p.slug) && !slugs.includes(p.slug));

  /** Última carta decidida, para poder devolverla. `aparto` dice si esa decisión la apartó. */
  const [ultima, setUltima] = useState<{ slug: string; aparto: boolean } | null>(null);

  const [salida, setSalida] = useState<Decision | null>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (temporizador.current) clearTimeout(temporizador.current); }, []);

  /** Aplica la decisión: derecha aparta (si no estaba) y marca; izquierda solo marca. */
  const resolver = useCallback((slug: string, decision: Decision) => {
    const aparto = decision === 'encanta' && !tiene(slug);
    if (aparto) alternar(slug);
    marcar(slug);
    setUltima({ slug, aparto });
  }, [tiene, alternar, marcar]);

  /** Devuelve la última carta al mazo; si se había apartado con esa decisión, la quita. */
  const deshacer = useCallback(() => {
    if (!ultima) return;
    if (ultima.aparto && tiene(ultima.slug)) alternar(ultima.slug);
    desmarcar(ultima.slug);
    setUltima(null);
  }, [ultima, tiene, alternar, desmarcar]);

  const volverAJugar = () => {
    setUltima(null);
    reiniciar();
  };

  /** Decisión por botón o teclado: la carta vuela y luego se resuelve. */
  const decidir = useCallback((decision: Decision) => {
    if (!actual || salida) return;
    const slug = actual.slug;
    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (sinMovimiento) return resolver(slug, decision);
    setSalida(decision);
    temporizador.current = setTimeout(() => {
      resolver(slug, decision);
      setSalida(null);
    }, DURACION_SALIDA);
  }, [actual, salida, resolver]);

  useEffect(() => {
    function alTeclear(e: KeyboardEvent) {
      const destino = e.target as HTMLElement | null;
      if (destino?.closest('input, select, textarea')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); decidir('encanta'); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); decidir('paso'); }
    }
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [decidir]);

  const titulo = estilo ? `Match: ${ETIQUETA_ESTILO[estilo]}` : 'Match';

  if (!actual) {
    const sinPrendas = total === 0;
    return (
      <section className="mx-auto max-w-xl pt-8 text-center esc:pt-14">
        <h1 className="text-4xl esc:text-5xl">Tu clóset ideal</h1>
        <p className="mt-3 text-tenue">
          {sinPrendas
            ? 'No hay prendas disponibles con este estilo.'
            : apartadas.length > 0
              ? `Ya viste todas. Te encantaron ${apartadas.length}.`
              : 'Ya viste todas y ninguna te convenció esta vez.'}
        </p>

        {apartadas.length > 0 && (
          <div className="mt-7 text-left">
            <Miniaturas prendas={apartadas} vacio="" />
          </div>
        )}

        {pasadas.length > 0 && (
          <section aria-labelledby="titulo-pasadas" className="mt-10 text-left">
            <h2 id="titulo-pasadas" className="text-2xl">Las que pasaste</h2>
            <p className="mb-3 mt-1 text-sm text-tenue">Si te arrepentiste de alguna, toca Añadir para sumarla a tu pedido.</p>
            <Miniaturas prendas={pasadas} vacio="" conAnadir />
          </section>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {apartadas.length > 0 && (
            <Link href="/apartados" className="boton boton-principal">Ver mi pedido</Link>
          )}
          {sinPrendas ? (
            <Link href="/catalogo" className="boton boton-secundario">Ir al catálogo</Link>
          ) : (
            <button type="button" onClick={volverAJugar} className="boton boton-secundario">Volver a jugar</button>
          )}
        </div>
      </section>
    );
  }

  const posicion = total - mazo.length + 1;

  return (
    <div className="pt-6 esc:grid esc:grid-cols-[minmax(0,1fr)_300px] esc:gap-12 esc:pt-10">
      <section className="mx-auto w-full max-w-[380px]">
        <h1 className="text-center text-3xl esc:text-4xl">{titulo}</h1>
        <p className="mt-1 text-center text-sm text-tenue">
          Desliza a la derecha lo que te encanta y a la izquierda lo que no.
        </p>

        <div className="relative mt-5 aspect-[4/5] w-full">
          {/* Dos cartas detrás, solo para dar la idea de mazo. */}
          {[2, 1].map((nivel) =>
            mazo[nivel] ? (
              <div
                key={mazo[nivel].slug}
                aria-hidden="true"
                className="absolute inset-0 overflow-hidden rounded-3xl border border-borde bg-superficie-alta"
                style={{ transform: `translateY(${nivel * 10}px) scale(${1 - nivel * 0.045})`, opacity: 1 - nivel * 0.3 }}
              >
                <Image src={mazo[nivel].fotos[0]} alt="" fill sizes="380px" className="object-cover" />
              </div>
            ) : null,
          )}
          <CartaMatch key={actual.slug} prenda={actual} salida={salida} alDecidir={(d) => resolver(actual.slug, d)} />
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => decidir('paso')}
            aria-label={`Pasar ${actual.nombre}`}
            className="grid size-16 place-items-center rounded-full border border-borde bg-superficie text-texto transition-transform active:scale-90"
          >
            <IconoEquis />
          </button>
          <Link href={`/prenda/${actual.slug}`} className="boton boton-secundario">Ver detalle</Link>
          <button
            type="button"
            onClick={() => decidir('encanta')}
            aria-label={`Me encanta ${actual.nombre}`}
            className="grid size-16 place-items-center rounded-full bg-acento-fuerte text-sobre-acento transition-transform active:scale-90"
          >
            <IconoCorazon relleno />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-sm">
          <p className="text-tenue" aria-live="polite">
            {posicion} de {total}
          </p>
          <button
            type="button"
            onClick={deshacer}
            disabled={!ultima}
            className="min-h-11 px-2 text-acento underline underline-offset-4 disabled:text-tenue disabled:no-underline disabled:opacity-60"
          >
            Deshacer la última
          </button>
        </div>
      </section>

      <aside aria-labelledby="titulo-encantaron" className="hidden esc:block">
        <h2 id="titulo-encantaron" className="mb-3 text-2xl">Te encantaron</h2>
        <Miniaturas prendas={apartadas} vacio="Lo que te encante aparece aquí." />
        {apartadas.length > 0 && (
          <Link href="/apartados" className="boton boton-secundario mt-5 w-full">Ver mi pedido</Link>
        )}
        {pasadas.length > 0 && (
          <>
            <h2 className="mb-3 mt-9 text-2xl">Las que pasaste</h2>
            <Miniaturas prendas={pasadas} vacio="" conAnadir />
          </>
        )}
      </aside>
    </div>
  );
}
