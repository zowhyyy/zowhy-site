"use client";

import { useRef, useState } from "react";
import { IconeCompartilhar } from "./Icones";

/** Usa o menu de compartilhar do aparelho; onde ele não existe, copia o link da peça. */
export function BotaoCompartilhar({ titulo }: { titulo: string }) {
  const [aviso, setAviso] = useState("");
  const timer = useRef<number | undefined>(undefined);

  async function compartilhar() {
    const url = window.location.href;
    if (navigator.share) {
      // A pessoa pode cancelar o menu; isso não é um erro.
      await navigator.share({ title: titulo, url }).catch(() => {});
      return;
    }
    const copiou = await navigator.clipboard?.writeText(url).then(
      () => true,
      () => false,
    );
    setAviso(copiou ? "Link copiado" : "Não deu para copiar o link");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAviso(""), 2000);
  }

  return (
    <button type="button" onClick={compartilhar} className="compartilhar vidro mono mt-3 inline-flex min-h-11 items-center gap-2.5 rounded-full py-1.5 pr-4 pl-1.5 text-[0.62rem]">
      <span className="compartilhar-icone grid h-8 w-8 place-items-center rounded-full bg-vinho text-white">
        <IconeCompartilhar className="h-4 w-4" />
      </span>
      <span aria-live="polite">{aviso || "Compartilhar esta peça"}</span>
    </button>
  );
}
