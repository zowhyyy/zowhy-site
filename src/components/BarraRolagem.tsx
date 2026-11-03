"use client";

import { useEffect, useRef } from "react";

/**
 * Barra de rolagem própria: uma cápsula fina no vinho do site, colada na beira da tela,
 * sem trilho nem faixa atrás. A barra nativa do navegador não aceita esse visual.
 * Só aparece com mouse; no celular fica a barra normal do sistema.
 * Acompanha a rolagem e dá para arrastar. Visual no globals.css (procure "Barra de rolagem fina").
 */
export function BarraRolagem() {
  const area = useRef<HTMLDivElement>(null);
  const placa = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raiz = document.documentElement;
    const a = area.current!;
    const p = placa.current!;
    let quadro = 0;
    let timerRolando: number | undefined;
    let arrasto: { y: number; scroll: number } | null = null;

    function medidas() {
      const visivel = window.innerHeight;
      const total = raiz.scrollHeight;
      const altArea = a.clientHeight;
      const altPlaca = Math.max(110, Math.round((visivel / total) * altArea));
      return { altPlaca, folga: altArea - altPlaca, maxScroll: total - visivel };
    }

    /** A barra começa logo abaixo das faixas do topo (que vão até a borda da tela), para não ficar em cima delas. */
    function posicionarTopo() {
      const faixas = document.querySelector("body header")?.previousElementSibling;
      const fim = faixas ? faixas.getBoundingClientRect().bottom + window.scrollY : 0;
      a.style.top = `${Math.round(fim) + 8}px`;
    }

    function atualizar() {
      quadro = 0;
      const m = medidas();
      a.hidden = m.maxScroll <= 1;
      if (a.hidden) return;
      const fracao = Math.min(1, Math.max(0, window.scrollY / m.maxScroll));
      p.style.height = `${m.altPlaca}px`;
      p.style.transform = `translateY(${Math.round(fracao * m.folga)}px)`;
    }

    function agendar() {
      if (!quadro) quadro = requestAnimationFrame(atualizar);
    }

    function aoRolar() {
      agendar();
      a.classList.add("barra-rolando");
      window.clearTimeout(timerRolando);
      timerRolando = window.setTimeout(() => a.classList.remove("barra-rolando"), 700);
    }

    function pegar(e: PointerEvent) {
      if (e.button !== 0) return;
      e.preventDefault();
      arrasto = { y: e.clientY, scroll: window.scrollY };
      p.setPointerCapture(e.pointerId);
      a.classList.add("barra-arrastando");
    }

    function arrastar(e: PointerEvent) {
      if (!arrasto) return;
      const m = medidas();
      if (m.folga <= 0) return;
      window.scrollTo({ top: arrasto.scroll + ((e.clientY - arrasto.y) / m.folga) * m.maxScroll, behavior: "instant" });
    }

    function soltar() {
      arrasto = null;
      a.classList.remove("barra-arrastando");
    }

    /** O topo só muda quando o layout muda; rolar a página não mexe nele. */
    function aoMudarLayout() {
      posicionarTopo();
      agendar();
    }

    const observador = new ResizeObserver(aoMudarLayout);
    observador.observe(document.body);
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoMudarLayout);
    p.addEventListener("pointerdown", pegar);
    p.addEventListener("pointermove", arrastar);
    p.addEventListener("pointerup", soltar);
    p.addEventListener("pointercancel", soltar);
    posicionarTopo();
    atualizar();

    return () => {
      observador.disconnect();
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoMudarLayout);
      p.removeEventListener("pointerdown", pegar);
      p.removeEventListener("pointermove", arrastar);
      p.removeEventListener("pointerup", soltar);
      p.removeEventListener("pointercancel", soltar);
      cancelAnimationFrame(quadro);
      window.clearTimeout(timerRolando);
    };
  }, []);

  return (
    <div ref={area} className="barra-trilho" aria-hidden="true" hidden>
      <div ref={placa} className="barra-placa">
        <div className="barra-lamina" />
      </div>
    </div>
  );
}
