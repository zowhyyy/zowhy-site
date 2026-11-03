"use client";

import { useEffect, useMemo, useState } from "react";
import { rotuloCategoria, rotuloEstilo, rotuloSecao } from "@/lib/rotulos";
import type { Categoria, Drop, Estilo, Produto, Secao } from "@/lib/tipos";
import { combinaComBusca } from "./Busca";
import { CardPeca } from "./CardPeca";
import { IconeFiltro } from "./Icones";

export type Filtros = Partial<Record<"secao" | "categoria" | "tamanho" | "estilo" | "faixa" | "drop" | "busca", string>>;

const faixas = [
  { valor: "ate-100", rotulo: "Até R$ 100", testa: (p: number) => p <= 100 },
  { valor: "100-300", rotulo: "R$ 100 a R$ 300", testa: (p: number) => p > 100 && p < 300 },
  { valor: "300-mais", rotulo: "A partir de R$ 300", testa: (p: number) => p >= 300 },
];

const ordemTamanhos = ["PP", "P", "M", "G", "GG", "XG", "Único"];
function compararTamanho(a: string, b: string) {
  const ia = ordemTamanhos.indexOf(a);
  const ib = ordemTamanhos.indexOf(b);
  if (ia >= 0 || ib >= 0) return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  return Number(a) - Number(b);
}

function unicos<T extends string>(lista: T[]) {
  return [...new Set(lista)];
}

export function Catalogo({ produtos, drops, inicial }: { produtos: Produto[]; drops: Drop[]; inicial: Filtros }) {
  const [filtros, setFiltros] = useState<Filtros>(inicial);
  const [painelAberto, setPainelAberto] = useState(false);

  // Mantém a URL atualizada para dar para compartilhar a busca
  useEffect(() => {
    const qs = new URLSearchParams(Object.entries(filtros).filter(([, v]) => v) as [string, string][]).toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [filtros]);

  const grupos = useMemo(
    () => [
      {
        chave: "secao" as const,
        titulo: "Seção",
        opcoes: unicos(produtos.map((p) => p.secao)).map((v) => ({ valor: v, rotulo: rotuloSecao[v as Secao] })),
      },
      {
        chave: "categoria" as const,
        titulo: "Peça",
        opcoes: (Object.keys(rotuloCategoria) as Categoria[])
          .filter((c) => produtos.some((p) => p.categoria === c))
          .map((v) => ({ valor: v, rotulo: rotuloCategoria[v] })),
      },
      {
        chave: "tamanho" as const,
        titulo: "Tamanho",
        opcoes: unicos(produtos.map((p) => p.tamanho))
          .sort(compararTamanho)
          .map((v) => ({ valor: v, rotulo: v })),
      },
      {
        chave: "estilo" as const,
        titulo: "Estilo",
        opcoes: (Object.keys(rotuloEstilo) as Estilo[])
          .filter((e) => produtos.some((p) => p.estilo === e))
          .map((v) => ({ valor: v, rotulo: rotuloEstilo[v] })),
      },
      { chave: "faixa" as const, titulo: "Preço", opcoes: faixas.map((f) => ({ valor: f.valor, rotulo: f.rotulo })) },
      {
        chave: "drop" as const,
        titulo: "Drop",
        opcoes: [...drops].sort((a, b) => b.numero - a.numero).map((d) => ({ valor: d.slug, rotulo: `Drop ${String(d.numero).padStart(2, "0")}` })),
      },
    ],
    [produtos, drops],
  );

  const filtradas = produtos.filter((p) => {
    if (filtros.busca && !combinaComBusca(p, filtros.busca)) return false;
    if (filtros.secao && p.secao !== filtros.secao) return false;
    if (filtros.categoria && p.categoria !== filtros.categoria) return false;
    if (filtros.tamanho && p.tamanho !== filtros.tamanho) return false;
    if (filtros.estilo && p.estilo !== filtros.estilo) return false;
    if (filtros.drop && p.drop !== filtros.drop) return false;
    if (filtros.faixa) {
      const faixa = faixas.find((f) => f.valor === filtros.faixa);
      if (faixa && !faixa.testa(p.preco)) return false;
    }
    return true;
  });
  const aVenda = filtradas.filter((p) => p.situacao !== "vendida");
  const vendidas = filtradas.filter((p) => p.situacao === "vendida");
  const qtdFiltros = Object.values(filtros).filter(Boolean).length;

  const alternar = (chave: keyof Filtros, valor: string) =>
    setFiltros((f) => ({ ...f, [chave]: f[chave] === valor ? undefined : valor }));
  const limpar = () => setFiltros({});

  return (
    <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-10 lg:pt-20">
      <div className="relative flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mono entrar text-suave">Índice / todas as peças</p>
          <h1 className="mt-4 flex flex-wrap items-end gap-x-6">
            <span className="revela-linha">
              <span className="disp cromo text-[clamp(4.5rem,15vw,11rem)] leading-none">Loja</span>
            </span>
            <span className="titulo entrar text-[clamp(2.6rem,6vw,4rem)] text-vinho" style={{ "--i": 1 } as React.CSSProperties}>
              uma de cada.
            </span>
          </h1>
          <p className="mono mt-5 text-suave" aria-live="polite">
            {aVenda.length} {aVenda.length === 1 ? "peça à venda" : "peças à venda"}
            {filtros.busca && <> para &quot;{filtros.busca}&quot;</>}
          </p>
          {filtros.busca && (
            <button type="button" className="chip mt-3" aria-pressed="true" onClick={() => setFiltros((f) => ({ ...f, busca: undefined }))}>
              Busca: {filtros.busca} ✕
            </button>
          )}
        </div>
        <div className="metal entrar hidden min-w-44 flex-col gap-1.5 rounded-[2px] px-5 py-4 md:flex" style={{ "--i": 2 } as React.CSSProperties} aria-hidden="true">
          <span className="mono text-[0.6rem] text-[#5a5450]">À venda agora</span>
          <span className="text-[2.75rem] leading-none font-light text-tinta">
            {produtos.filter((p) => p.situacao !== "vendida").length}
            <sup className="text-base text-vinho">pç</sup>
          </span>
        </div>
        <button
          type="button"
          className="btn btn-cheio lg:hidden"
          aria-expanded={painelAberto}
          aria-controls="painel-filtros"
          onClick={() => setPainelAberto((a) => !a)}
        >
          <IconeFiltro className="h-5 w-5" />
          Filtros{qtdFiltros > 0 && ` (${qtdFiltros})`}
        </button>
      </div>

      <div className="mt-12 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-14">
        <aside id="painel-filtros" className={`${painelAberto ? "block" : "hidden"} mb-10 lg:mb-0 lg:block`}>
          <div className="vidro space-y-6 rounded-[22px] p-5 lg:sticky lg:top-24">
            {grupos.map((g) => (
              <fieldset key={g.chave}>
                <legend className="mono text-[0.62rem] text-[#5a5450]">{g.titulo}</legend>
                <div className="sem-barra -mx-5 mt-2.5 flex gap-1.5 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0">
                  {g.opcoes.map((o) => (
                    <button
                      key={o.valor}
                      type="button"
                      className="chip"
                      aria-pressed={filtros[g.chave] === o.valor}
                      onClick={() => alternar(g.chave, o.valor)}
                    >
                      {o.rotulo}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}
            {qtdFiltros > 0 && (
              <button type="button" className="link text-sm" onClick={limpar}>
                Limpar filtros
              </button>
            )}
          </div>
        </aside>

        <div>
          {aVenda.length > 0 ? (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-11 sm:grid-cols-3 sm:gap-x-6">
              {aVenda.map((p, i) => (
                <li key={p.slug} className="sm:[&:nth-child(3n+2)]:mt-16">
                  <CardPeca produto={p} prioridade={i < 4} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="grade flex flex-col items-start gap-4 rounded-[28px] bg-nevoa px-8 py-16">
              <p className="titulo text-5xl">Nada por aqui.</p>
              <p className="text-suave">Nenhuma peça à venda com esses filtros. Tire algum ou siga o Instagram para saber do próximo drop.</p>
              <button type="button" className="btn" onClick={limpar}>
                Limpar filtros
              </button>
            </div>
          )}

          {vendidas.length > 0 && (
            <section className="mt-28 border-t border-grafite pt-10">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2>
                  <span className="disp text-[clamp(1.8rem,4vw,2.75rem)]">Já foram</span>{" "}
                  <span className="titulo text-[clamp(2.6rem,5vw,3.6rem)] text-vinho">vendidas</span>
                </h2>
                <p className="max-w-sm text-suave">Essas peças já têm dono novo. Ficam aqui para você ver o que passa pelo brechó.</p>
              </div>
              <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-4">
                {vendidas.map((p) => (
                  <li key={p.slug}>
                    <CardPeca produto={p} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
