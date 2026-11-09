'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { TarjetaPrenda } from '@/components/prenda/TarjetaPrenda';
import { filtrar, parseFiltros, serializarFiltros } from '@/lib/filtros';
import type { Filtros } from '@/lib/filtros';
import type { Categoria, Prenda } from '@/lib/tipos';
import { PanelFiltros } from './PanelFiltros';

/** Catálogo completo: filtra en el navegador según lo que diga la URL. */
export function GrillaCatalogo({ prendas, categorias }: { prendas: Prenda[]; categorias: Categoria[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const filtros = parseFiltros(new URLSearchParams(params.toString()));
  const resultado = filtrar(prendas, filtros);
  const hayFiltros = serializarFiltros({ ...filtros, orden: 'nuevo' }) !== '';

  function cambiar(siguiente: Filtros) {
    const consulta = serializarFiltros(siguiente);
    router.replace(consulta ? `${pathname}?${consulta}` : pathname, { scroll: false });
  }

  const limpiar = () => cambiar({ orden: filtros.orden });

  return (
    <div className="esc:grid esc:grid-cols-[250px_minmax(0,1fr)] esc:gap-10">
      <PanelFiltros
        filtros={filtros}
        categorias={categorias}
        total={resultado.length}
        hayFiltros={hayFiltros}
        alCambiar={cambiar}
        alLimpiar={limpiar}
      />

      <div className="mt-6 esc:mt-0">
        {resultado.length === 0 ? (
          <div className="rounded-2xl border border-borde bg-superficie px-6 py-12 text-center">
            <p className="font-titulo text-2xl">Ninguna prenda con esos filtros</p>
            <p className="mt-2 text-tenue">Prueba quitando alguno o cambiando tus medidas.</p>
            <button type="button" onClick={limpiar} className="boton boton-principal mt-6">
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 esc:grid-cols-3 esc:gap-x-5 esc:gap-y-9">
            {resultado.map((prenda, i) => (
              <TarjetaPrenda key={prenda.slug} prenda={prenda} prioridad={i < 2} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
