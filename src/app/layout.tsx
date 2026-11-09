import type { Metadata, Viewport } from 'next';
import { Figtree, Gloock } from 'next/font/google';
import { ApartadosProvider } from '@/components/estado/ApartadosProvider';
import { SCRIPT_TEMA, TemaProvider } from '@/components/estado/TemaProvider';
import { Encabezado } from '@/components/nav/Encabezado';
import { PestanasMovil } from '@/components/nav/PestanasMovil';
import './globals.css';

const figtree = Figtree({ subsets: ['latin'], variable: '--font-figtree', display: 'swap' });
const gloock = Gloock({ subsets: ['latin'], weight: '400', variable: '--font-gloock', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'Bluemoon · tienda online', template: '%s · Bluemoon' },
  description: 'Ropa alternativa para mujer. Envíos a todo Colombia desde Medellín.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Bluemoon · tienda online',
    description: 'Ropa alternativa para mujer. Envíos a todo Colombia desde Medellín.',
    siteName: 'Bluemoon',
    locale: 'es_CO',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#07080f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // El script de tema cambia data-theme antes de hidratar; por eso se suprime el aviso.
    <html lang="es-CO" data-theme="oscuro" className={`${figtree.variable} ${gloock.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body>
        <TemaProvider>
          <ApartadosProvider>
            <Encabezado />
            {/* El espacio de abajo deja libre la barra de pestañas en celular. Se recorta a lo ancho
                porque la carta de Match sale volando hacia los lados. */}
            <main className="mx-auto max-w-6xl overflow-x-clip px-4 pb-28 esc:px-8 esc:pb-16">{children}</main>
            <PestanasMovil />
          </ApartadosProvider>
        </TemaProvider>
      </body>
    </html>
  );
}
