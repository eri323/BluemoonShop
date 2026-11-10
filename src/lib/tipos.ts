/* Tipos y constantes del catálogo. Los nombres de estilos, categorías y tallas viven solo aquí. */

export const ESTILOS = ['gotico', 'dark-feminine', 'coquette', 'casual'] as const;
export type Estilo = (typeof ESTILOS)[number];

export const CATEGORIAS = [
  'corsets', 'vestidos', 'conjuntos', 'blusas', 'bottoms', 'lenceria',
  'bodys', 'medias', 'cardigan', 'bikinis', 'pijamas', 'accesorios',
] as const;
export type Categoria = (typeof CATEGORIAS)[number];

/**
 * Orden de las historias destacadas de @bluemoon_shop.co, que es como la clienta ya conoce
 * el catálogo. Corsés no tiene destacada propia y va al final.
 */
export const DESTACADAS: readonly Categoria[] = [
  'blusas', 'vestidos', 'medias', 'conjuntos', 'cardigan', 'bottoms',
  'lenceria', 'bikinis', 'bodys', 'pijamas', 'accesorios', 'corsets',
];

export const TALLAS =['XS', 'S', 'M', 'L', 'XL', 'Única'] as const;
export type Talla = (typeof TALLAS)[number];

export const ETIQUETA_ESTILO: Record<Estilo, string> = {
  gotico: 'Gótico',
  'dark-feminine': 'Dark feminine',
  coquette: 'Coquette',
  casual: 'Casual',
};

export const ETIQUETA_CATEGORIA: Record<Categoria, string> = {
  corsets: 'Corsés',
  vestidos: 'Vestidos',
  conjuntos: 'Conjuntos',
  blusas: 'Blusas',
  bottoms: 'Bottoms',
  lenceria: 'Lencería',
  bodys: 'Bodys',
  medias: 'Medias',
  cardigan: 'Cárdigan',
  bikinis: 'Bikinis',
  pijamas: 'Pijamas',
  accesorios: 'Accesorios',
};

/** Medidas en centímetros. */
export type Medidas = { busto?: number; cintura?: number; cadera?: number; largo?: number };

export type Prenda = {
  slug: string;
  nombre: string;
  categoria: Categoria;
  estilos: Estilo[];
  /** COP, entero. */
  precio: number;
  talla: Talla;
  medidas: Medidas;
  /** Viñetas, como en sus publicaciones. */
  descripcion: string[];
  /** Rutas dentro de /public, por ejemplo /prendas/corset-negro-1.webp */
  fotos: string[];
  estado: 'disponible' | 'vendida';
  /** Fecha ISO de la publicación, para "recién llegadas". */
  ingreso: string;
};

export type Resena = { nombre: string; texto: string };

const COP = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

/** 65000 → "$65.000" */
export function formatoCOP(n: number): string {
  // Intl puede separar con espacios duros según la versión de ICU; se dejan como puntos.
  return '$' + COP.format(Math.round(n)).replace(/[\u00a0\u202f\s]/g, '.');
}
