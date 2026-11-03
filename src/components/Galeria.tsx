"use client";

import { useRef, useState } from "react";
import type { Produto } from "@/lib/tipos";
import { Carimbo, Etiqueta } from "./CardPeca";
import { FotoPeca } from "./FotoPeca";

// Sem fotos ainda: mostra 3 provisórias para dar ideia da galeria.
const rotulosProvisorios = ["Frente", "Costas", "Detalhe"];

export function Galeria({ produto }: { produto: Produto }) {
  const trilho = useRef<HTMLUListElement>(null);
  const [atual, setAtual] = useState(0);
  const total = produto.fotos.length || rotulosProvisorios.length;
  const indices = Array.from({ length: total }, (_, i) => i);
  const vendida = produto.situacao === "vendida";

  const irPara = (i: number) => {
    const el = trilho.current;
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * i, behavior: "smooth" });
  };

  return (
    <div>
      <div className={`relative overflow-hidden rounded-[3px] ${vendida ? "foto-vendida" : ""}`}>
        <ul
          ref={trilho}
          className="sem-barra flex snap-x snap-mandatory overflow-x-auto"
          aria-label="Fotos da peça"
          onScroll={(e) => {
            const el = e.currentTarget;
            setAtual(Math.round(el.scrollLeft / el.clientWidth));
          }}
        >
          {indices.map((i) => (
            <li key={i} className="relative aspect-[4/5] w-full shrink-0 snap-center bg-nevoa">
              <FotoPeca
                produto={produto}
                indice={i}
                sizes="(min-width: 768px) 55vw, 100vw"
                prioridade={i === 0}
                rotuloProvisorio={produto.fotos.length ? undefined : `${rotulosProvisorios[i]} · foto em breve`}
              />
            </li>
          ))}
        </ul>
        <Etiqueta tamanho={produto.tamanho} marca={produto.marca} apagada={vendida} />
        {vendida && <Carimbo grande />}
      </div>

      {total > 1 && (
        <div className="mt-3 flex gap-2">
          {indices.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => irPara(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={atual === i ? "true" : undefined}
              className={`relative aspect-[4/5] w-16 overflow-hidden rounded-[3px] bg-nevoa transition-[opacity,outline-color] duration-300 outline-2 outline-offset-2 ${
                atual === i ? "outline outline-vinho" : "opacity-60 hover:opacity-100"
              } ${vendida ? "grayscale" : ""}`}
            >
              <FotoPeca produto={produto} indice={i} sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
