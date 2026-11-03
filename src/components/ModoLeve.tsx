"use client";

import { useEffect } from "react";

const JANELA_MS = 2000;
const FPS_MINIMO = 30;
const JANELAS = 6;
/** Quadro mais longo que isso: a aba perdeu a tela ou o navegador freou; a medição não vale. */
const QUADRO_SUSPEITO_MS = 400;

/**
 * Mede a fluidez nos primeiros segundos e, se o aparelho não der conta, liga o modo leve
 * (html[data-leve], no fim do globals.css) até o fim da visita.
 * Aparelhos claramente fracos já entram leves pelo script do layout.
 */
export function ModoLeve() {
  useEffect(() => {
    const raiz = document.documentElement;
    if (raiz.dataset.leve) return;
    let quadro = 0;
    let janelas = 0;

    function ligar() {
      raiz.dataset.leve = "1";
      try {
        sessionStorage.setItem("zowhy-leve", "1");
      } catch {
        // Sem armazenamento, o site volta a medir na próxima página aberta.
      }
    }

    function medirJanela() {
      const inicio = performance.now();
      let anterior = inicio;
      let quadros = 0;
      let valida = document.visibilityState === "visible" && document.hasFocus();

      function contar(agora: number) {
        if (agora - anterior > QUADRO_SUSPEITO_MS) valida = false;
        anterior = agora;
        quadros++;
        if (agora - inicio < JANELA_MS) {
          quadro = requestAnimationFrame(contar);
          return;
        }
        if (valida && (quadros * 1000) / (agora - inicio) < FPS_MINIMO) return ligar();
        if (++janelas < JANELAS) quadro = requestAnimationFrame(medirJanela);
      }
      quadro = requestAnimationFrame(contar);
    }

    const espera = window.setTimeout(medirJanela, 1500);
    return () => {
      window.clearTimeout(espera);
      cancelAnimationFrame(quadro);
    };
  }, []);

  return null;
}
