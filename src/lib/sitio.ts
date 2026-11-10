/**
 * Dirección pública del sitio, para los enlaces absolutos de los metadatos
 * (la imagen que muestran WhatsApp e Instagram al compartir el link).
 *
 * Orden: la variable propia → el dominio de producción que Vercel inyecta al
 * compilar → localhost en desarrollo. Sin el segundo paso, un despliegue sin
 * NEXT_PUBLIC_SITE_URL publicaba la imagen apuntando a localhost.
 */
export function urlDelSitio(entorno: Record<string, string | undefined> = process.env): string {
  if (entorno.NEXT_PUBLIC_SITE_URL) return entorno.NEXT_PUBLIC_SITE_URL;
  if (entorno.VERCEL_PROJECT_PRODUCTION_URL) return `https://${entorno.VERCEL_PROJECT_PRODUCTION_URL}`;
  return 'http://localhost:3000';
}
