import type { MetadataRoute } from 'next';

/* La demo usa fotos de la tienda: no debe rastrearse ni salir en buscadores. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', disallow: '/' } };
}
