type Props = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function IconeSacola({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function IconeMenu({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M4 8h16M4 16h11" />
    </svg>
  );
}

export function IconeConta({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4" />
    </svg>
  );
}

export function IconeOlho({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconeMais({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconeFechar({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconeInstagram({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconeCheck({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function IconeVoltar({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function IconeSeta({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function IconeBusca({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

export function IconeSacolaMais({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      <path d="M12 11.5v5M9.5 14h5" />
    </svg>
  );
}

export function IconeAnterior({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M14.5 6 8.5 12l6 6" />
    </svg>
  );
}

export function IconeProximo({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="m9.5 6 6 6-6 6" />
    </svg>
  );
}

export function IconeCompartilhar({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M12 15V4M8 8l4-4 4 4" />
      <path d="M6 12H5v8h14v-8h-1" />
    </svg>
  );
}

export function IconeFiltro({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}
