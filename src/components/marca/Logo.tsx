/** Logo de Bluemoon recreado: disco azul con "BLUE MOON" en blanco y brillo neón. */
export function Logo({ tamano = 44, className = '' }: { tamano?: number; className?: string }) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Bluemoon"
      className={className}
    >
      <defs>
        <radialGradient id="bm-disco" cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#2a55f0" />
          <stop offset="100%" stopColor="#0a2bb8" />
        </radialGradient>
        <filter id="bm-neon" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.4" result="halo" />
          <feMerge>
            <feMergeNode in="halo" />
            <feMergeNode in="halo" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#bm-disco)" />
      <g
        filter="url(#bm-neon)"
        fill="#fff"
        fontFamily="var(--font-figtree), system-ui, sans-serif"
        fontWeight="800"
        fontSize="21"
        textAnchor="middle"
      >
        <text x="50" y="46">BLUE</text>
        <text x="50" y="68">MOON</text>
      </g>
    </svg>
  );
}
