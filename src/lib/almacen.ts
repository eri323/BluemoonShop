import type { Prenda } from './tipos';

/*
 * Lectura y escritura en localStorage que nunca lanzan error: en el navegador interno de
 * Instagram o en modo privado el almacenamiento puede no existir o estar bloqueado.
 */

export function leerSlugs(key: string): string[] {
  try {
    const crudo = localStorage.getItem(key);
    if (!crudo) return [];
    const datos: unknown = JSON.parse(crudo);
    if (!Array.isArray(datos)) return [];
    return datos.filter((x): x is string => typeof x === 'string');
  } catch {
    return [];
  }
}

export function guardarSlugs(key: string, slugs: string[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(slugs));
  } catch {
    // Sin almacenamiento la página sigue funcionando; solo no recuerda la lista.
  }
}

/** Quita duplicados, slugs que ya no existen y prendas vendidas. Conserva el orden. */
export function sanear(slugs: string[], productos: Prenda[]): string[] {
  const apartables = new Set(productos.filter((p) => p.estado === 'disponible').map((p) => p.slug));
  return [...new Set(slugs)].filter((slug) => apartables.has(slug));
}
