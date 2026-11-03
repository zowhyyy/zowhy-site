"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { loja } from "@/data/config-loja";
import { destaques, type Destaque } from "@/data/destaques";
import { formatarPreco } from "@/lib/precos";
import type { Produto } from "@/lib/tipos";
import { useCatalogo } from "./CatalogoProvider";
import { FotoPeca } from "./FotoPeca";
import { IconeAnterior, IconeProximo } from "./Icones";

/** Tempo de cada look (ms). 10000 = 10 segundos. */
const DURACAO = 10000;

/** Fundo de cada look enquanto a foto não chega (classes do globals.css). */
const tons = ["tom-prata", "tom-bege", "tom-grafite", "tom-vinho"];

function pecasDo(destaque: Destaque, produtos: Produto[]) {
  return destaque.pecas.map((s) => produtos.find((p) => p.slug === s)).filter((p) => p !== undefined);
}

/** "Frio de garimpo" → ["Frio", "de garimpo"]: a primeira palavra no display, o resto na serifa vinho. */
function partirTitulo(titulo: string) {
  const [primeira, ...resto] = titulo.split(" ");
  return [primeira, resto.join(" ")] as const;
}

/**
 * Lookbook: primeira seção da página inicial.
 * Carrossel grande e deitado: a foto do look ocupa tudo (dados em src/data/destaques.ts).
 * O painel de vidro com o texto e as peças fica à direita, deixando a roupa da foto à mostra.
 * Troca sozinho a cada 10 s e reinicia a contagem quando a pessoa interage.
 */
export function CarrosselDestaques() {
  const [atual, setAtual] = useState(0);
  const [ciclo, setCiclo] = useState(0);
  const [oculto, setOculto] = useState(false);
  const arrasto = useRef<{ x: number; moveu: boolean } | null>(null);
  const { produtos } = useCatalogo();
  const total = destaques.length;

  const ir = useCallback(
    (i: number) => {
      setAtual(((i % total) + total) % total);
      setCiclo((c) => c + 1);
    },
    [total],
  );

  // Pausa só quando a aba do navegador não está visível
  useEffect(() => {
    const vis = () => setOculto(document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => document.removeEventListener("visibilitychange", vis);
  }, []);

  // Troca automática. Reinicia a contagem sempre que o look muda (inclusive pelo clique).
  useEffect(() => {
    if (oculto) return;
    const t = window.setTimeout(() => ir(atual + 1), DURACAO);
    return () => window.clearTimeout(t);
  }, [atual, ciclo, oculto, ir]);

  return (
    <section
      aria-roledescription="carrossel"
      aria-label="Lookbook"
      className="relative -mt-[4.35rem] pt-24 pb-14 lg:pt-28 lg:pb-20"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") ir(atual + 1);
        if (e.key === "ArrowLeft") ir(atual - 1);
      }}
    >
      <div className="grade absolute inset-0 [mask-image:linear-gradient(180deg,#000_30%,transparent_95%)]" aria-hidden="true" />

      <div className="relative mx-auto max-w-[90rem] px-3 sm:px-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 px-1">
          <h1 className="mono entrar flex items-center gap-2.5">
            <span className="inline-block h-2 w-2 bg-vinho" aria-hidden="true" />
            Lookbook · peças do brechó
          </h1>
          <p className="mono entrar flex items-center gap-5 text-suave" style={{ "--i": 1 } as React.CSSProperties}>
            <span className="max-sm:hidden">Cada peça existe uma vez só</span>
            <Link href="/lookbook" className="text-vinho transition-opacity hover:opacity-70">
              Abrir o lookbook →
            </Link>
          </p>
        </div>

        {/* Chapa metálica: pendurada logo abaixo da linha de texto, vazando pela borda de cima do carrossel
            (sem cobrir o texto). Balança como etiqueta. */}
        <div className="pointer-events-none absolute top-[2.1rem] right-14 z-20 hidden lg:block" aria-hidden="true">
          <div className="chapa-balanca metal flex h-[6.6rem] w-64 flex-col justify-between overflow-hidden rounded-[2px] px-5 py-3.5">
            <span className="mono text-[#5a5450]">{loja.nome.toLowerCase()} / lookbook</span>
            <span className="text-[2rem] leading-none font-light text-tinta">
              (garimpo)<sup className="text-base text-vinho">2</sup>
            </span>
          </div>
        </div>

        <div
          className="relative grid h-[42rem] overflow-hidden rounded-[28px] bg-grafite shadow-[0_40px_80px_-50px_rgb(37_32_29/0.7)] select-none sm:h-[38rem] lg:h-[clamp(38rem,46vw,46rem)]"
          style={{ touchAction: "pan-y" }}
          onPointerDown={(e) => (arrasto.current = { x: e.clientX, moveu: false })}
          onPointerMove={(e) => {
            if (arrasto.current && Math.abs(e.clientX - arrasto.current.x) > 10) arrasto.current.moveu = true;
          }}
          onPointerUp={(e) => {
            if (!arrasto.current) return;
            const dx = e.clientX - arrasto.current.x;
            if (Math.abs(dx) > 50) ir(atual + (dx < 0 ? 1 : -1));
          }}
          onClickCapture={(e) => {
            if (arrasto.current?.moveu) e.preventDefault();
            arrasto.current = null;
          }}
        >
          {destaques.map((d, i) => {
            const pecas = pecasDo(d, produtos);
            const numero = String(i + 1).padStart(2, "0");
            const [primeira, resto] = partirTitulo(d.titulo);
            return (
              <div
                key={d.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} de ${total}: ${d.titulo}`}
                aria-hidden={i !== atual}
                inert={i !== atual}
                className={`slide relative h-full ${i === atual ? "slide-ativo" : ""}`}
              >
                {/* Foto do look em tela cheia */}
                <div className={`slide-foto foto-editorial grao cantos absolute inset-0 text-white/70 ${d.imagem ? "" : tons[i % tons.length]}`}>
                  {d.imagem ? (
                    <Image
                      src={d.imagem}
                      alt={`Look ${numero}: ${d.titulo}`}
                      fill
                      sizes="(min-width: 1440px) 1392px, 100vw"
                      className="slide-zoom object-cover"
                      style={{ objectPosition: d.posicao ?? "center" }}
                      priority={i === 0}
                    />
                  ) : (
                    <span className="foto-editorial-rotulo">
                      Foto do look {numero}
                      <br />
                      placeholder · substituir
                    </span>
                  )}
                  {/* Escurece de leve o lado do painel para o vidro ler bem sobre qualquer foto */}
                  <span className="absolute inset-0 z-[1] bg-gradient-to-t from-black/45 via-transparent to-transparent sm:bg-gradient-to-l sm:from-black/35 sm:via-transparent" aria-hidden="true" />
                </div>

                {/* Bolhas de vidro decorativas, flutuando */}
                <span
                  className="bolha vidro absolute top-[9%] right-[calc(min(29rem,42%)+3rem)] z-[2] hidden h-16 w-36 rounded-[50%] md:block"
                  aria-hidden="true"
                />
                <span
                  className="bolha vidro absolute top-[19%] right-[calc(min(29rem,42%)+6.5rem)] z-[2] hidden h-11 w-24 rounded-[50%] md:block"
                  style={{ animationDelay: "-1.6s" } as React.CSSProperties}
                  aria-hidden="true"
                />
                <span
                  className="bolha vidro absolute top-[27%] right-[calc(min(29rem,42%)+4rem)] z-[2] hidden h-7 w-14 rounded-[50%] md:block"
                  style={{ animationDelay: "-3.1s" } as React.CSSProperties}
                  aria-hidden="true"
                />

                {/* Painel de vidro à direita: texto + peças do look */}
                <div className="slide-texto vidro absolute right-3 bottom-3 left-3 z-[3] flex flex-col gap-4 rounded-[24px] p-5 sm:top-6 sm:right-6 sm:bottom-6 sm:left-auto sm:w-[min(29rem,42%)] sm:justify-between sm:p-8 lg:pt-[5.5rem]">
                  <div className="flex flex-col gap-3.5 sm:gap-5">
                    <p className="mono flex items-center gap-2.5">
                      <span className="inline-block h-2 w-2 bg-vinho" aria-hidden="true" />
                      {d.apoio}
                    </p>
                    <h2 className="flex flex-col">
                      <span className="disp text-[clamp(1.8rem,3.2vw,3rem)]">{primeira}</span>
                      {resto && <span className="titulo text-[clamp(2.6rem,4.6vw,4.5rem)] leading-[0.98] text-vinho">{resto}</span>}
                    </h2>
                    <p className="hidden text-[1rem] text-[#3f3935] sm:block">{d.texto}</p>
                    <div>
                      {d.botao.externo ? (
                        <a href={d.botao.href} target="_blank" rel="noopener noreferrer" className="btn btn-cheio">
                          {d.botao.rotulo} <IconeProximo className="h-4 w-4" />
                        </a>
                      ) : (
                        <Link href={d.botao.href} className="btn btn-cheio">
                          {d.botao.rotulo} <IconeProximo className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {pecas.length > 0 && (
                    <div className="flex flex-col gap-2 border-t border-grafite/15 pt-3.5 sm:pt-4">
                      <p className="mono text-[0.58rem] text-[#5a5450]">Peças deste look · {pecas.length}</p>
                      <ul className="grid grid-cols-3 gap-2">
                        {pecas.map((p, j) => {
                          const vendida = p.situacao === "vendida";
                          return (
                            <li key={p.slug} className="colagem-peca min-w-0" style={{ "--j": j } as React.CSSProperties}>
                              <Link
                                href={`/peca/${p.slug}`}
                                aria-label={`${p.nome}, ${vendida ? "vendida" : formatarPreco(p.preco)}`}
                                className="group flex flex-col gap-1.5 rounded-2xl bg-white/45 p-1.5 transition-[transform,background] duration-500 hover:-translate-y-1 hover:bg-white/80"
                              >
                                <span className={`relative block aspect-square overflow-hidden rounded-xl bg-nevoa ${vendida ? "grayscale" : ""}`}>
                                  <FotoPeca produto={p} sizes="120px" />
                                </span>
                                <span className="flex min-w-0 flex-col px-0.5 pb-0.5">
                                  <span className="truncate text-[0.72rem] leading-tight font-medium">{p.nome}</span>
                                  <span className={vendida ? "text-[0.68rem] text-suave" : "preco text-[0.66rem]"}>
                                    {vendida ? "Vendida" : formatarPreco(p.preco)}
                                  </span>
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Controles de vidro: canto de baixo à esquerda (no celular, no alto) */}
          <div className="vidro absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full py-1.5 pr-3.5 pl-1.5 sm:top-auto sm:bottom-6 sm:left-6">
            <button type="button" onClick={() => ir(atual - 1)} className="seta-carrossel seta-clara" aria-label="Look anterior">
              <IconeAnterior className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => ir(atual + 1)} className="seta-carrossel seta-clara" aria-label="Próximo look">
              <IconeProximo className="h-5 w-5" />
            </button>
            <span className="mono min-w-[3.9rem] text-center" aria-live="polite">
              {String(atual + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <div className="hidden sm:flex">
              {destaques.map((d, i) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => ir(i)}
                  aria-label={`Ir para o look ${i + 1}: ${d.titulo}`}
                  aria-current={i === atual ? "true" : undefined}
                  className={`ponto ponto-claro ${i === atual ? "ponto-ativo" : ""}`}
                >
                  <span>
                    {i === atual && (
                      <span
                        key={ciclo}
                        className="ponto-progresso"
                        style={{ animationDuration: `${DURACAO}ms`, animationPlayState: oculto ? "paused" : "running" }}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
