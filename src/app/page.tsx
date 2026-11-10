import Image from 'next/image';
import Link from 'next/link';
import { ModeloPortada, PieDeFoto, RotacionPortada } from '@/components/inicio/PortadaRotativa';
import { TarjetaPrenda } from '@/components/prenda/TarjetaPrenda';
import { FOTOS_PORTADA } from '@/data/portada';
import { RESENAS } from '@/data/resenas';
import { getProductos, getRecientes } from '@/lib/catalogo';
import { DESTACADAS, ETIQUETA_CATEGORIA } from '@/lib/tipos';

export default function Inicio() {
  const productos = getProductos();
  const disponibles = productos.filter((p) => p.estado === 'disponible');
  const recientes = getRecientes(8);

  // Una tarjeta por historia destacada que tenga prendas, en el orden de Instagram.
  const tipos = DESTACADAS.flatMap((categoria) => {
    const prendas = productos.filter((p) => p.categoria === categoria);
    if (prendas.length === 0) return [];
    const muestra = prendas.find((p) => p.estado === 'disponible') ?? prendas[0];
    return [{ categoria, foto: muestra.fotos[0], cantidad: prendas.length }];
  });

  const mazo = disponibles.slice(0, 3);

  return (
    <>
      <section className="pb-12 pt-8 esc:pb-20 esc:pt-12">
        <h1 className="sr-only">Bluemoon</h1>
        <RotacionPortada fotos={FOTOS_PORTADA}>
          <div className="grid gap-7 esc:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] esc:gap-0">
            <div className="flex flex-col text-center esc:justify-between esc:text-left">
              <p
                aria-hidden="true"
                className="font-titulo text-[clamp(3rem,16.5vw,5.5rem)] leading-[0.95] esc:mr-5 esc:mt-10 esc:text-right esc:text-[clamp(4rem,10vw,9.75rem)]"
              >
                <span className="esc:hidden">Bluemoon</span>
                <span className="hidden esc:inline">Blue</span>
              </p>
              <div className="mt-4 esc:mt-0 esc:pb-8 esc:pr-12">
                <p className="mx-auto max-w-[36ch] text-lg text-tenue esc:mx-0">
                  Ropa alternativa para mujer, desde Medellín: gótico, coquette y vintage. Pocas unidades
                  de cada prenda y envíos a todo Colombia.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3 esc:justify-start">
                  <Link href="/catalogo" className="boton boton-principal">Ver el catálogo</Link>
                  <Link href="/match" className="boton boton-secundario">Jugar Match</Link>
                </div>
              </div>
            </div>

            <ModeloPortada className="z-10 mx-auto w-[min(78vw,340px)] esc:w-[clamp(260px,29vw,440px)]" />

            <div className="flex flex-col esc:justify-between">
              <PieDeFoto className="text-center esc:max-w-[22rem] esc:pl-12 esc:pt-6 esc:text-left" />
              <p
                aria-hidden="true"
                className="hidden font-titulo text-[clamp(4rem,10vw,9.75rem)] leading-[0.95] esc:mb-12 esc:ml-5 esc:block"
              >
                moon
              </p>
            </div>
          </div>
        </RotacionPortada>
      </section>

      <section aria-labelledby="titulo-tipos">
        <div className="mb-5">
          <h2 id="titulo-tipos" className="text-3xl esc:text-4xl">¿Qué estás buscando?</h2>
          <p className="mt-1 text-tenue">Las mismas secciones de nuestras historias destacadas.</p>
        </div>
        <ul className="flex flex-wrap justify-center gap-3 esc:gap-5">
          {tipos.map(({ categoria, foto, cantidad }) => (
            <li key={categoria} className="w-[calc((100%-1.5rem)/3)] esc:w-[calc((100%-5rem)/5)]">
              <Link
                href={`/catalogo?categoria=${categoria}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-superficie-alta"
              >
                <Image
                  src={foto}
                  alt=""
                  fill
                  sizes="(min-width: 900px) 20vw, 33vw"
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                />
                <span className="absolute inset-x-0 bottom-0 flex flex-col bg-gradient-to-t from-[rgb(7_8_15/0.9)] to-transparent px-2.5 pb-2.5 pt-12 text-white esc:px-4 esc:pb-4">
                  <span className="font-titulo text-base leading-tight esc:text-2xl">{ETIQUETA_CATEGORIA[categoria]}</span>
                  <span className="text-xs text-white/75 esc:text-sm">
                    {cantidad} {cantidad === 1 ? 'prenda' : 'prendas'}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="titulo-recientes" className="mt-16 esc:mt-24">
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
          {recientes.map((prenda) => (
            <TarjetaPrenda key={prenda.slug} prenda={prenda} />
          ))}
        </div>
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
