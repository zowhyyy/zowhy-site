"use client";

import { useEffect, useRef, useState } from "react";
import { loja } from "@/data/config-loja";

/**
 * Um link mailto: não faz nada em quem não tem programa de e-mail configurado.
 * Por isso o botão abre um cartão com as opções de escrever pelo Gmail, pelo app ou copiar o endereço.
 */
export function BotaoEmail({ className, children }: { className?: string; children: React.ReactNode }) {
  const [aberto, setAberto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const raiz = useRef<HTMLSpanElement>(null);
  const opcao = "block w-full rounded-xl px-3 py-2.5 text-left text-sm text-grafite transition-colors hover:bg-nevoa hover:text-vinho";

  useEffect(() => {
    if (!aberto) return;
    const fora = (e: PointerEvent) => {
      if (!raiz.current?.contains(e.target as Node)) setAberto(false);
    };
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    document.addEventListener("pointerdown", fora);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("pointerdown", fora);
      document.removeEventListener("keydown", tecla);
    };
  }, [aberto]);

  async function copiar() {
    const copiou = await navigator.clipboard?.writeText(loja.email).then(
      () => true,
      () => false,
    );
    if (copiou) setCopiado(true);
  }

  return (
    <span ref={raiz} className="relative inline-block max-w-full">
      <button type="button" className={className} aria-expanded={aberto} onClick={() => setAberto((a) => !a)}>
        {children}
      </button>
      {aberto && (
        <span className="entrar absolute top-full left-0 z-30 mt-2 block w-64 max-w-[calc(100vw-2rem)] rounded-[20px] bg-white p-2 shadow-[0_18px_40px_-16px_rgb(37_32_29/0.5)]">
          <span className="mono block px-3 pt-2 pb-1.5 text-[0.55rem] break-all text-suave normal-case">{loja.email}</span>
          <a className={opcao} href={`https://mail.google.com/mail/?view=cm&fs=1&to=${loja.email}`} target="_blank" rel="noopener noreferrer">
            Escrever pelo Gmail
          </a>
          <a className={opcao} href={`mailto:${loja.email}`}>
            Abrir meu app de e-mail
          </a>
          <button type="button" className={opcao} onClick={copiar}>
            <span aria-live="polite">{copiado ? "E-mail copiado" : "Copiar o e-mail"}</span>
          </button>
        </span>
      )}
    </span>
  );
}
