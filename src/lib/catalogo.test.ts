import { describe, expect, it } from 'vitest';
import { getCategoriasConPrendas, getProducto, getProductos, getRecientes } from './catalogo';
import { CATEGORIAS } from './tipos';

describe('catálogo', () => {
  it('getRecientes no incluye vendidas y va de la más nueva a la más vieja', () => {
    const recientes = getRecientes(3);
    expect(recientes).toHaveLength(3);
    expect(recientes.every((p) => p.estado === 'disponible')).toBe(true);
    const fechas = recientes.map((p) => Date.parse(p.ingreso));
    expect(fechas).toEqual([...fechas].sort((a, b) => b - a));
    const masNueva = Math.max(...getProductos().filter((p) => p.estado === 'disponible').map((p) => Date.parse(p.ingreso)));
    expect(fechas[0]).toBe(masNueva);
  });

  it('getProducto encuentra por slug y devuelve undefined si no existe', () => {
    const primera = getProductos()[0];
    expect(getProducto(primera.slug)).toBe(primera);
    expect(getProducto('no-existe')).toBeUndefined();
  });

  it('getCategoriasConPrendas trae solo categorías usadas, en el orden de CATEGORIAS', () => {
    const cats = getCategoriasConPrendas();
    const usadas = new Set(getProductos().map((p) => p.categoria));
    expect(cats).toEqual(CATEGORIAS.filter((c) => usadas.has(c)));
    expect(cats.length).toBeGreaterThan(0);
  });
});
