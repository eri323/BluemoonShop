import type { Medidas } from '@/lib/tipos';

const FILAS: { clave: keyof Medidas; nombre: string }[] = [
  { clave: 'busto', nombre: 'Busto' },
  { clave: 'cintura', nombre: 'Cintura' },
  { clave: 'cadera', nombre: 'Cadera' },
  { clave: 'largo', nombre: 'Largo' },
];

export function TablaMedidas({ medidas }: { medidas: Medidas }) {
  const filas = FILAS.filter((f) => medidas[f.clave] !== undefined);

  if (filas.length === 0) {
    return <p className="text-tenue">Pregunta tus medidas por WhatsApp.</p>;
  }

  return (
    <table className="w-full max-w-xs text-left">
      <caption className="sr-only">Medidas en centímetros</caption>
      <tbody>
        {filas.map((f) => (
          <tr key={f.clave} className="border-b border-borde last:border-0">
            <th scope="row" className="py-2 font-normal text-tenue">{f.nombre}</th>
            <td className="py-2 text-right font-semibold tabular-nums">{medidas[f.clave]} cm</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
