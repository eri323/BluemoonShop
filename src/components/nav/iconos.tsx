/* Iconos de trazo, 24×24. Decorativos: el texto accesible va en quien los usa. */

type Props = { className?: string; relleno?: boolean };

function Base({ className, children, relleno }: Props & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill={relleno ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export const IconoInicio = (p: Props) => (
  <Base {...p}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5.5 10v9.5h13V10" />
  </Base>
);

export const IconoCatalogo = (p: Props) => (
  <Base {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </Base>
);

export const IconoMatch = (p: Props) => (
  <Base {...p}>
    <rect x="7" y="3" width="12" height="16" rx="2" transform="rotate(8 13 11)" />
    <rect x="4" y="5" width="12" height="16" rx="2" transform="rotate(-6 10 13)" />
  </Base>
);

export const IconoCorazon = (p: Props) => (
  <Base {...p}>
    <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z" />
  </Base>
);

export const IconoLuna = (p: Props) => (
  <Base {...p}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
  </Base>
);

export const IconoSol = (p: Props) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
  </Base>
);

export const IconoEquis = (p: Props) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
);

/** Globo de chat: acompaña los botones que abren WhatsApp. */
export const IconoChat = (p: Props) => (
  <Base {...p}>
    <path d="M12 3.5a8.5 8.5 0 0 0-7.300 12.850L3.500 20.500l4.300-1.150A8.500 8.500 0 1 0 12 3.500Z" />
    <path d="M8.500 11.500h7M8.500 14.500h4.500" />
  </Base>
);
