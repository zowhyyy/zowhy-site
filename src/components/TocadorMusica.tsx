"use client";

import { useEffect, useRef, useState } from "react";
import { loja } from "@/data/config-loja";

/** O pedaço da API do player do SoundCloud que o site usa. */
type Widget = {
  bind: (evento: string, fn: () => void) => void;
  load: (url: string, opcoes: Record<string, unknown>) => void;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
};
declare global {
  interface Window {
    SC?: { Widget: ((iframe: HTMLIFrameElement) => Widget) & { Events: Record<string, string> } };
  }
}

type Estado = "parado" | "carregando" | "tocando" | "pausado" | "erro";

const CHAVE_VOLUME = "zowhy-volume";

const API = "https://w.soundcloud.com/player/api.js";
const urlFaixa = (id: string) => `https://api.soundcloud.com/tracks/${id}`;
const OPCOES = { auto_play: true, visual: false, show_comments: false };

function carregarApi() {
  return new Promise<void>((pronto, falhou) => {
    if (window.SC) return pronto();
    const existente = document.querySelector<HTMLScriptElement>(`script[src="${API}"]`);
    const s = existente ?? document.createElement("script");
    s.addEventListener("load", () => pronto());
    s.addEventListener("error", () => falhou());
    if (!existente) {
      s.src = API;
      s.async = true;
      document.body.append(s);
    }
  });
}

/**
 * Toca as músicas do site (lista em loja.musicas), dentro do menu. Nada é baixado até a pessoa apertar o play:
 * aí o player do SoundCloud entra escondido e este botão comanda ele. Quando uma música acaba, entra a próxima;
 * no fim da lista, volta para a primeira. Como o menu não é refeito ao trocar de página, a música continua tocando.
 */
export function TocadorMusica({ className = "" }: { className?: string }) {
  const musicas = loja.musicas;
  const [estado, setEstado] = useState<Estado>("parado");
  const [ativo, setAtivo] = useState(false);
  const [indice, setIndice] = useState(0);
  const quadro = useRef<HTMLIFrameElement>(null);
  const widget = useRef<Widget | null>(null);
  const atual = useRef(0);
  const [volume, setVolume] = useState(60);
  const volumeAtual = useRef(60);
  const [painelVolume, setPainelVolume] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);

  // Volume que a pessoa escolheu na última visita
  useEffect(() => {
    try {
      const salvo = Number(localStorage.getItem(CHAVE_VOLUME));
      if (localStorage.getItem(CHAVE_VOLUME) !== null && salvo >= 0 && salvo <= 100) {
        volumeAtual.current = salvo;
        setVolume(salvo);
      }
    } catch {
      // Sem armazenamento: fica o volume padrão
    }
  }, []);

  // Fecha o controle de volume ao clicar fora ou apertar Esc
  useEffect(() => {
    if (!painelVolume) return;
    const fora = (e: PointerEvent) => !raiz.current?.contains(e.target as Node) && setPainelVolume(false);
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && setPainelVolume(false);
    document.addEventListener("pointerdown", fora);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("pointerdown", fora);
      document.removeEventListener("keydown", tecla);
    };
  }, [painelVolume]);

  // Liga o player quando o iframe entra na página
  useEffect(() => {
    if (!ativo || !quadro.current) return;
    let cancelado = false;
    const limite = window.setTimeout(() => !cancelado && setEstado((e) => (e === "carregando" ? "erro" : e)), 12000);
    carregarApi()
      .then(() => {
        if (cancelado || !window.SC || !quadro.current) return;
        const w = window.SC.Widget(quadro.current);
        const ev = window.SC.Widget.Events;
        widget.current = w;
        // READY chega a cada música carregada: aplica o volume escolhido e toca
        w.bind(ev.READY, () => {
          w.setVolume(volumeAtual.current);
          w.play();
        });
        w.bind(ev.PLAY, () => setEstado("tocando"));
        w.bind(ev.PAUSE, () => setEstado("pausado"));
        // Acabou a música: entra a próxima da lista (ou a primeira de novo)
        w.bind(ev.FINISH, () => {
          atual.current = (atual.current + 1) % musicas.length;
          setIndice(atual.current);
          setEstado("carregando");
          w.load(urlFaixa(musicas[atual.current].faixaId), OPCOES);
        });
      })
      .catch(() => !cancelado && setEstado("erro"));
    return () => {
      cancelado = true;
      window.clearTimeout(limite);
    };
  }, [ativo, musicas]);

  const musica = musicas[indice];

  function alternar() {
    if (estado === "erro") return window.open(musica.link, "_blank", "noopener");
    if (!ativo) {
      setAtivo(true);
      setEstado("carregando");
      return;
    }
    if (estado === "tocando") widget.current?.pause();
    else widget.current?.play();
  }

  function mudarVolume(valor: number) {
    volumeAtual.current = valor;
    setVolume(valor);
    widget.current?.setVolume(valor);
    try {
      localStorage.setItem(CHAVE_VOLUME, String(valor));
    } catch {
      // Sem armazenamento: o volume vale só nesta visita
    }
  }

  const tocando = estado === "tocando";
  const legenda = { parado: "Ouvir", carregando: "Carregando", tocando: "Tocando", pausado: "Pausado", erro: "Abrir no SoundCloud" }[estado];

  return (
    <div ref={raiz} className={`tocador relative flex items-center gap-2 ${tocando ? "tocando" : ""} ${className}`}>
      <button
        type="button"
        onClick={alternar}
        title={`${legenda}: ${musica.titulo} · ${musica.artista}`}
        className="botao-musica vidro relative grid h-8 w-8 shrink-0 place-items-center rounded-full text-vinho"
        aria-label={tocando ? `Pausar a música ${musica.titulo}` : `Tocar a música ${musica.titulo}, de ${musica.artista}`}
        aria-pressed={tocando}
      >
        {tocando ? (
          <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" aria-hidden="true">
            <rect x="1.5" y="1" width="2.5" height="8" rx="0.6" fill="currentColor" />
            <rect x="6" y="1" width="2.5" height="8" rx="0.6" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 10 10" className="ml-0.5 h-2.5 w-2.5" aria-hidden="true">
            <path d="M2 1 9 5 2 9Z" fill="currentColor" />
          </svg>
        )}
      </button>
      {/* Telas menores: só o equalizador, que aparece enquanto toca */}
      <span className="equalizador eq-compacto xl:hidden" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="hidden min-w-0 flex-col xl:flex">
        <span className="mono flex items-center gap-1.5 text-[0.5rem] text-suave" aria-live="polite">
          <span className="equalizador" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          {legenda}
        </span>
        <a href={musica.link} target="_blank" rel="noopener noreferrer" className="max-w-[7.5rem] truncate text-[0.75rem] font-medium hover:text-vinho">
          {musica.titulo} · <span className="text-suave">{musica.artista}</span>
        </a>
      </span>
      {/* Volume: no computador. No celular a pessoa usa os botões do próprio aparelho. */}
      <button
        type="button"
        onClick={() => setPainelVolume((a) => !a)}
        className="botao-volume hidden h-8 w-6 place-items-center text-suave transition-colors hover:text-vinho md:grid"
        aria-label={`Volume da música: ${volume}%`}
        aria-expanded={painelVolume}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" />
          {volume > 0 && <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5" />}
          {volume > 55 && <path d="M18 7a7 7 0 0 1 0 10" />}
          {volume === 0 && <path d="m16 10 4 4m0-4-4 4" />}
        </svg>
      </button>
      {painelVolume && (
        <div className="painel-volume entrar absolute top-full right-0 z-30 mt-3 w-52 rounded-[18px] bg-white p-4 shadow-[0_18px_40px_-16px_rgb(37_32_29/0.5)]">
          <p className="mono flex justify-between text-[0.52rem] text-suave">
            <span>Volume</span>
            <span className="text-vinho">{volume}%</span>
          </p>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={volume}
            onChange={(e) => mudarVolume(Number(e.target.value))}
            className="volume mt-3 w-full"
            style={{ "--v": `${volume}%` } as React.CSSProperties}
            aria-label="Volume da música"
          />
          <button type="button" onClick={() => mudarVolume(volume === 0 ? 60 : 0)} className="link mt-2 text-xs">
            {volume === 0 ? "Ligar o som" : "Silenciar"}
          </button>
        </div>
      )}
      {ativo && (
        <iframe
          ref={quadro}
          title={`Player do SoundCloud: ${musica.titulo}`}
          src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(urlFaixa(musicas[0].faixaId))}&auto_play=true&visual=false&show_comments=false`}
          allow="autoplay; encrypted-media"
          className="pointer-events-none fixed bottom-0 left-0 h-px w-px opacity-0"
          tabIndex={-1}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
