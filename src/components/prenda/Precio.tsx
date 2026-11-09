import { formatoCOP } from '@/lib/tipos';

export function Precio({ valor, className = '' }: { valor: number; className?: string }) {
  return <span className={`font-semibold tabular-nums ${className}`}>{formatoCOP(valor)}</span>;
}
