import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Mazo } from '@/components/match/Mazo';
import { getProductos } from '@/lib/catalogo';

export const metadata: Metadata = { title: 'Match' };

export default function Match() {
  return (
    // El mazo lee ?estilo= en el navegador; así la página sigue siendo estática.
    <Suspense fallback={<p className="pt-10 text-center text-tenue">Barajando prendas…</p>}>
      <Mazo prendas={getProductos()} />
    </Suspense>
  );
}
