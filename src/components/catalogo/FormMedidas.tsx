'use client';

import { useState } from 'react';
import { MEDIDAS_CLIENTA, limpiarMedidas } from '@/lib/filtros';
import type { Medidas } from '@/lib/tipos';

const NOMBRE = { busto: 'Busto', cintura: 'Cintura', cadera: 'Cadera' } as const;

type Clave = (typeof MEDIDAS_CLIENTA)[number];
type Texto = Record<Clave, string>;

function aTexto(medidas: Medidas): Texto {
  return {
    busto: medidas.busto?.toString() ?? '',
    cintura: medidas.cintura?.toString() ?? '',
    cadera: medidas.cadera?.toString() ?? '',
  };
}

/** "Según mis medidas": lo que no sea un número mayor que cero se ignora, sin error. */
export function FormMedidas({ medidas, alCambiar }: { medidas: Medidas; alCambiar: (m: Medidas) => void }) {
  const [texto, setTexto] = useState<Texto>(() => aTexto(medidas));
  // Abierto de entrada solo si el link ya trae medidas; después manda la clienta.
  const [abierto, setAbierto] = useState(() => Object.keys(medidas).length > 0);

  // Si la URL cambia por fuera (Limpiar filtros, atrás), los campos se ponen al día.
  const firmaUrl = JSON.stringify(aTexto(medidas));
  const [firmaVista, setFirmaVista] = useState(firmaUrl);
  if (firmaUrl !== firmaVista) {
    setFirmaVista(firmaUrl);
    if (JSON.stringify(aTexto(limpiarMedidas(texto))) !== firmaUrl) setTexto(aTexto(medidas));
  }

  function escribir(clave: Clave, valor: string) {
    const siguiente = { ...texto, [clave]: valor };
    setTexto(siguiente);
    alCambiar(limpiarMedidas(siguiente));
  }

  return (
    // Plegado por defecto para que en celular las prendas no queden lejos.
    <details open={abierto} onToggle={(e) => setAbierto(e.currentTarget.open)} className="group rounded-xl border border-borde px-4">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-sm font-semibold [&::-webkit-details-marker]:hidden">
        Según mis medidas
        <span aria-hidden="true" className="text-lg text-tenue transition-transform group-open:rotate-45">+</span>
      </summary>
      <p className="mb-2 text-sm text-tenue">En centímetros. Te mostramos lo que te queda, con 4 cm de margen.</p>
      <div className="grid grid-cols-3 gap-2 pb-4">
        {MEDIDAS_CLIENTA.map((clave) => (
          <label key={clave} className="flex flex-col gap-1 text-sm text-tenue">
            {NOMBRE[clave]}
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={5}
              placeholder="cm"
              value={texto[clave]}
              onChange={(e) => escribir(clave, e.target.value)}
              /* 16 px evita que iOS haga zoom al tocar el campo. */
              className="h-12 w-full rounded-xl border border-borde bg-superficie px-3 text-base text-texto placeholder:text-tenue/60"
            />
          </label>
        ))}
      </div>
    </details>
  );
}
