import { CATEGORIAS, ESTILOS, TALLAS } from './tipos';
import type { Categoria, Estilo, Medidas, Prenda, Talla } from './tipos';

export const ORDENES = ['nuevo', 'precio-asc', 'precio-desc'] as const;
export type Orden = (typeof ORDENES)[number];

export type Filtros = {
  categoria?: Categoria;
  estilo?: Estilo;
  talla?: Talla;
  medidas?: Medidas;
  orden: Orden;
};

/** Medidas que la clienta puede escribir. El largo no se pregunta. */
export const MEDIDAS_CLIENTA = ['busto', 'cintura', 'cadera'] as const;

function enLista<T extends string>(lista: readonly T[], valor: string | null): T | undefined {
  return lista.find((x) => x === valor);
}

/** Descarta valores vacíos, no numéricos o menores o iguales a cero. */
export function limpiarMedidas(raw: Record<string, string | undefined>): Medidas {
  const limpias: Medidas = {};
  for (const clave of MEDIDAS_CLIENTA) {
    const texto = raw[clave]?.trim();
    if (!texto || !/^\d+([.,]\d+)?$/.test(texto)) continue;
    const n = Number(texto.replace(',', '.'));
    if (n > 0) limpias[clave] = n;
  }
  return limpias;
}

export function parseFiltros(params: URLSearchParams): Filtros {
  const filtros: Filtros = { orden: enLista(ORDENES, params.get('orden')) ?? 'nuevo' };
  const categoria = enLista(CATEGORIAS, params.get('categoria'));
  const estilo = enLista(ESTILOS, params.get('estilo'));
  const talla = enLista(TALLAS, params.get('talla'));
  const medidas = limpiarMedidas({
    busto: params.get('busto') ?? undefined,
    cintura: params.get('cintura') ?? undefined,
    cadera: params.get('cadera') ?? undefined,
  });
  if (categoria) filtros.categoria = categoria;
  if (estilo) filtros.estilo = estilo;
  if (talla) filtros.talla = talla;
  if (Object.keys(medidas).length > 0) filtros.medidas = medidas;
  return filtros;
}

/** Devuelve la cadena de consulta sin el "?". Vacía si no hay nada que filtrar. */
export function serializarFiltros(f: Filtros): string {
  const params = new URLSearchParams();
  if (f.categoria) params.set('categoria', f.categoria);
  if (f.estilo) params.set('estilo', f.estilo);
  if (f.talla) params.set('talla', f.talla);
  for (const clave of MEDIDAS_CLIENTA) {
    const valor = f.medidas?.[clave];
    if (valor) params.set(clave, String(valor));
  }
  if (f.orden !== 'nuevo') params.set('orden', f.orden);
  return params.toString();
}

/**
 * Una prenda es compatible si cada medida que la clienta dio y que la prenda tiene está
 * dentro de la tolerancia. Las medidas que la prenda no tiene se ignoran, pero si no tiene
 * ninguna de las pedidas, no es compatible.
 */
export function esCompatible(prenda: Medidas, clienta: Medidas, tolerancia = 4): boolean {
  const pedidas = MEDIDAS_CLIENTA.filter((clave) => clienta[clave] !== undefined);
  if (pedidas.length === 0) return true;
  const comparables = pedidas.filter((clave) => prenda[clave] !== undefined);
  if (comparables.length === 0) return false;
  return comparables.every((clave) => Math.abs(prenda[clave]! - clienta[clave]!) <= tolerancia);
}

function cumple(p: Prenda, f: Filtros): boolean {
  if (f.categoria && p.categoria !== f.categoria) return false;
  if (f.estilo && !p.estilos.includes(f.estilo)) return false;
  if (f.talla && p.talla !== f.talla) return false;
  if (f.medidas && !esCompatible(p.medidas, f.medidas)) return false;
  return true;
}

const COMPARAR: Record<Orden, (a: Prenda, b: Prenda) => number> = {
  nuevo: (a, b) => Date.parse(b.ingreso) - Date.parse(a.ingreso),
  'precio-asc': (a, b) => a.precio - b.precio,
  'precio-desc': (a, b) => b.precio - a.precio,
};

/** Las disponibles van primero y las vendidas al final, cada grupo según el orden. */
export function filtrar(prendas: Prenda[], f: Filtros): Prenda[] {
  const comparar = COMPARAR[f.orden];
  const visibles = prendas.filter((p) => cumple(p, f));
  return [
    ...visibles.filter((p) => p.estado === 'disponible').sort(comparar),
    ...visibles.filter((p) => p.estado === 'vendida').sort(comparar),
  ];
}

/** Prendas para deslizar en Match: solo disponibles y no vistas. */
export function deckMatch(prendas: Prenda[], vistos: Set<string>, f: Filtros = { orden: 'nuevo' }): Prenda[] {
  return filtrar(prendas, f).filter((p) => p.estado === 'disponible' && !vistos.has(p.slug));
}
