"use client";

import { useState } from "react";
import type { Situacao } from "@/lib/tipos";
import { IconeCheck } from "./Icones";
import { useSacola } from "./SacolaProvider";

export function BotaoSacola({ slug, situacao }: { slug: string; situacao: Situacao }) {
  const { tem, adicionar, pronto, abrirGaveta } = useSacola();
  const [acabouDeAdicionar, setAcabouDeAdicionar] = useState(false);

  if (situacao === "vendida") {
    return (
      <button type="button" className="btn w-full" disabled>
        Peça vendida
      </button>
    );
  }
  if (situacao === "reservada") {
    return (
      <button type="button" className="btn w-full" disabled>
        Reservada
      </button>
    );
  }
  if (pronto && tem(slug)) {
    return (
      <button type="button" className="btn w-full" onClick={abrirGaveta}>
        <IconeCheck className={`h-5 w-5 ${acabouDeAdicionar ? "pulo" : ""}`} />
        Está na sacola
      </button>
    );
  }
  return (
    <button
      type="button"
      className="btn btn-cheio w-full"
      onClick={() => {
        adicionar(slug);
        setAcabouDeAdicionar(true);
        abrirGaveta();
      }}
    >
      Adicionar à sacola
    </button>
  );
}
