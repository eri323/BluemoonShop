'use client';

import { ORDENES } from '@/lib/filtros';
import type { Filtros, Orden } from '@/lib/filtros';
import { ESTILOS, ETIQUETA_CATEGORIA, ETIQUETA_ESTILO, TALLAS } from '@/lib/tipos';
import type { Categoria } from '@/lib/tipos';
import { FormMedidas } from './FormMedidas';

const ETIQUETA_ORDEN: Record<Orden, string> = {
  nuevo: 'Lo más nuevo',
  'precio-asc': 'Precio: de menor a mayor',
  'precio-desc': 'Precio: de mayor a menor',
};

function Grupo<T extends string>({ titulo, opciones, etiqueta, actual, alElegir }: {
  titulo: string;
  opciones: readonly T[];
  etiqueta: (opcion: T) => string;
  actual: T | undefined;
  alElegir: (opcion: T | undefined) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-semibold">{titulo}</legend>
      {/* En celular los chips se deslizan de lado; en computador se acomodan en varias filas. */}
      <div className="sin-barra -mx-4 flex gap-2 overflow-x-auto px-4 esc:mx-0 esc:flex-wrap esc:overflow-visible esc:px-0">
        {opciones.map((opcion) => (
          <button
            key={opcion}
            type="button"
            className="chip"
            aria-pressed={actual === opcion}
            onClick={() => alElegir(actual === opcion ? undefined : opcion)}
          >
            {etiqueta(opcion)}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function PanelFiltros({ filtros, categorias, total, hayFiltros, alCambiar, alLimpiar }: {
  filtros: Filtros;
  categorias: Categoria[];
  total: number;
  hayFiltros: boolean;
  alCambiar: (f: Filtros) => void;
  alLimpiar: () => void;
}) {
  return (
    <aside aria-label="Filtros" className="flex flex-col gap-5 esc:sticky esc:top-24 esc:self-start">
      <Grupo
        titulo="Categoría"
        opciones={categorias}
        etiqueta={(c) => ETIQUETA_CATEGORIA[c]}
        actual={filtros.categoria}
        alElegir={(categoria) => alCambiar({ ...filtros, categoria })}
      />
      <Grupo
        titulo="Estilo"
        opciones={ESTILOS}
        etiqueta={(e) => ETIQUETA_ESTILO[e]}
        actual={filtros.estilo}
        alElegir={(estilo) => alCambiar({ ...filtros, estilo })}
      />
      <Grupo
        titulo="Talla"
        opciones={TALLAS}
        etiqueta={(t) => t}
        actual={filtros.talla}
        alElegir={(talla) => alCambiar({ ...filtros, talla })}
      />

      <FormMedidas
        medidas={filtros.medidas ?? {}}
        alCambiar={(medidas) =>
          alCambiar({ ...filtros, medidas: Object.keys(medidas).length > 0 ? medidas : undefined })
        }
      />

      <label className="flex flex-col gap-2 text-sm font-semibold">
        Ordenar por
        <select
          value={filtros.orden}
          onChange={(e) => alCambiar({ ...filtros, orden: e.target.value as Orden })}
          className="h-12 rounded-xl border border-borde bg-superficie px-3 text-base font-normal text-texto"
        >
          {ORDENES.map((orden) => (
            <option key={orden} value={orden}>{ETIQUETA_ORDEN[orden]}</option>
          ))}
        </select>
      </label>

      <div className="flex min-h-11 items-center justify-between gap-4 border-t border-borde pt-4">
        <p aria-live="polite" className="font-semibold">
          {total} {total === 1 ? 'prenda' : 'prendas'}
        </p>
        {hayFiltros && (
          <button type="button" onClick={alLimpiar} className="min-h-11 text-acento underline underline-offset-4">
            Limpiar filtros
          </button>
        )}
      </div>
    </aside>
  );
}
