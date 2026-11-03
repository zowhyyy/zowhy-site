/** Só aparece se a página demorar: o .carregando-tela espera um instante antes de surgir. */
export default function Carregando() {
  return (
    <div className="carregando-tela grid min-h-[60dvh] place-items-center" role="status" aria-label="Carregando">
      <span className="flex gap-[3px]" aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="pixel-carga h-[9px] w-[9px]" style={{ animationDelay: `${i * 0.14}s` }} />
        ))}
      </span>
    </div>
  );
}
