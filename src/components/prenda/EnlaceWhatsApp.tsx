'use client';

import { useSyncExternalStore } from 'react';
import { IconoWhatsApp } from '@/components/nav/iconos';
import type { Prenda } from '@/lib/tipos';
import { linkWhatsApp, mensajeApartado } from '@/lib/whatsapp';

const BASE_SERVIDOR = process.env.NEXT_PUBLIC_SITE_URL ?? '';
const sinCambios = () => () => {};

/** Dominio desde donde se está viendo la página; en el servidor, el configurado. */
export function useOrigen(): string {
  return useSyncExternalStore(sinCambios, () => window.location.origin, () => BASE_SERVIDOR);
}

/** Botón que abre WhatsApp con el pedido ya escrito. */
export function EnlaceWhatsApp({ prendas, children, className = '' }: {
  prendas: Prenda[];
  children: React.ReactNode;
  className?: string;
}) {
  const origen = useOrigen();
  return (
    <a
      href={linkWhatsApp(mensajeApartado(prendas, origen))}
      target="_blank"
      rel="noopener noreferrer"
      className={`boton boton-whatsapp ${className}`}
    >
      <IconoWhatsApp />
      {children}
    </a>
  );
}
