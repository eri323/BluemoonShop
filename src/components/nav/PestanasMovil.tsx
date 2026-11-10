'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApartados } from '@/components/estado/ApartadosProvider';
import { estaActivo } from './Encabezado';
import { IconoCatalogo, IconoCorazon, IconoInicio, IconoMatch } from './iconos';

const PESTANAS = [
  { href: '/', texto: 'Inicio', Icono: IconoInicio },
  { href: '/catalogo', texto: 'Catálogo', Icono: IconoCatalogo },
  { href: '/match', texto: 'Match', Icono: IconoMatch },
  { href: '/apartados', texto: 'Pedido', Icono: IconoCorazon },
] as const;

export function PestanasMovil() {
  const pathname = usePathname();
  const { slugs } = useApartados();

  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-borde bg-fondo/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md esc:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {PESTANAS.map(({ href, texto, Icono }) => {
          const activo = estaActivo(pathname, href);
          const contador = href === '/apartados' && slugs.length > 0 ? slugs.length : null;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={activo ? 'page' : undefined}
                className="flex h-16 flex-col items-center justify-center gap-1 text-xs text-tenue aria-[current=page]:text-acento"
              >
                <span className="relative">
                  <Icono />
                  {contador !== null && (
                    <span className="absolute -right-3 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-acento-fuerte px-1 text-[11px] font-bold text-sobre-acento">
                      {contador}
                    </span>
                  )}
                </span>
                <span>
                  {texto}
                  {contador !== null && <span className="sr-only">, {contador} prendas</span>}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
