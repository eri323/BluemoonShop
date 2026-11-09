import { describe, expect, it } from 'vitest';
import type { Prenda } from './tipos';
import { WHATSAPP, linkWhatsApp, mensajeApartado } from './whatsapp';

function prenda(slug: string, precio: number, nombre = slug): Prenda {
  return {
    slug, nombre, precio, categoria: 'vestidos', estilos: ['gotico'], talla: 'S',
    medidas: {}, descripcion: [], fotos: [], estado: 'disponible', ingreso: '2026-01-01',
  };
}

const BASE = 'https://bluemoon-demo.vercel.app';

describe('mensajeApartado', () => {
  it('con una prenda arma el texto exacto y no incluye el total', () => {
    expect(mensajeApartado([prenda('corset-negro', 29000, 'Corset Negro')], BASE)).toBe(
      'Hola Bluemoon, quiero apartar:\n• Corset Negro · talla S · $29.000\n  https://bluemoon-demo.vercel.app/prenda/corset-negro',
    );
  });

  it('con tres prendas suma el total exacto', () => {
    const texto = mensajeApartado([prenda('a', 29000), prenda('b', 65000), prenda('c', 85000)], BASE);
    expect(texto.split('\n')).toHaveLength(8);
    expect(texto.endsWith('\nTotal: $179.000')).toBe(true);
  });

  it('no duplica la barra si la base termina en /', () => {
    expect(mensajeApartado([prenda('a', 1000)], BASE + '/')).toContain(`${BASE}/prenda/a`);
  });
});

describe('linkWhatsApp', () => {
  it('usa el número de Bluemoon', () => {
    expect(WHATSAPP).toBe('573206624270');
  });

  it('codifica tildes, &, # y saltos de línea sin perder nada', () => {
    const texto = 'Falda tartán & cruz #1\nok';
    const link = linkWhatsApp(texto);
    expect(link.startsWith('https://wa.me/573206624270?text=')).toBe(true);
    expect(decodeURIComponent(link.split('?text=')[1])).toBe(texto);
    expect(new URL(link).searchParams.get('text')).toBe(texto);
  });

  it('sigue siendo un link válido con 15 prendas', () => {
    const prendas = Array.from({ length: 15 }, (_, i) => prenda(`vestido-señorial-${i}`, 59000, `Vestido Señorial ñ #${i}`));
    const texto = mensajeApartado(prendas, BASE);
    const link = linkWhatsApp(texto);
    expect(() => new URL(link)).not.toThrow();
    expect(new URL(link).searchParams.get('text')).toBe(texto);
    expect(texto.endsWith('Total: $885.000')).toBe(true);
  });
});
