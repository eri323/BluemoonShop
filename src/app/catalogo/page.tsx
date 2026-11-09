import type { Metadata } from 'next';
import { Suspense } from 'react';
import { GrillaCatalogo } from '@/components/catalogo/GrillaCatalogo';
import { getCategoriasConPrendas, getProductos } from '@/lib/catalogo';

export const metadata: Metadata = { title: 'Catálogo' };

export default function Catalogo() {
  return (
    <>
      <h1 className="pb-6 pt-7 text-4xl esc:pb-9 esc:pt-12 esc:text-5xl">Catálogo</h1>
      {/* La grilla lee los filtros de la URL en el navegador; así la página sigue siendo estática. */}
      <Suspense fallback={<p className="text-tenue">Cargando prendas…</p>}>
        <GrillaCatalogo prendas={getProductos()} categorias={getCategoriasConPrendas()} />
      </Suspense>
    </>
  );
}
