import Image from 'next/image';

/** Fotos de la prenda. Con varias, se deslizan de lado con el dedo. */
export function GaleriaFotos({ fotos, nombre, vendida }: { fotos: string[]; nombre: string; vendida: boolean }) {
  return (
    <div className="relative">
      <ul
        className="sin-barra flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-2xl"
        aria-label={`Fotos de ${nombre}`}
      >
        {fotos.map((foto, i) => (
          <li
            key={foto}
            className={`relative aspect-[4/5] shrink-0 snap-center overflow-hidden rounded-2xl bg-superficie-alta ${fotos.length > 1 ? 'w-[88%]' : 'w-full'}`}
          >
            <Image
              src={foto}
              alt={fotos.length > 1 ? `${nombre}, foto ${i + 1} de ${fotos.length}` : nombre}
              fill
              priority={i === 0}
              sizes="(min-width: 900px) 45vw, 92vw"
              className={`object-cover ${vendida ? 'opacity-50 grayscale' : ''}`}
            />
          </li>
        ))}
      </ul>
      {vendida && (
        <span className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="sello-vendida text-2xl">VENDIDA</span>
        </span>
      )}
    </div>
  );
}
