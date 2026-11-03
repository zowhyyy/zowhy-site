"use client";

import { IconeCheck, IconeSacolaMais } from "./Icones";
import { useSacola } from "./SacolaProvider";

/** Botão redondo sobre a foto do card para adicionar a peça sem abrir a página dela. */
export function BotaoRapido({ slug, nome }: { slug: string; nome: string }) {
  const { tem, adicionar, abrirGaveta, pronto } = useSacola();
  const naSacola = pronto && tem(slug);

  return (
    <button
      type="button"
      className={`btn-rapido ${naSacola ? "na-sacola" : ""}`}
      aria-label={naSacola ? `${nome} está na sacola. Abrir sacola` : `Adicionar ${nome} à sacola`}
      onClick={() => {
        if (!naSacola) adicionar(slug);
        abrirGaveta();
      }}
    >
      <span key={String(naSacola)} className="btn-rapido-icone">
        {naSacola ? <IconeCheck className="h-5 w-5" /> : <IconeSacolaMais className="h-5 w-5" />}
      </span>
    </button>
  );
}
