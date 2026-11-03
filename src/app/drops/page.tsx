import type { Metadata } from "next";
import Link from "next/link";
import { CardPeca } from "@/components/CardPeca";
import { Revelar } from "@/components/Revelar";
import { lerDados } from "@/lib/armazem";
import { dropsOrdenados, formatarData, numeroDrop, pecasDoDrop as pecasDoDropEm } from "@/lib/catalogo";

export const metadata: Metadata = { title: "Drops" };

/** Fundo provisório de cada drop enquanto não há foto de campanha (classes do globals.css). */
const tons = ["tom-prata", "tom-bege", "tom-grafite", "tom-vinho"];

export default async function Drops() {
  const dados = await lerDados();
  const drops = dropsOrdenados(dados.drops);
  const pecasDoDrop = (slug: string) => pecasDoDropEm(dados.produtos, dados.drops, slug);
  return (
    <div className="relative">
      {/* Índice flutuante de vidro */}
      {/* Só em telas bem largas, onde sobra margem ao lado do conteúdo */}
      <div className="pointer-events-none sticky top-28 z-30 hidden h-0 justify-end px-6 2xl:flex">
        <nav aria-label="Ir para o drop" className="vidro pointer-events-auto mt-[26rem] flex flex-col gap-1 rounded-[18px] p-2">
          {drops.map((d, i) => {
            const livres = pecasDoDrop(d.slug).filter((p) => p.situacao === "disponivel").length;
            return (
              <a
                key={d.slug}
                href={`#${d.slug}`}
                className="flex h-11 items-center gap-2.5 rounded-xl px-3.5 font-display text-[0.8rem] font-bold transition-colors hover:bg-vinho hover:text-white"
              >
                {numeroDrop(d.numero)}
                <span className="mono text-[0.55rem] opacity-70">{i === 0 ? "no ar" : livres ? `restam ${livres}` : "arquivo"}</span>
              </a>
            );
          })}
        </nav>
      </div>

      <header className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-8 px-4 pt-12 sm:px-6 lg:px-10 lg:pt-20">
        <div>
          <p className="mono entrar text-suave">Coleções / em lotes</p>
          <h1 className="revela-linha mt-4">
            <span className="disp text-[clamp(4rem,13vw,9.5rem)]">Drops</span>
          </h1>
        </div>
        <p className="entrar max-w-sm text-[1.05rem] text-suave" style={{ "--i": 2 } as React.CSSProperties}>
          As peças chegam em lotes. Cada drop é avisado primeiro no Instagram. Quando uma peça vende, ela fica aqui como arquivo.
        </p>
      </header>

      {drops.map((drop, i) => {
        const pecas = pecasDoDrop(drop.slug);
        const disponiveis = pecas.filter((p) => p.situacao === "disponivel").length;
        const esgotado = disponiveis === 0;
        const espelhado = i % 2 === 1;
        const conteudo = (
          <section id={drop.slug} aria-labelledby={`titulo-${drop.slug}`} className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-10 lg:pt-32">
            <div className="grid items-end gap-8 md:grid-cols-12 md:gap-6">
              <div className={`relative z-[3] flex flex-col gap-6 ${espelhado ? "md:order-2 md:col-span-5 md:col-start-8" : "md:col-span-5"}`}>
                <span
                  className="disp contorno pointer-events-none text-[clamp(8rem,22vw,21rem)] leading-[0.9] tracking-[-0.04em] [-webkit-text-stroke-width:3px]"
                  aria-hidden="true"
                >
                  {numeroDrop(drop.numero)}
                </span>
                <dl className="metal grid grid-cols-3 gap-4 rounded-[2px] px-5 py-4">
                  {[
                    ["Drop", `n.º ${numeroDrop(drop.numero)}`],
                    ["Entrou", formatarData(drop.data)],
                    ["Status", esgotado ? "Tudo vendido" : `${disponiveis} de ${pecas.length} à venda`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex flex-col gap-1.5">
                      <dt className="mono text-[0.58rem] text-[#5a5450]">{k}</dt>
                      <dd className="text-[1.15rem] leading-tight font-light text-tinta">{v}</dd>
                    </div>
                  ))}
                </dl>
                <h2 id={`titulo-${drop.slug}`} className="titulo text-[clamp(3.4rem,7vw,5.5rem)]">
                  {drop.nome}
                </h2>
                <p className="max-w-md text-[1.05rem] text-[#4a433f]">{drop.descricao}</p>
                {!esgotado && (
                  <Link href={`/loja?drop=${drop.slug}`} className="link self-start">
                    Ver só as peças do Drop {numeroDrop(drop.numero)} na loja →
                  </Link>
                )}
              </div>
              <div
                className={`foto-editorial grao cantos rounded-[4px] ${esgotado ? "h-72 grayscale md:h-[26rem]" : "h-[26rem] md:h-[38rem]"} ${tons[i % tons.length]} ${
                  espelhado ? "md:col-span-7" : "md:col-span-7"
                }`}
              >
                <span className="foto-editorial-rotulo">
                  Foto de campanha · drop {numeroDrop(drop.numero)}
                  <br />
                  placeholder · substituir
                </span>
              </div>
            </div>
            <ul className="mt-16 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
              {pecas.map((p) => (
                <li key={p.slug} className="lg:[&:nth-child(4n+2)]:mt-20 lg:[&:nth-child(4n+4)]:mt-10">
                  <CardPeca produto={p} />
                </li>
              ))}
            </ul>
          </section>
        );
        return i === 0 ? <div key={drop.slug}>{conteudo}</div> : <Revelar key={drop.slug}>{conteudo}</Revelar>;
      })}
    </div>
  );
}
