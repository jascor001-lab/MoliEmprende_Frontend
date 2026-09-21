interface EscudoMolinaProps {
  className?: string;
}

export function EscudoMolina({ className = "h-8 w-8" }: EscudoMolinaProps) {
  return (
    <img
      src="/escudo-la-molina.png"
      alt="Municipalidad de La Molina"
      className={`shrink-0 object-contain ${className}`}
    />
  );
}
