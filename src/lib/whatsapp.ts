import { formatoCOP } from './tipos';
import type { Prenda } from './tipos';

/** WhatsApp de Bluemoon, en formato internacional sin "+". */
export const WHATSAPP = '573206624270';

/** Texto que la clienta le manda a Bluemoon. El total solo aparece si hay más de una prenda. */
export function mensajeApartado(prendas: Prenda[], baseUrl: string): string {
  const base = baseUrl.replace(/\/+$/, '');
  const lineas = ['Hola Bluemoon, quiero apartar:'];
  for (const p of prendas) {
    lineas.push(`• ${p.nombre} · talla ${p.talla} · ${formatoCOP(p.precio)}`, `  ${base}/prenda/${p.slug}`);
  }
  if (prendas.length > 1) {
    lineas.push(`Total: ${formatoCOP(prendas.reduce((suma, p) => suma + p.precio, 0))}`);
  }
  return lineas.join('\n');
}

export function linkWhatsApp(texto: string): string {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
}

/** Chat con la tienda sin una prenda en particular: para preguntar antes de apartar. */
export const LINK_SALUDO = linkWhatsApp('Hola Bluemoon, vengo de la página web y tengo una pregunta.');
