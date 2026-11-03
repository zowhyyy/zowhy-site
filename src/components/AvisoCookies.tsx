"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const CHAVE = "zowhy-cookies";

export type EscolhaCookies = "todos" | "essenciais";

/** Consulte antes de ligar qualquer ferramenta de estatística ou anúncio: só pode rodar com "todos". */
export function escolhaCookies(): EscolhaCookies | null {
  try {
    const valor = localStorage.getItem(CHAVE);
    return valor === "todos" || valor === "essenciais" ? valor : null;
  } catch {
    return null;
  }
}

/** Aviso de cookies da primeira visita. Fica fora do painel de ADM. */
export function AvisoCookies() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  useEffect(() => setAberto(escolhaCookies() === null), []);

  function escolher(escolha: EscolhaCookies) {
    try {
      localStorage.setItem(CHAVE, escolha);
    } catch {
      // Sem armazenamento no navegador, o aviso só volta na próxima visita.
    }
    setAberto(false);
  }

  if (!aberto || pathname.startsWith("/admin")) return null;

  return (
    <aside aria-label="Aviso de cookies" className="aviso-cookies vidro fixed inset-x-3 bottom-3 z-[115] rounded-[24px] p-5 sm:right-auto sm:bottom-5 sm:left-5 sm:w-[25rem]">
      <p className="mono flex items-center gap-2 text-vinho">
        <span className="inline-block h-2 w-2 bg-vinho" aria-hidden="true" />
        Cookies
      </p>
      <p className="mt-2.5 text-[0.92rem] leading-relaxed text-[#3f3935]">
        Guardamos algumas informações no seu navegador para manter a sacola e fazer o site funcionar. Nada de anúncios ou rastreamento.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn btn-cheio" onClick={() => escolher("todos")}>
          Aceitar
        </button>
        <button type="button" className="btn" onClick={() => escolher("essenciais")}>
          Só o essencial
        </button>
      </div>
    </aside>
  );
}
