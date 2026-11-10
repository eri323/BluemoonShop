import { describe, expect, it } from 'vitest';
import { urlDelSitio } from './sitio';

describe('urlDelSitio', () => {
  it('usa NEXT_PUBLIC_SITE_URL cuando está configurada', () => {
    expect(urlDelSitio({ NEXT_PUBLIC_SITE_URL: 'https://bluemoonshop.co', VERCEL_PROJECT_PRODUCTION_URL: 'x.vercel.app' }))
      .toBe('https://bluemoonshop.co');
  });

  it('cae al dominio de producción de Vercel', () => {
    expect(urlDelSitio({ VERCEL_PROJECT_PRODUCTION_URL: 'bluemoon-shop.vercel.app' }))
      .toBe('https://bluemoon-shop.vercel.app');
  });

  it('usa localhost en desarrollo', () => {
    expect(urlDelSitio({})).toBe('http://localhost:3000');
  });
});
