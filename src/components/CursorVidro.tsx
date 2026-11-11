"use client";

import { useEffect, useRef } from "react";

/** Elementos clicáveis: a seta ganha um tom vinho sobre eles. */
const CLICAVEL = 'a, button, summary, label, select, [role="button"], input[type="checkbox"], input[type="radio"], input[type="range"]';
/** Campos de texto: aqui volta o cursor normal de digitar. */
const TEXTO = 'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, [contenteditable="true"]';
/** Desenho da seta (24 × 28), com a ponta em (2, 2), que é o ponto do clique. */
export const SETA = "M2 2 L2 21.5 Q2 23.4 3.6 22.3 L8.6 18.4 L11.6 25.4 Q12.2 26.6 13.4 26.1 L15.6 25.1 Q16.8 24.5 16.2 23.3 L13.2 16.4 L19.6 16.2 Q21.6 16 20.1 14.6 L3.9 1.1 Q2 -0.4 2 2 Z";

/**
 * Cursor de vidro (só com mouse): uma seta moderna translúcida, com desfoque leve do que está atrás.
 * Segue o mouse sem atraso. Sobre botões e links fica vinho; ao clicar, encolhe um pouco.
 * Liga com loja.cursor = "vidro" (config-loja.ts). Visual no globals.css ("Cursor de vidro").
 */
export function CursorVidro() {
  const seta = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(any-pointer: fine)").matches) return;
    const raiz = document.documentElement;
    const el = seta.current!;
    raiz.dataset.cursor = "vidro";

    function mover(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      el.style.transform = `translate3d(${e.clientX - 2}px, ${e.clientY - 2}px, 0)`;
      el.classList.add("visivel");
      const sobre = (e.target as Element | null)?.closest?.(`${CLICAVEL}, ${TEXTO}`) ?? null;
      el.classList.toggle("no-texto", !!sobre?.matches(TEXTO));
      el.classList.toggle("sobre-link", !!sobre && !sobre.matches(TEXTO));
    }
    const sair = () => el.classList.remove("visivel");
    const apertar = () => el.classList.add("apertado");
    const soltar = () => el.classList.remove("apertado");

    document.addEventListener("pointermove", mover, { passive: true });
    document.addEventListener("pointerdown", apertar);
    document.addEventListener("pointerup", soltar);
    raiz.addEventListener("mouseleave", sair);
    return () => {
      delete raiz.dataset.cursor;
      document.removeEventListener("pointermove", mover);
      document.removeEventListener("pointerdown", apertar);
      document.removeEventListener("pointerup", soltar);
      raiz.removeEventListener("mouseleave", sair);
    };
  }, []);

  return (
    <div ref={seta} className="cursor-vidro" aria-hidden="true">
      <div className="cursor-vidro-corpo" />
      <svg viewBox="0 0 24 28" className="cursor-vidro-contorno">
        <path d={SETA} />
      </svg>
    </div>
  );
}
