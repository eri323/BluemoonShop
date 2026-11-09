import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AccionesPrenda } from '@/components/prenda/AccionesPrenda';
import { GaleriaFotos } from '@/components/prenda/GaleriaFotos';
import { Precio } from '@/components/prenda/Precio';
import { TablaMedidas } from '@/components/prenda/TablaMedidas';
import { etiquetaTalla } from '@/components/prenda/TarjetaPrenda';
import { getProducto, getProductos } from '@/lib/catalogo';
import { ETIQUETA_CATEGORIA, ETIQUETA_ESTILO, formatoCOP } from '@/lib/tipos';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getProductos().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const prenda = getProducto(slug);
  if (!prenda) return {};
  const description = `${formatoCOP(prenda.precio)} · ${etiquetaTalla(prenda.talla)}`;
  return {
    title: prenda.nombre,
    description,
    openGraph: { title: `${prenda.nombre} · Bluemoon`, description, images: [prenda.fotos[0]] },
  };
}

export default async function FichaPrenda({ params }: Props) {
  const { slug } = await params;
  const prenda = getProducto(slug);
  if (!prenda) notFound();

  const vendida = prenda.estado === 'vendida';

  return (
    <article className="grid gap-8 pt-4 esc:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] esc:gap-14 esc:pt-10">
      <GaleriaFotos fotos={prenda.fotos} nombre={prenda.nombre} vendida={vendida} />

      <div className="esc:pt-2">
        <p className="text-sm text-tenue">
          <Link href={`/catalogo?categoria=${prenda.categoria}`} className="underline underline-offset-4">
            {ETIQUETA_CATEGORIA[prenda.categoria]}
          </Link>
        </p>
        <h1 className="mt-2 text-4xl esc:text-5xl">{prenda.nombre}</h1>

        <p className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <Precio valor={prenda.precio} className={`text-2xl ${vendida ? 'text-tenue line-through' : ''}`} />
          <span className="text-tenue">{etiquetaTalla(prenda.talla)}</span>
        </p>

        <div className="mt-6">
          {vendida ? (
            <div className="rounded-2xl border border-borde bg-superficie p-5">
              <p className="font-semibold">Esta prenda ya se vendió.</p>
              <Link href={`/catalogo?categoria=${prenda.categoria}`} className="boton boton-secundario mt-4">
                Ver prendas parecidas
              </Link>
            </div>
          ) : (
            <AccionesPrenda prenda={prenda} />
          )}
        </div>

        <section className="mt-9" aria-labelledby="titulo-medidas">
          <h2 id="titulo-medidas" className="mb-2 text-2xl">Medidas</h2>
          <TablaMedidas medidas={prenda.medidas} />
        </section>

        <section className="mt-9" aria-labelledby="titulo-detalles">
          <h2 id="titulo-detalles" className="mb-3 text-2xl">Detalles</h2>
          <ul className="max-w-[60ch] list-disc space-y-1.5 pl-5 marker:text-acento">
            {prenda.descripcion.map((linea) => (
              <li key={linea}>{linea}</li>
            ))}
          </ul>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Estilos">
            {prenda.estilos.map((estilo) => (
              <li key={estilo}>
                <Link href={`/catalogo?estilo=${estilo}`} className="chip">{ETIQUETA_ESTILO[estilo]}</Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
