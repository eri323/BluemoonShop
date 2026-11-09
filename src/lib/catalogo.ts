import { PRODUCTOS } from '@/data/productos';
import { CATEGORIAS } from './tipos';
import type { Categoria, Prenda } from './tipos';

/*
 * Única puerta de entrada a los datos del catálogo. Las páginas no importan src/data
 * directamente, para poder cambiar el archivo por un CMS sin tocarlas.
 */

export function getProductos(): Prenda[] {
  return PRODUCTOS;
}

export function getProducto(slug: string): Prenda | undefined {
  return PRODUCTOS.find((p) => p.slug === slug);
}

/** Categorías con al menos una prenda, en el orden de CATEGORIAS. */
export function getCategoriasConPrendas(): Categoria[] {
  const usadas = new Set(PRODUCTOS.map((p) => p.categoria));
  return CATEGORIAS.filter((c) => usadas.has(c));
}

/** Las n disponibles más nuevas. */
export function getRecientes(n: number): Prenda[] {
  return PRODUCTOS.filter((p) => p.estado === 'disponible')
    .sort((a, b) => Date.parse(b.ingreso) - Date.parse(a.ingreso))
    .slice(0, n);
}
