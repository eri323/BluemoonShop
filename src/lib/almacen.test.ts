import { afterEach, describe, expect, it, vi } from 'vitest';
import { guardarSlugs, leerSlugs, sanear } from './almacen';
import type { Prenda } from './tipos';

function prenda(slug: string, estado: Prenda['estado'] = 'disponible'): Prenda {
  return {
    slug, nombre: slug, precio: 1000, categoria: 'vestidos', estilos: ['gotico'], talla: 'S',
    medidas: {}, descripcion: [], fotos: [], estado, ingreso: '2026-01-01',
  };
}

function almacenFalso(inicial: Record<string, string> = {}) {
  const datos = new Map(Object.entries(inicial));
  return {
    getItem: (k: string) => datos.get(k) ?? null,
    setItem: (k: string, v: string) => void datos.set(k, v),
  };
}

afterEach(() => vi.unstubAllGlobals());

describe('sanear', () => {
  it('quita duplicados, slugs que no existen y prendas vendidas, y conserva el orden', () => {
    const productos = [prenda('a'), prenda('b'), prenda('vendida-1', 'vendida')];
    expect(sanear(['a', 'a', 'no-existe', 'vendida-1', 'b'], productos)).toEqual(['a', 'b']);
  });
});

describe('leerSlugs', () => {
  it('devuelve [] si localStorage lanza error', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new Error('SecurityError'); },
      setItem: () => { throw new Error('QuotaExceededError'); },
    });
    expect(leerSlugs('bm-apartados')).toEqual([]);
  });

  it('devuelve [] si localStorage no existe', () => {
    expect(leerSlugs('bm-apartados')).toEqual([]);
  });

  it('devuelve [] con JSON corrupto', () => {
    vi.stubGlobal('localStorage', almacenFalso({ 'bm-apartados': '{no es json' }));
    expect(leerSlugs('bm-apartados')).toEqual([]);
  });

  it('devuelve [] si lo guardado no es una lista', () => {
    vi.stubGlobal('localStorage', almacenFalso({ 'bm-apartados': '{"a":1}' }));
    expect(leerSlugs('bm-apartados')).toEqual([]);
  });

  it('descarta elementos que no son texto', () => {
    vi.stubGlobal('localStorage', almacenFalso({ 'bm-apartados': '["a",3,null,"b"]' }));
    expect(leerSlugs('bm-apartados')).toEqual(['a', 'b']);
  });
});

describe('guardarSlugs', () => {
  it('lo guardado se puede volver a leer', () => {
    vi.stubGlobal('localStorage', almacenFalso());
    guardarSlugs('bm-apartados', ['a', 'b']);
    expect(leerSlugs('bm-apartados')).toEqual(['a', 'b']);
  });

  it('no lanza error si localStorage falla', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => { throw new Error('QuotaExceededError'); },
    });
    expect(() => guardarSlugs('bm-apartados', ['a'])).not.toThrow();
  });
});
