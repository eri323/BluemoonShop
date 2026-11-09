'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApartados } from '@/components/estado/ApartadosProvider';
import { useTema } from '@/components/estado/TemaProvider';
import { Logo } from '@/components/marca/Logo';
import { IconoLuna, IconoSol } from './iconos';

export const ENLACES = [
  { href: '/', texto: 'Inicio' },
  { href: '/catalogo', texto: 'Catálogo' },
  { href: '/match', texto: 'Match' },
] as const;

export function estaActivo(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

export function Encabezado() {
  const pathname = usePathname();
  const { slugs } = useApartados();
  const { tema, alternar } = useTema();

  return (
    <header className="sticky top-0 z-30 border-b border-borde bg-fondo/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 esc:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Bluemoon, ir al inicio">
          <Logo tamano={40} />
          <span className="font-titulo text-xl">Bluemoon</span>
        </Link>

        <nav aria-label="Principal" className="ml-4 hidden items-center gap-1 esc:flex">
          {ENLACES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              aria-current={estaActivo(pathname, e.href) ? 'page' : undefined}
              className="rounded-full px-4 py-2 text-tenue transition-colors hover:text-texto aria-[current=page]:bg-superficie-alta aria-[current=page]:text-texto"
            >
              {e.texto}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={alternar}
            className="grid size-11 place-items-center rounded-full text-tenue transition-colors hover:text-texto"
            aria-label={tema === 'oscuro' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {tema === 'oscuro' ? <IconoSol /> : <IconoLuna />}
          </button>
          <Link
            href="/apartados"
            aria-current={estaActivo(pathname, '/apartados') ? 'page' : undefined}
            className="boton boton-secundario hidden min-h-11 esc:inline-flex"
          >
            Apartados ({slugs.length})
          </Link>
        </div>
      </div>
    </header>
  );
}
