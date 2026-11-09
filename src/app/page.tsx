import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/marca/Logo';
import { TarjetaPrenda } from '@/components/prenda/TarjetaPrenda';
import { RESENAS } from '@/data/resenas';
import { getCategoriasConPrendas, getProductos, getRecientes } from '@/lib/catalogo';
import { ESTILOS, ETIQUETA_CATEGORIA, ETIQUETA_ESTILO } from '@/lib/tipos';

export default function Inicio() {
  const productos = getProductos();
  const disponibles = productos.filter((p) => p.estado === 'disponible');
  const recientes = getRecientes(8);
  const categorias = getCategoriasConPrendas();

  // Una foto distinta por estilo, de una prenda disponible.
  const usadas = new Set<string>();
  const estilos = ESTILOS.flatMap((estilo) => {
    const prenda = disponibles.find((p) => p.estilos.includes(estilo) && !usadas.has(p.slug));
    if (!prenda) return [];
    usadas.add(prenda.slug);
    return [{ estilo, foto: prenda.fotos[0] }];
  });

  const mazo = disponibles.slice(0, 3);

  return (
    <>
      <section className="flex flex-col items-center gap-5 pb-10 pt-9 text-center esc:flex-row esc:gap-10 esc:pb-14 esc:pt-14 esc:text-left">
        <Logo tamano={132} className="shrink-0 rounded-full shadow-brillo" />
        <div>
          <h1 className="text-5xl esc:text-7xl" style={{ textShadow: 'var(--brillo-texto)' }}>
            Bluemoon
          </h1>
          <p className="mt-3 max-w-[38ch] text-lg text-tenue">
            Ropa alternativa para mujer. Stock limitado y envíos inmediatos a todo Colombia.
          </p>
        </div>
      </section>

      <section aria-labelledby="titulo-recientes">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <h2 id="titulo-recientes" className="text-3xl esc:text-4xl">Recién llegadas</h2>
            <p className="mt-1 text-tenue">
              Quedan {disponibles.length} disponibles. La mayoría no vuelve a llegar.
            </p>
          </div>
          <Link href="/catalogo" className="font-semibold text-acento underline underline-offset-4">
            Ver todo el catálogo
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 esc:grid-cols-4 esc:gap-x-5 esc:gap-y-9">
          {recientes.map((prenda, i) => (
            <TarjetaPrenda key={prenda.slug} prenda={prenda} prioridad={i < 2} />
          ))}
        </div>
      </section>

      <section aria-labelledby="titulo-estilos" className="mt-16 esc:mt-24">
        <h2 id="titulo-estilos" className="mb-5 text-3xl esc:text-4xl">Busca por estilo</h2>
        <ul className="grid grid-cols-2 gap-3 esc:grid-cols-4 esc:gap-5">
          {estilos.map(({ estilo, foto }) => (
            <li key={estilo}>
              <Link
                href={`/catalogo?estilo=${estilo}`}
                className="relative block aspect-[3/4] overflow-hidden rounded-xl bg-superficie-alta"
              >
                <Image src={foto} alt="" fill sizes="(min-width: 900px) 25vw, 50vw" className="object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgb(7_8_15/0.92)] to-transparent px-3 pb-3 pt-14 font-titulo text-2xl text-white">
                  {ETIQUETA_ESTILO[estilo]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="titulo-categorias" className="mt-16 esc:mt-24">
        <h2 id="titulo-categorias" className="mb-5 text-3xl esc:text-4xl">Categorías</h2>
        <ul className="flex flex-wrap gap-2.5">
          {categorias.map((categoria) => (
            <li key={categoria}>
              <Link href={`/catalogo?categoria=${categoria}`} className="chip min-h-12 px-5 text-base text-texto">
                {ETIQUETA_CATEGORIA[categoria]}
                <span className="ml-2 text-tenue">{productos.filter((p) => p.categoria === categoria).length}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="titulo-match"
        className="mt-16 grid items-center gap-8 overflow-hidden rounded-3xl border border-borde bg-superficie p-6 esc:mt-24 esc:grid-cols-2 esc:p-12"
      >
        <div>
          <h2 id="titulo-match" className="text-3xl esc:text-5xl">¿No sabes qué buscar? Juega Match</h2>
          <p className="mt-3 max-w-[40ch] text-tenue">
            Desliza a la derecha lo que te encanta y a la izquierda lo que no. Al final apartas todo junto.
          </p>
          <Link href="/match" className="boton boton-principal mt-6">Jugar Match</Link>
        </div>
        <div className="relative mx-auto h-64 w-48 esc:h-80 esc:w-60" aria-hidden="true">
          {mazo.map((prenda, i) => (
            <div
              key={prenda.slug}
              className="absolute inset-0 overflow-hidden rounded-2xl border border-borde bg-superficie-alta shadow-brillo"
              style={{ transform: `rotate(${[-9, 6, -2][i]}deg) translateX(${[-26, 26, 0][i]}px)`, zIndex: i }}
            >
              <Image src={prenda.fotos[0]} alt="" fill sizes="240px" className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="titulo-resenas" className="mt-16 esc:mt-24">
        <h2 id="titulo-resenas" className="mb-5 text-3xl esc:text-4xl">Clientes felices</h2>
        <ul className="grid gap-4 esc:grid-cols-3">
          {RESENAS.map((resena) => (
            <li key={resena.texto} className="rounded-2xl border border-borde bg-superficie p-5">
              <blockquote>
                <p className="text-[1.05rem]">“{resena.texto}”</p>
                <footer className="mt-3 text-sm text-tenue">{resena.nombre}</footer>
              </blockquote>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
