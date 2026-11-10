import type { Metadata, Viewport } from 'next';
import { Bodoni_Moda, Figtree } from 'next/font/google';
import { ApartadosProvider } from '@/components/estado/ApartadosProvider';
import { SCRIPT_TEMA, TemaProvider } from '@/components/estado/TemaProvider';
import { Encabezado } from '@/components/nav/Encabezado';
import { urlDelSitio } from '@/lib/sitio';
import { PestanasMovil } from '@/components/nav/PestanasMovil';
import './globals.css';

const figtree = Figtree({ subsets: ['latin'], variable: '--font-figtree', display: 'swap' });
// Un solo grosor: los trazos finos de Bodoni se pierden en títulos pequeños si va más delgada.
const bodoni = Bodoni_Moda({ subsets: ['latin'], weight: '600', variable: '--font-bodoni', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(urlDelSitio()),
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
  themeColor: '#eef0f7',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // El script de tema cambia data-theme antes de hidratar; por eso se suprime el aviso.
    <html lang="es-CO" data-theme="claro" className={`${figtree.variable} ${bodoni.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body>
        <TemaProvider>
          <ApartadosProvider>
            <Encabezado />
            {/* El espacio de abajo deja libre la barra de pestañas en celular. Se recorta a lo ancho
                porque la carta de Match sale volando hacia los lados. */}
            <main className="mx-auto max-w-[90rem] overflow-x-clip px-4 pb-28 esc:px-8 esc:pb-16">{children}</main>
            <PestanasMovil />
          </ApartadosProvider>
        </TemaProvider>
      </body>
    </html>
  );
}
