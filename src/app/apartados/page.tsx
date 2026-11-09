import type { Metadata } from 'next';
import { ListaApartados } from '@/components/apartados/ListaApartados';
import { getProductos } from '@/lib/catalogo';

export const metadata: Metadata = { title: 'Mis apartados' };

export default function Apartados() {
  return (
    <>
      <h1 className="pb-6 pt-7 text-4xl esc:pb-9 esc:pt-12 esc:text-5xl">Mis apartados</h1>
      <ListaApartados prendas={getProductos()} />
    </>
  );
}
