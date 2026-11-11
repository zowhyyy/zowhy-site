"use client";

import { useEffect } from "react";

/**
 * Efeitos globais:
 *  • onda (ripple) ao clicar em botões;
 *  • jorro de sangue em pixel art saindo da ponta da faca (cursor) a cada clique — só com mouse;
 *  • corte em pixel art enquanto se segura o botão esquerdo e arrasta: o corte vai sumindo pela ponta de trás
 *    e, de vez em quando, uma gotinha de sangue em pixel escorre dele, cai devagar e some.
 *    Aparece mesmo com "reduzir movimento" ligado no sistema, por escolha da dona da loja.
 * O cursor de faca em si fica no globals.css (procure "Cursor de faca").
 */
export function Efeitos() {
  useEffect(() => {
    const mouseFino = window.matchMedia("(any-pointer: fine)");
    let timerSuja: number | undefined;

    function onda(e: PointerEvent) {
      const alvo = (e.target as Element | null)?.closest?.(".btn, .chip, .btn-rapido") as HTMLElement | null;
      if (!alvo || alvo.matches(":disabled, [aria-disabled='true']")) return;
      const r = alvo.getBoundingClientRect();
      const tam = Math.max(r.width, r.height) * 2.2;
      const s = document.createElement("span");
      s.className = "onda";
      s.style.width = s.style.height = `${tam}px`;
      s.style.left = `${e.clientX - r.left - tam / 2}px`;
      s.style.top = `${e.clientY - r.top - tam / 2}px`;
      alvo.appendChild(s);
      s.addEventListener("animationend", () => s.remove());
    }

    // Pixels de 2 em 2 px, para as gotas andarem "em grade" como pixel art
    const px = (v: number) => Math.round(v / 2) * 2;

    function sangue(e: PointerEvent) {
      if (e.pointerType !== "mouse" || e.button !== 0 || !mouseFino.matches) return;

      // A faca fica suja de sangue por um instante
      document.documentElement.classList.add("faca-suja");
      window.clearTimeout(timerSuja);
      timerSuja = window.setTimeout(() => document.documentElement.classList.remove("faca-suja"), 800);

      const camada = document.createElement("div");
      camada.className = "sangue";
      camada.style.left = `${e.clientX}px`;
      camada.style.top = `${e.clientY}px`;

      const poca = document.createElement("span");
      poca.className = "sangue-poca";
      camada.appendChild(poca);

      // Jorro: partículas quadradas de pixel saem da ponta da faca para cima e caem com a gravidade
      const qtd = 16 + Math.floor(Math.random() * 7);
      for (let i = 0; i < qtd; i++) {
        const gota = document.createElement("span");
        gota.className = "sangue-gota";
        const sorte = Math.random();
        const tam = sorte < 0.5 ? 2 : sorte < 0.85 ? 4 : 6;
        gota.style.width = gota.style.height = `${tam}px`;
        if (Math.random() < 0.3) gota.style.background = "#822434";
        camada.appendChild(gota);

        const angulo = ((-155 + Math.random() * 130) * Math.PI) / 180; // leque para cima
        const forca = 26 + Math.random() * 54;
        const dx = Math.cos(angulo) * forca;
        const dy = Math.sin(angulo) * forca;
        const queda = 40 + Math.random() * 40;
        gota.animate(
          [
            { transform: "translate(0, 0)", opacity: 1 },
            { transform: `translate(${px(dx * 0.7)}px, ${px(dy * 0.9)}px)`, opacity: 1, offset: 0.35 },
            { transform: `translate(${px(dx * 0.9)}px, ${px(dy * 0.6 + queda * 0.5)}px)`, opacity: 1, offset: 0.7 },
            { transform: `translate(${px(dx)}px, ${px(dy * 0.3 + queda)}px)`, opacity: 0 },
          ],
          { duration: 620 + Math.random() * 320, delay: Math.random() * 60, easing: "steps(10)", fill: "both" },
        );
      }

      document.body.appendChild(camada);
      window.setTimeout(() => camada.remove(), 1200);
    }

    // ── Corte: segurar o botão esquerdo e arrastar risca um corte de sangue em pixel art atrás da faca.
    // Enquanto se corta, a linha vai sumindo a partir da ponta de trás (como um pavio que se consome):
    // o trecho mais velho afina e desbota até desaparecer, e a parte perto da faca continua inteira.
    // Só começa depois de alguns pixels de arrasto (um clique parado continua sendo só o jorro acima).
    const PX = 3; // tamanho de cada "pixel" do corte, em px da tela
    const VIDA = 260; // quanto tempo (ms) cada pedaço do corte dura até sumir: menos tempo, rastro mais curto
    type Ponto = { x: number; y: number; t: number };
    type Corte = { pontos: Ponto[] };
    // Gotas: num canvas à parte, com pixel menor (2 px), para ficarem pequenas.
    // Nascem num ponto do corte, escorrem um fiozinho, se soltam, caem devagar um pouco e somem ali mesmo.
    const PX_GOTA = 2;
    /** Coordenadas em "pixels" do canvas das gotas. */
    type Gota = { x: number; y0: number; nasceu: number };
    const FORMAR = 300; // ms pendurada no corte antes de cair
    const CAIR = 850; // ms caindo; depois some de uma vez
    let canvas: HTMLCanvasElement | null = null;
    let ctx: CanvasRenderingContext2D | null = null;
    let canvasGotas: HTMLCanvasElement | null = null;
    let ctxGotas: CanvasRenderingContext2D | null = null;
    let inicio: Ponto | null = null;
    let atual: Corte | null = null;
    let cortes: Corte[] = [];
    let gotas: Gota[] = [];
    let quadro = 0;
    let cortouAgora = false;

    function prepararCanvas() {
      if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.className = "corte";
        document.body.appendChild(canvas);
        ctx = canvas.getContext("2d");
        canvasGotas = document.createElement("canvas");
        canvasGotas.className = "corte";
        document.body.appendChild(canvasGotas);
        ctxGotas = canvasGotas.getContext("2d");
      }
      canvas.width = Math.ceil(window.innerWidth / PX);
      canvas.height = Math.ceil(window.innerHeight / PX);
      canvasGotas!.width = Math.ceil(window.innerWidth / PX_GOTA);
      canvasGotas!.height = Math.ceil(window.innerHeight / PX_GOTA);
    }

    /**
     * Pinta os pixels da reta entre dois pontos (Bresenham).
     * idade: 0 = acabou de ser cortado, 1 = sumiu.
     */
    function riscar(a: Ponto, b: Ponto, idade: number) {
      if (!ctx) return;
      let x0 = Math.round(a.x / PX);
      let y0 = Math.round(a.y / PX);
      const x1 = Math.round(b.x / PX);
      const y1 = Math.round(b.y / PX);
      const dx = Math.abs(x1 - x0);
      const dy = -Math.abs(y1 - y0);
      const sx = x0 < x1 ? 1 : -1;
      const sy = y0 < y1 ? 1 : -1;
      let erro = dx + dy;
      // Desbota em degraus (fica com cara de pixel art) e afina conforme envelhece
      ctx.globalAlpha = Math.ceil((1 - idade) * 5) / 5;
      for (;;) {
        if (idade < 0.45) {
          // Inteiro: sombra embaixo, sangue e um brilho de vez em quando
          ctx.fillStyle = "#4a0a14";
          ctx.fillRect(x0, y0 + 1, 1, 1);
          ctx.fillStyle = "#c8182f";
          ctx.fillRect(x0, y0 - 1, 1, 2);
          if ((x0 + y0) % 3 === 0) {
            ctx.fillStyle = "#ff8a96";
            ctx.fillRect(x0, y0 - 2, 1, 1);
          }
        } else if (idade < 0.75) {
          // Afinando
          ctx.fillStyle = "#4a0a14";
          ctx.fillRect(x0, y0 + 1, 1, 1);
          ctx.fillStyle = "#c8182f";
          ctx.fillRect(x0, y0, 1, 1);
        } else {
          // Um fio, quase sumindo
          ctx.fillStyle = "#a5172e";
          ctx.fillRect(x0, y0, 1, 1);
        }
        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * erro;
        if (e2 >= dy) {
          erro += dy;
          x0 += sx;
        }
        if (e2 <= dx) {
          erro += dx;
          y0 += sy;
        }
      }
    }

    /**
     * Gota pequena em pixel art (3 × 3, cada pixel = 2 px da tela), com a ponta em (x, y):
     *   . o .      o = sangue
     *   b o o      b = brilho
     *   . s .      s = sombra
     */
    function pintarGota(c: CanvasRenderingContext2D, x: number, y: number) {
      c.fillStyle = "#c8182f";
      c.fillRect(x, y, 1, 2);
      c.fillRect(x + 1, y + 1, 1, 1);
      c.fillStyle = "#ff8a96";
      c.fillRect(x - 1, y + 1, 1, 1);
      c.fillStyle = "#7a0f1f";
      c.fillRect(x, y + 2, 1, 1);
    }

    function desenharGotas(agora: number) {
      const c = ctxGotas;
      if (!c || !canvasGotas) return;
      c.clearRect(0, 0, canvasGotas.width, canvasGotas.height);
      gotas = gotas.filter((g) => agora - g.nasceu < FORMAR + CAIR);
      for (const g of gotas) {
        const t = agora - g.nasceu;
        if (t < FORMAR) {
          // Pendurada: um fiozinho escorre do corte e a gota vai enchendo na ponta
          const fio = Math.floor((t / FORMAR) * 3);
          c.fillStyle = "#a5172e";
          c.fillRect(g.x, g.y0, 1, fio);
          if (t < FORMAR * 0.5) {
            c.fillStyle = "#c8182f";
            c.fillRect(g.x, g.y0 + fio, 1, 1);
          } else {
            pintarGota(c, g.x, g.y0 + fio);
          }
        } else if (t < FORMAR + CAIR - 90) {
          // Caindo devagar (só um pouco), sem desbotar
          const s = (t - FORMAR) / 1000;
          pintarGota(c, g.x, Math.round(g.y0 + 3 + 9 * s + 10 * s * s));
        } else {
          // Some ali mesmo: encolhe para um pixel e desaparece
          const s = (CAIR - 90) / 1000;
          c.fillStyle = "#a5172e";
          c.fillRect(g.x, Math.round(g.y0 + 4 + 9 * s + 10 * s * s), 1, 1);
        }
      }
    }

    function desenhar(agora: number) {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const c of cortes) {
        // Joga fora o que já sumiu (fica sempre o último ponto, onde a faca está)
        while (c.pontos.length > 1 && agora - c.pontos[1].t > VIDA) c.pontos.shift();
        for (let i = 1; i < c.pontos.length; i++) {
          const idade = (agora - c.pontos[i].t) / VIDA;
          if (idade < 1) riscar(c.pontos[i - 1], c.pontos[i], idade);
        }
      }
      ctx.globalAlpha = 1;
      desenharGotas(agora);
      // Corte que a faca já soltou e que sumiu por inteiro: sai da lista
      cortes = cortes.filter((c) => c === atual || (c.pontos.length > 0 && agora - c.pontos[c.pontos.length - 1].t < VIDA));
      quadro = cortes.length || gotas.length ? requestAnimationFrame(desenhar) : 0;
    }

    function animar() {
      if (!quadro) quadro = requestAnimationFrame(desenhar);
    }

    function sujarFaca() {
      document.documentElement.classList.add("faca-suja");
      window.clearTimeout(timerSuja);
    }

    function comecarCorte(e: PointerEvent) {
      if (e.pointerType !== "mouse" || e.button !== 0 || !mouseFino.matches) return;
      if ((e.target as Element | null)?.closest?.(".barra-trilho")) return; // arrastar a barra de rolagem não corta
      inicio = { x: e.clientX, y: e.clientY, t: performance.now() };
    }

    function moverCorte(e: PointerEvent) {
      if (!inicio || !(e.buttons & 1)) return;
      const p = { x: e.clientX, y: e.clientY, t: performance.now() };
      if (!atual) {
        if (Math.hypot(p.x - inicio.x, p.y - inicio.y) < 8) return;
        prepararCanvas();
        atual = { pontos: [{ ...inicio, t: p.t }] };
        cortes.push(atual);
        document.documentElement.classList.add("cortando");
        window.getSelection()?.removeAllRanges();
      }
      const ultimo = atual.pontos[atual.pontos.length - 1];
      if (Math.hypot(p.x - ultimo.x, p.y - ultimo.y) < PX) return;
      atual.pontos.push(p);
      sujarFaca();
      // De vez em quando (pouco) uma gota escorre de um ponto um pouco atrás da faca
      const n = atual.pontos.length;
      if (n > 6 && Math.random() < 0.035 && gotas.length < 8) {
        const origem = atual.pontos[n - 3 - Math.floor(Math.random() * Math.min(6, n - 3))];
        // Logo abaixo da linha do corte (que vai até 1 pixel de 3 px abaixo do ponto)
        gotas.push({ x: Math.round(origem.x / PX_GOTA), y0: Math.round((origem.y + PX * 2) / PX_GOTA), nasceu: p.t });
      }
      animar();
    }

    function soltarCorte() {
      inicio = null;
      if (!atual) return;
      atual = null; // o que sobrou do corte termina de sumir sozinho
      cortouAgora = true; // o clique que vem junto com o soltar não abre link
      window.setTimeout(() => (cortouAgora = false), 0);
      document.documentElement.classList.remove("cortando");
      timerSuja = window.setTimeout(() => document.documentElement.classList.remove("faca-suja"), 800);
      animar();
    }

    function engolirClique(e: MouseEvent) {
      if (!cortouAgora) return;
      e.preventDefault();
      e.stopPropagation();
    }

    function redimensionar() {
      if (canvas) prepararCanvas();
    }

    document.addEventListener("pointerdown", onda);
    document.addEventListener("pointerdown", sangue);
    document.addEventListener("pointerdown", comecarCorte);
    document.addEventListener("pointermove", moverCorte);
    document.addEventListener("pointerup", soltarCorte);
    document.addEventListener("pointercancel", soltarCorte);
    document.addEventListener("click", engolirClique, true);
    window.addEventListener("blur", soltarCorte);
    window.addEventListener("resize", redimensionar);
    return () => {
      document.removeEventListener("pointerdown", onda);
      document.removeEventListener("pointerdown", sangue);
      document.removeEventListener("pointerdown", comecarCorte);
      document.removeEventListener("pointermove", moverCorte);
      document.removeEventListener("pointerup", soltarCorte);
      document.removeEventListener("pointercancel", soltarCorte);
      document.removeEventListener("click", engolirClique, true);
      window.removeEventListener("blur", soltarCorte);
      window.removeEventListener("resize", redimensionar);
      window.clearTimeout(timerSuja);
      cancelAnimationFrame(quadro);
      canvas?.remove();
      canvasGotas?.remove();
    };
  }, []);

  return null;
}
