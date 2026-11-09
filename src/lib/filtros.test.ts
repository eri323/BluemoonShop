import { describe, expect, it } from 'vitest';
import {
  deckMatch, esCompatible, filtrar, limpiarMedidas, parseFiltros, serializarFiltros,
} from './filtros';
import type { Prenda } from './tipos';

function prenda(p: Partial<Prenda> & { slug: string }): Prenda {
  return {
    nombre: p.slug, categoria: 'vestidos', estilos: ['gotico'], precio: 50000, talla: 'S',
    medidas: {}, descripcion: [], fotos: [], estado: 'disponible', ingreso: '2026-01-01', ...p,
  };
}

describe('esCompatible', () => {
  it('acepta una medida dentro de la tolerancia de 4 cm', () => {
    expect(esCompatible({ busto: 80, cintura: 63 }, { busto: 83 })).toBe(true);
  });

  it('rechaza una medida fuera de la tolerancia', () => {
    expect(esCompatible({ busto: 80 }, { busto: 85 })).toBe(false);
  });

  it('rechaza una prenda que no tiene ninguna de las medidas pedidas', () => {
    expect(esCompatible({ cintura: 66 }, { busto: 90 })).toBe(false);
  });

  it('ignora la medida que la prenda no tiene si otra pedida sí coincide', () => {
    expect(esCompatible({ busto: 88 }, { busto: 88, cadera: 120 })).toBe(true);
  });

  it('acepta cualquier prenda cuando la clienta no dio medidas', () => {
    expect(esCompatible({ busto: 80 }, {})).toBe(true);
    expect(esCompatible({}, {})).toBe(true);
  });
});

describe('limpiarMedidas', () => {
  it('descarta valores con letras, vacíos y negativos', () => {
    expect(limpiarMedidas({ busto: 'abc', cintura: '', cadera: '-3' })).toEqual({});
  });

  it('descarta el cero', () => {
    expect(limpiarMedidas({ busto: '0' })).toEqual({});
  });

  it('conserva un número válido', () => {
    expect(limpiarMedidas({ busto: '84' })).toEqual({ busto: 84 });
  });
});

describe('parseFiltros y serializarFiltros', () => {
  it('ignora parámetros inválidos', () => {
    expect(parseFiltros(new URLSearchParams('categoria=xyz&talla=ZZ&estilo='))).toEqual({ orden: 'nuevo' });
  });

  it('lee una URL válida completa', () => {
    const f = parseFiltros(new URLSearchParams('categoria=vestidos&estilo=gotico&talla=S&busto=84&orden=precio-asc'));
    expect(f).toEqual({
      categoria: 'vestidos', estilo: 'gotico', talla: 'S', medidas: { busto: 84 }, orden: 'precio-asc',
    });
  });

  it('serializar después de leer no cambia nada', () => {
    const una = serializarFiltros(parseFiltros(new URLSearchParams('categoria=vestidos&talla=S&busto=84&orden=precio-asc')));
    const dos = serializarFiltros(parseFiltros(new URLSearchParams(una)));
    expect(dos).toBe(una);
    expect(parseFiltros(new URLSearchParams(una))).toEqual({
      categoria: 'vestidos', talla: 'S', medidas: { busto: 84 }, orden: 'precio-asc',
    });
  });

  it('no escribe el orden por defecto en la URL', () => {
    expect(serializarFiltros({ orden: 'nuevo' })).toBe('');
  });
});

describe('filtrar', () => {
  const prendas = [
    prenda({ slug: 'cara', precio: 90000 }),
    prenda({ slug: 'vendida-barata', precio: 10000, estado: 'vendida' }),
    prenda({ slug: 'barata', precio: 30000 }),
  ];

  it('deja las vendidas al final aunque sean más baratas', () => {
    expect(filtrar(prendas, { orden: 'precio-asc' }).map((p) => p.slug)).toEqual(['barata', 'cara', 'vendida-barata']);
  });

  it('ordena de mayor a menor precio', () => {
    expect(filtrar(prendas, { orden: 'precio-desc' }).map((p) => p.slug)).toEqual(['cara', 'barata', 'vendida-barata']);
  });

  it('ordena por ingreso, de la más nueva a la más vieja', () => {
    const porFecha = [
      prenda({ slug: 'vieja', ingreso: '2026-01-01' }),
      prenda({ slug: 'nueva', ingreso: '2026-09-01' }),
    ];
    expect(filtrar(porFecha, { orden: 'nuevo' }).map((p) => p.slug)).toEqual(['nueva', 'vieja']);
  });

  it('filtra por categoría, estilo y talla', () => {
    const varias = [
      prenda({ slug: 'a', categoria: 'corsets', estilos: ['coquette'], talla: 'M' }),
      prenda({ slug: 'b', categoria: 'corsets', estilos: ['gotico'], talla: 'S' }),
      prenda({ slug: 'c' }),
    ];
    expect(filtrar(varias, { categoria: 'corsets', estilo: 'coquette', talla: 'M', orden: 'nuevo' }).map((p) => p.slug)).toEqual(['a']);
  });

  it('con medidas activas saca las prendas sin medidas', () => {
    const varias = [prenda({ slug: 'con', medidas: { busto: 84 } }), prenda({ slug: 'sin' })];
    expect(filtrar(varias, { medidas: { busto: 85 }, orden: 'nuevo' }).map((p) => p.slug)).toEqual(['con']);
  });
});

describe('deckMatch', () => {
  const prendas = [prenda({ slug: 'a' }), prenda({ slug: 'b', estilos: ['coquette'] }), prenda({ slug: 'v', estado: 'vendida' })];

  it('queda vacío cuando ya se vieron todas', () => {
    expect(deckMatch(prendas, new Set(['a', 'b', 'v']))).toEqual([]);
  });

  it('nunca incluye vendidas', () => {
    expect(deckMatch(prendas, new Set()).map((p) => p.slug)).toEqual(['a', 'b']);
  });

  it('respeta el filtro de estilo', () => {
    expect(deckMatch(prendas, new Set(), { estilo: 'coquette', orden: 'nuevo' }).map((p) => p.slug)).toEqual(['b']);
  });

  it('queda vacío si el filtro no deja ninguna disponible', () => {
    expect(deckMatch(prendas, new Set(), { estilo: 'casual', orden: 'nuevo' })).toEqual([]);
  });
});
