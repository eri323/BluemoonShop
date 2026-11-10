'use client';

import { ORDENES } from '@/lib/filtros';
import type { Filtros, Orden } from '@/lib/filtros';
import { ETIQUETA_ESTILO, TALLAS } from '@/lib/tipos';
import type { Talla } from '@/lib/tipos';
import { FormMedidas } from './FormMedidas';

const ETIQUETA_ORDEN: Record<Orden, string> = {
  nuevo: 'Más nuevo',
  'precio-asc': 'Menor precio',
  'precio-desc': 'Mayor precio',
};

/** Filtros secundarios del catálogo: talla, medidas y orden. El tipo de prenda va en FilaDestacadas. */
export function PanelFiltros({ filtros, porTalla, total, hayFiltros, alCambiar, alLimpiar }: {
  filtros: Filtros;
  /** Cuántas prendas quedarían al elegir cada talla, con los demás filtros puestos. */
  porTalla: Record<Talla, number>;
  total: number;
  hayFiltros: boolean;
  alCambiar: (f: Filtros) => void;
  alLimpiar: () => void;
}) {
  return (
    <aside aria-label="Filtros" className="flex flex-col gap-4 esc:sticky esc:top-24 esc:self-start">
      <fieldset className="min-w-0">
        <legend className="mb-2 text-sm font-semibold">Talla</legend>
        {/* En celular los chips se deslizan de lado; en computador se acomodan en varias filas. */}
        <div className="sin-barra -mx-4 flex gap-2 overflow-x-auto px-4 esc:mx-0 esc:flex-wrap esc:overflow-visible esc:px-0">
          {TALLAS.map((talla) => {
            const elegida = filtros.talla === talla;
            return (
              <button
                key={talla}
                type="button"
                className="chip"
                aria-pressed={elegida}
                disabled={porTalla[talla] === 0 && !elegida}
                onClick={() => alCambiar({ ...filtros, talla: elegida ? undefined : talla })}
              >
                {talla}
                <span className="ml-1.5 opacity-70">{porTalla[talla]}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <FormMedidas
        medidas={filtros.medidas ?? {}}
        alCambiar={(medidas) =>
          alCambiar({ ...filtros, medidas: Object.keys(medidas).length > 0 ? medidas : undefined })
        }
      />

      {/* El estilo ya no se elige aquí, pero un enlace viejo puede traerlo: se muestra para poder quitarlo. */}
      {filtros.estilo && (
        <button
          type="button"
          className="chip self-start"
          aria-pressed="true"
          onClick={() => alCambiar({ ...filtros, estilo: undefined })}
        >
          Estilo: {ETIQUETA_ESTILO[filtros.estilo]}
          <span className="ml-2" aria-hidden="true">×</span>
          <span className="sr-only">, quitar</span>
        </button>
      )}

      <div className="flex min-h-12 flex-wrap items-center gap-x-4 gap-y-2 border-t border-borde pt-4">
        <p aria-live="polite" className="font-semibold">
          {total} {total === 1 ? 'prenda' : 'prendas'}
        </p>
        {hayFiltros && (
          <button type="button" onClick={alLimpiar} className="min-h-11 text-acento underline underline-offset-4">
            Limpiar filtros
          </button>
        )}
        <select
          aria-label="Ordenar por"
          value={filtros.orden}
          onChange={(e) => alCambiar({ ...filtros, orden: e.target.value as Orden })}
          className="ml-auto h-11 rounded-lg border border-borde bg-superficie px-2 text-base text-texto"
        >
          {ORDENES.map((orden) => (
            <option key={orden} value={orden}>{ETIQUETA_ORDEN[orden]}</option>
          ))}
        </select>
      </div>
    </aside>
  );
}
