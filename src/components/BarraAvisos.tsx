import { loja } from "@/data/config-loja";

/** Letreiro fino no topo com as mensagens de config-loja.ts correndo em loop. */
export function BarraAvisos() {
  const faixa = (
    <span className="flex shrink-0 items-center gap-7 pr-7">
      {loja.avisos.map((a) => (
        <span key={a} className="flex items-center gap-7">
          <span>{a}</span>
          <span className="text-[#c25a6c]" aria-hidden="true">
            /
          </span>
        </span>
      ))}
    </span>
  );
  return (
    <div className="bg-grafite text-cinza" role="region" aria-label="Avisos">
      <p className="sr-only">{loja.avisos.join(". ")}</p>
      <div className="mono flex h-[34px] items-center overflow-hidden whitespace-nowrap" aria-hidden="true">
        <span className="letreiro flex w-max">
          {faixa}
          {faixa}
        </span>
      </div>
    </div>
  );
}
