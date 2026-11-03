"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { loja } from "@/data/config-loja";
import { formatarPreco } from "@/lib/precos";
import type { PaginaLookbook, Produto } from "@/lib/tipos";
import { FotoPeca } from "./FotoPeca";
import { IconeAnterior, IconeFechar, IconeProximo } from "./Icones";

/** Setas saindo para os cantos: "ver em tela cheia". */
function IconeAmpliar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />
    </svg>
  );
}

type Pagina = PaginaLookbook & { produtos: Produto[] };

const dois = (n: number) => String(n).padStart(2, "0");
const DURACAO = 1000; // tempo de virar uma folha (ms), igual ao CSS .folha

/** Clique em link ou botão dentro da página não vira a folha. */
const cliqueEmControle = (e: React.MouseEvent) => (e.target as Element).closest("a, button") !== null;

function partir(titulo: string) {
  const [primeira, ...resto] = titulo.split(" ");
  return [primeira, resto.join(" ")] as const;
}

// ── Conteúdo das páginas ──────────────────────────────────────────

function Capa({ total }: { total: number }) {
  return (
    <div className="tom-vinho grao cantos relative flex h-full flex-col justify-between p-[7%] text-white">
      <div className="relative z-[3] flex items-start justify-between gap-4">
        <span className="mono text-white/80">{loja.nome.toLowerCase()} / lookbook</span>
        <span className="mono text-white/60">{dois(total)} looks</span>
      </div>
      <div className="relative z-[3]">
        <p className="disp text-[clamp(2.6rem,7.5cqw,5.6rem)] leading-[0.9]">
          Look
          <br />
          book
        </p>
        <p className="titulo mt-3 text-[clamp(1.8rem,5.5cqw,3.4rem)] text-white/85">peças do brechó</p>
      </div>
      <div className="relative z-[3] flex items-end justify-between gap-4">
        <div className="chapa-balanca metal flex w-[min(11rem,45%)] flex-col gap-1 rounded-[2px] px-3.5 py-2.5 text-grafite">
          <span className="mono text-[0.5rem] text-[#5a5450]">{loja.nome.toLowerCase()}</span>
          <span className="text-[1.35rem] leading-none font-light text-tinta">
            (garimpo)<sup className="text-[0.7rem] text-vinho">2</sup>
          </span>
        </div>
        <span className="mono dica-virar text-white/80">abrir →</span>
      </div>
    </div>
  );
}

function Info({ pagina, numero, total, lado }: { pagina: Pagina; numero: number; total: number; lado: number }) {
  const [primeira, resto] = partir(pagina.titulo);
  return (
    <div className="papel flex h-full flex-col p-[8%]">
      <p className="mono flex items-center gap-2.5 text-[#5a5450]">
        <span className="inline-block h-2 w-2 bg-vinho" aria-hidden="true" />
        Look {dois(numero)} / {dois(total)}
      </p>
      <h2 className="mt-[6%] flex flex-col">
        <span className="disp text-[clamp(1.4rem,7.5cqw,3.2rem)]">{primeira}</span>
        {resto && <span className="titulo text-[clamp(2rem,11cqw,4.8rem)] leading-[1] text-vinho">{resto}</span>}
      </h2>
      {pagina.texto && <p className="mt-4 max-w-[34ch] text-[clamp(0.9rem,2.4cqw,1.05rem)] leading-relaxed text-[#3f3935]">{pagina.texto}</p>}

      <div className="mt-auto pt-6">
        <p className="mono border-b border-grafite/15 pb-2 text-[0.58rem] text-[#5a5450]">
          {pagina.produtos.length > 0 ? `Peças deste look · ${pagina.produtos.length}` : "Peças deste look"}
        </p>
        {pagina.produtos.length > 0 ? (
          <ul className="flex flex-col">
            {pagina.produtos.slice(0, 4).map((p) => {
              const vendida = p.situacao === "vendida";
              return (
                <li key={p.slug} className="border-b border-grafite/10">
                  <Link href={`/peca/${p.slug}`} className="group flex items-center gap-3 py-2">
                    <span className={`relative block h-12 w-10 shrink-0 overflow-hidden rounded-md bg-nevoa ${vendida ? "grayscale" : ""}`}>
                      <FotoPeca produto={p} sizes="40px" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.85rem] font-medium transition-colors group-hover:text-vinho">{p.nome}</span>
                      <span className="mono block text-[0.52rem] text-suave">
                        {p.marca} · {p.tamanho}
                      </span>
                    </span>
                    <span className={vendida ? "text-[0.78rem] text-suave" : "preco text-[0.78rem]"}>{vendida ? "Vendida" : formatarPreco(p.preco)}</span>
                    <span className="text-vinho transition-transform group-hover:translate-x-1" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="pt-3 text-[0.88rem] text-suave">
            Gostou de alguma peça da foto?{" "}
            <a href={loja.dmUrl} target="_blank" rel="noopener noreferrer" className="link">
              Pergunte na DM
            </a>
          </p>
        )}
        <p className="mono mt-4 text-[0.55rem] text-suave">p. {dois(lado)}</p>
      </div>
    </div>
  );
}

function Foto({
  pagina,
  numero,
  lado,
  prioridade,
  ampliar,
}: {
  pagina: Pagina;
  numero: number;
  lado: number;
  prioridade: boolean;
  ampliar: () => void;
}) {
  return (
    <div className="grao cantos relative h-full bg-grafite text-white/80">
      <Image
        src={pagina.foto}
        alt={`Look ${dois(numero)}${pagina.titulo ? `: ${pagina.titulo}` : ""}`}
        fill
        sizes="(min-width: 768px) 40vw, 92vw"
        className="object-cover"
        style={{ objectPosition: pagina.posicao ?? "center" }}
        priority={prioridade}
        draggable={false}
      />
      <span className="mono absolute top-[5%] right-[6%] z-[3] text-white/85">Look {dois(numero)}</span>
      {/* A página corta a foto: este botão abre ela inteira */}
      <button
        type="button"
        onClick={ampliar}
        className="vidro group absolute top-[4%] left-[6%] z-[4] flex items-center gap-2 rounded-full py-1.5 pr-3.5 pl-2 text-grafite transition-transform duration-300 hover:scale-105"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-vinho text-white transition-transform duration-300 group-hover:rotate-90">
          <IconeAmpliar className="h-3.5 w-3.5" />
        </span>
        <span className="mono text-[0.58rem]">Ver inteira</span>
      </button>
      <span className="mono absolute right-[6%] bottom-[4%] z-[3] text-[0.55rem] text-white/70 max-md:hidden">p. {dois(lado)}</span>
      {/* No celular só aparece este lado do livro: o título e as peças vêm por cima da foto */}
      <div className="vidro absolute inset-x-3 bottom-3 z-[3] rounded-2xl p-3.5 text-grafite md:hidden">
        <p className="titulo text-[1.7rem] leading-none text-vinho">{pagina.titulo}</p>
        {pagina.produtos.length > 0 && (
          <ul className="sem-barra mt-2.5 flex gap-1.5 overflow-x-auto">
            {pagina.produtos.map((p) => (
              <li key={p.slug} className="shrink-0">
                <Link href={`/peca/${p.slug}`} className="flex items-center gap-2 rounded-full bg-white/70 py-1 pr-3 pl-1 text-[0.75rem] font-medium">
                  <span className="relative block h-7 w-7 overflow-hidden rounded-full bg-nevoa">
                    <FotoPeca produto={p} sizes="28px" />
                  </span>
                  {p.situacao === "vendida" ? "Vendida" : formatarPreco(p.preco)}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Citacao() {
  return (
    <div className="papel flex h-full flex-col justify-between p-[8%]">
      <span className="mono text-[#5a5450]">{loja.nome.toLowerCase()} / nota</span>
      <p className="titulo text-[clamp(2.2rem,7cqw,4.2rem)] leading-[1.02]">
        Cada peça existe <span className="text-vinho">uma vez só.</span>
      </p>
      <span className="logo text-[1.1rem]">{loja.nome}</span>
    </div>
  );
}

function Fim({ voltar }: { voltar: () => void }) {
  return (
    <div className="papel relative flex h-full flex-col justify-between overflow-hidden p-[8%]">
      <span className="mono text-[#5a5450]">fim / {loja.nome.toLowerCase()}</span>
      <div>
        <p className="disp text-[clamp(2.2rem,7cqw,4rem)] leading-none">Fim</p>
        <p className="titulo text-[clamp(2.4rem,7.5cqw,4.4rem)] leading-none text-vinho">do lookbook</p>
        <p className="mt-4 max-w-[32ch] text-[clamp(0.9rem,2.4cqw,1.05rem)] text-[#3f3935]">
          Gostou de alguma peça? Ela está na loja, mas só existe uma.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/loja" className="btn btn-cheio">
          Ir para a loja <IconeProximo className="h-4 w-4" />
        </Link>
        <button type="button" onClick={voltar} className="link text-sm">
          Voltar à capa
        </button>
      </div>
    </div>
  );
}

function Contracapa() {
  return (
    <div className="tom-vinho grao relative grid h-full place-items-center">
      <span className="logo relative z-[3] text-[1.6rem] text-white">{loja.nome}</span>
    </div>
  );
}

// ── Foto inteira ──────────────────────────────────────────────────

/** Abre a foto do look sem corte, em tela cheia, com setas para passar entre os looks. */
function FotoInteira({
  paginas,
  indice,
  mudar,
  fechar,
}: {
  paginas: Pagina[];
  indice: number;
  mudar: (i: number) => void;
  fechar: () => void;
}) {
  const pagina = paginas[indice];
  const total = paginas.length;

  useEffect(() => {
    const teclas = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
      if (e.key === "ArrowRight") mudar((indice + 1) % total);
      if (e.key === "ArrowLeft") mudar((indice - 1 + total) % total);
    };
    window.addEventListener("keydown", teclas);
    const antes = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden"; // a página atrás não rola
    return () => {
      window.removeEventListener("keydown", teclas);
      document.documentElement.style.overflow = antes;
    };
  }, [indice, total, mudar, fechar]);

  return (
    <div role="dialog" aria-modal="true" aria-label={`Look ${dois(indice + 1)}: foto inteira`} className="foto-inteira" onClick={fechar}>
      <figure className="foto-inteira-quadro" onClick={(e) => e.stopPropagation()}>
        <Image key={pagina.id} src={pagina.foto} alt={`Look ${dois(indice + 1)}: ${pagina.titulo}`} fill sizes="100vw" className="foto-inteira-img object-contain" priority />
      </figure>

      <div className="vidro foto-inteira-barra" onClick={(e) => e.stopPropagation()}>
        {total > 1 && (
          <button type="button" onClick={() => mudar((indice - 1 + total) % total)} className="seta-carrossel seta-clara" aria-label="Look anterior">
            <IconeAnterior className="h-5 w-5" />
          </button>
        )}
        <p className="min-w-0 px-2">
          <span className="mono block text-[0.55rem] text-suave">
            Look {dois(indice + 1)} / {dois(total)}
          </span>
          <span className="titulo block truncate text-[1.5rem] leading-tight text-vinho">{pagina.titulo}</span>
        </p>
        {total > 1 && (
          <button type="button" onClick={() => mudar((indice + 1) % total)} className="seta-carrossel seta-clara" aria-label="Próximo look">
            <IconeProximo className="h-5 w-5" />
          </button>
        )}
      </div>

      <button type="button" onClick={fechar} className="vidro foto-inteira-fechar" aria-label="Fechar foto">
        <IconeFechar className="h-5 w-5" />
      </button>
    </div>
  );
}

// ── Livro ─────────────────────────────────────────────────────────

/**
 * Lookbook em forma de livro. Cada folha tem frente e verso e vira pela lombada.
 * No computador o livro aberto mostra duas páginas: à esquerda o texto e as peças, à direita a foto.
 * No celular aparece uma página por vez.
 */
export function LivroLookbook({ paginas }: { paginas: Pagina[] }) {
  const N = paginas.length;
  const totalFolhas = N + 2; // capa + uma por foto + fim
  const [aberta, setAberta] = useState(0); // quantas folhas já foram viradas
  const [movendo, setMovendo] = useState<{ de: number; ate: number } | null>(null);
  const [ampliada, setAmpliada] = useState<number | null>(null); // look aberto em tela cheia
  const arrasto = useRef<number | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const ir = useCallback(
    (alvo: number) => {
      const destino = Math.max(0, Math.min(totalFolhas - 1, alvo));
      if (destino === aberta) return;
      setMovendo({ de: aberta, ate: destino });
      setAberta(destino);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setMovendo(null), DURACAO + Math.abs(destino - aberta) * 90 + 50);
    },
    [aberta, totalFolhas],
  );

  useEffect(() => {
    const teclas = (e: KeyboardEvent) => {
      if (ampliada !== null) return; // com a foto aberta, as setas passam as fotos, não as páginas
      if ((e.target as Element).closest?.("input, textarea, select")) return;
      if (e.key === "ArrowRight") ir(aberta + 1);
      if (e.key === "ArrowLeft") ir(aberta - 1);
    };
    window.addEventListener("keydown", teclas);
    return () => window.removeEventListener("keydown", teclas);
  }, [aberta, ir, ampliada]);

  const mudarAmpliada = useCallback((i: number) => setAmpliada(i), []);
  // Ao fechar, o livro vai até a página do look que estava aberto
  const fecharAmpliada = useCallback(() => {
    setAmpliada((i) => {
      if (i !== null && i + 1 !== aberta) window.setTimeout(() => ir(i + 1), 0);
      return null;
    });
  }, [aberta, ir]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (N === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-10">
        <div className="vidro rounded-[28px] p-10 text-center">
          <p className="titulo text-4xl">O lookbook está sendo montado.</p>
          <p className="mt-3 text-suave">As fotos chegam em breve. Enquanto isso, veja as peças na loja.</p>
          <Link href="/loja" className="btn btn-cheio mt-6">
            Ver a loja
          </Link>
        </div>
      </div>
    );
  }

  const rotulo = (k: number) => (k === 0 ? "Capa" : k === totalFolhas - 1 ? "Fim" : `Look ${dois(k)}`);

  const folhas = Array.from({ length: totalFolhas }, (_, i) => {
    let frente: React.ReactNode;
    let verso: React.ReactNode;
    if (i === 0) {
      frente = <Capa total={N} />;
      verso = <Info pagina={paginas[0]} numero={1} total={N} lado={2} />;
    } else if (i <= N) {
      frente = <Foto pagina={paginas[i - 1]} numero={i} lado={i * 2 + 1} prioridade={i === 1} ampliar={() => setAmpliada(i - 1)} />;
      verso = i < N ? <Info pagina={paginas[i]} numero={i + 1} total={N} lado={i * 2 + 2} /> : <Citacao />;
    } else {
      frente = <Fim voltar={() => ir(0)} />;
      verso = <Contracapa />;
    }

    const virada = i < aberta;
    // Folhas que estão virando agora ficam por cima de tudo, em ordem, com um pequeno atraso entre elas
    let z = virada ? i + 1 : totalFolhas - i;
    let atraso = 0;
    if (movendo) {
      const [a, b] = movendo.ate > movendo.de ? [movendo.de, movendo.ate] : [movendo.ate, movendo.de];
      if (i >= a && i < b) {
        const ordem = movendo.ate > movendo.de ? i - a : b - 1 - i;
        z = totalFolhas * 2 + (movendo.ate > movendo.de ? i : totalFolhas - i);
        atraso = ordem * 90;
      }
    }
    const visivel = i === aberta || i === aberta - 1 || movendo !== null;

    return (
      <div
        key={i}
        className={`folha ${virada ? "folha-virada" : ""}`}
        style={{ zIndex: z, transitionDelay: `${atraso}ms` }}
        aria-hidden={!visivel || undefined}
        inert={!(i === aberta || i === aberta - 1)}
      >
        <div
          className="face face-frente"
          onClick={(e) => {
            if (i === aberta && !cliqueEmControle(e)) ir(aberta + 1);
          }}
        >
          {frente}
          {i < totalFolhas - 1 && <span className="dobra" aria-hidden="true" />}
        </div>
        <div
          className="face face-verso"
          onClick={(e) => {
            if (i === aberta - 1 && !cliqueEmControle(e)) ir(aberta - 1);
          }}
        >
          {verso}
        </div>
      </div>
    );
  });

  return (
    <section aria-roledescription="livro" aria-label="Lookbook" className="px-3 pt-8 pb-6 sm:px-6 lg:pt-10">
      <div
        className="livro"
        onPointerDown={(e) => (arrasto.current = e.clientX)}
        onPointerUp={(e) => {
          if (arrasto.current === null) return;
          const dx = e.clientX - arrasto.current;
          arrasto.current = null;
          if (Math.abs(dx) > 50) ir(aberta + (dx < 0 ? 1 : -1));
        }}
        style={{ touchAction: "pan-y" }}
      >
        <div className={`livro-miolo ${aberta === 0 ? "livro-na-capa" : ""} ${aberta === totalFolhas - 1 ? "livro-no-fim" : ""}`}>
          <span className="livro-base livro-base-esq" aria-hidden="true" />
          <span className="livro-base livro-base-dir" aria-hidden="true" />
          {folhas}
        </div>
      </div>

      {/* Controles */}
      <div className="mt-6 flex justify-center">
        <div className="vidro flex items-center gap-1.5 rounded-full py-1.5 pr-4 pl-1.5">
          <button type="button" onClick={() => ir(aberta - 1)} disabled={aberta === 0} className="seta-carrossel seta-clara disabled:opacity-30" aria-label="Página anterior">
            <IconeAnterior className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => ir(aberta + 1)}
            disabled={aberta === totalFolhas - 1}
            className="seta-carrossel seta-clara disabled:opacity-30"
            aria-label="Próxima página"
          >
            <IconeProximo className="h-5 w-5" />
          </button>
          <span className="mono min-w-[4.8rem] text-center" aria-live="polite">
            {rotulo(aberta)}
          </span>
          <div className="flex items-center gap-1 max-sm:hidden">
            {Array.from({ length: totalFolhas }, (_, k) => (
              <button
                key={k}
                type="button"
                onClick={() => ir(k)}
                aria-label={`Ir para: ${rotulo(k)}`}
                aria-current={k === aberta ? "true" : undefined}
                className="grid h-8 w-5 place-items-center"
              >
                <span className={`block h-1.5 rounded-full transition-all duration-500 ${k === aberta ? "w-5 bg-vinho" : "w-1.5 bg-grafite/25 hover:bg-grafite/50"}`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {ampliada !== null && <FotoInteira paginas={paginas} indice={ampliada} mudar={mudarAmpliada} fechar={fecharAmpliada} />}
    </section>
  );
}
