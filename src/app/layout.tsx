import type { Metadata } from 'next';
import { ApartadosProvider } from '@/components/estado/ApartadosProvider';
import { SCRIPT_TEMA, TemaProvider } from '@/components/estado/TemaProvider';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'Bluemoon · tienda online', template: '%s · Bluemoon' },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // El script de tema cambia data-theme antes de hidratar; por eso se suprime el aviso.
    <html lang="es-CO" data-theme="oscuro" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body>
        <TemaProvider>
          <ApartadosProvider>{children}</ApartadosProvider>
        </TemaProvider>
      </body>
    </html>
  );
}
