import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { CATEGORIAS, ESTILOS, TALLAS } from '@/lib/tipos';
import { PRODUCTOS } from './productos';
import { RESENAS } from './resenas';

describe('PRODUCTOS', () => {
  it('trae entre 20 y 30 prendas', () => {
    expect(PRODUCTOS.length).toBeGreaterThanOrEqual(20);
    expect(PRODUCTOS.length).toBeLessThanOrEqual(30);
  });

  it('tiene entre 4 y 6 vendidas', () => {
    const vendidas = PRODUCTOS.filter((p) => p.estado === 'vendida').length;
    expect(vendidas).toBeGreaterThanOrEqual(4);
    expect(vendidas).toBeLessThanOrEqual(6);
  });

  it('usa slugs únicos y limpios', () => {
    const slugs = PRODUCTOS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it('tiene precios enteros mayores que cero', () => {
    for (const p of PRODUCTOS) {
      expect(Number.isInteger(p.precio), p.slug).toBe(true);
      expect(p.precio, p.slug).toBeGreaterThan(0);
    }
  });

  it('usa solo categorías, tallas y estilos conocidos', () => {
    for (const p of PRODUCTOS) {
      expect(CATEGORIAS, p.slug).toContain(p.categoria);
      expect(TALLAS, p.slug).toContain(p.talla);
      expect(p.estilos.length, p.slug).toBeGreaterThan(0);
      for (const e of p.estilos) expect(ESTILOS, p.slug).toContain(e);
    }
  });

  it('cada foto existe en disco y es WebP', () => {
    for (const p of PRODUCTOS) {
      expect(p.fotos.length, p.slug).toBeGreaterThan(0);
      for (const foto of p.fotos) {
        expect(foto, p.slug).toMatch(/\.webp$/);
        expect(fs.existsSync(path.join('public', foto)), foto).toBe(true);
      }
    }
  });

  it('tiene fechas de ingreso ISO válidas', () => {
    for (const p of PRODUCTOS) {
      expect(p.ingreso, p.slug).toMatch(/^\d{4}-\d{2}-\d{2}/);
      expect(Number.isNaN(Date.parse(p.ingreso)), p.slug).toBe(false);
    }
  });
});

describe('RESENAS', () => {
  it('trae entre 3 y 6 reseñas con nombre y texto', () => {
    expect(RESENAS.length).toBeGreaterThanOrEqual(3);
    expect(RESENAS.length).toBeLessThanOrEqual(6);
    for (const r of RESENAS) {
      expect(r.nombre.trim()).not.toBe('');
      expect(r.texto.trim()).not.toBe('');
    }
  });
});
