import Link from "next/link";
import { CardPeca } from "@/components/CardPeca";
import { CarrosselDestaques } from "@/components/CarrosselDestaques";
import { FotoPeca } from "@/components/FotoPeca";
import { IconeProximo } from "@/components/Icones";
import { Revelar } from "@/components/Revelar";
import { loja } from "@/data/config-loja";
import { lerDados } from "@/lib/armazem";
import { dropAtual, dropsOrdenados, formatarData, numeroDrop, ordenarPecas, pecasDoDrop as pecasDoDropEm } from "@/lib/catalogo";
import { rotuloCategoria, rotuloEstilo } from "@/lib/rotulos";
import type { Categoria, Estilo } from "@/lib/tipos";

/** Fundo provisório de cada drop enquanto não há foto de campanha (classes do globals.css). */
const tonsDrop = ["tom-prata", "tom-bege", "tom-grafite"];

function FotoProvisoriaEditorial({ rotulo, className = "" }: { rotulo: string; className?: string }) {
  return (
    <div className={`foto-editorial grao cantos ${className}`}>
      <span className="foto-editorial-rotulo">
        {rotulo}
        <br />
        placeholder · substituir
      </span>
    </div>
  );
}

export default async function Inicio() {
  const dados = await lerDados();
  const { produtos } = dados;
  const pecasDoDrop = (slug: string) => pecasDoDropEm(produtos, dados.drops, slug);
  // Sem nenhum drop cadastrado ainda, a página mostra só o lookbook
  const drop = dropAtual(dados.drops) ?? { slug: "", numero: 0, nome: "", data: "", descricao: "" };
  const novidades = pecasDoDrop(drop.slug);
  // Peças de drops anteriores que ainda estão à venda
  const anteriores = ordenarPecas(produtos, dados.drops)
    .filter((p) => p.situacao === "disponivel" && p.drop !== drop.slug)
    .slice(0, 4);

  const disponiveis = produtos.filter((p) => p.situacao === "disponivel");
  const categorias = (Object.keys(rotuloCategoria) as Categoria[])
    .map((c) => ({ categoria: c, qtd: disponiveis.filter((p) => p.categoria === c).length }))
    .filter((c) => c.qtd > 0);
  const estilos = (Object.keys(rotuloEstilo) as Estilo[]).map((e) => ({
    estilo: e,
    qtd: disponiveis.filter((p) => p.estilo === e).length,
  }));
  const drops = dropsOrdenados(dados.drops).slice(0, 3);

  const { parcelasSemJuros, parcelamentoMinimo } = loja.pagamento;

  return (
    <>
      {/* ── Lookbook: primeira coisa da página ── */}
      <CarrosselDestaques />

      {/* ── Faixa ── */}
      <div className="flex overflow-hidden border-y border-grafite py-5 whitespace-nowrap" aria-hidden="true">
        <span className="letreiro disp flex w-max text-[1.75rem]">
          {[0, 1].map((k) => (
            <span key={k} className="flex shrink-0 gap-9 pr-9">
              {["Peça única", "Sem reposição", "Garimpo selecionado", `Drop ${numeroDrop(drop.numero)} no ar`, `@${loja.instagram}`].map((t) => (
                <span key={t} className="flex gap-9">
                  <span>{t}</span>
                  <span className="text-vinho">✕</span>
                </span>
              ))}
            </span>
          ))}
        </span>
      </div>

      {/* ── Drops ── */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-10 lg:pt-36">
        <Revelar>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="disp text-[clamp(3.4rem,10vw,7.5rem)]">Drops</h2>
            <p className="max-w-xs text-suave">As peças chegam em lotes. Cada drop é avisado primeiro no Instagram e, quando acaba, acabou.</p>
          </div>
        </Revelar>
        <div className="mt-14 grid gap-12 md:grid-cols-12 md:gap-6">
          {drops.map((d, i) => {
            const pecas = pecasDoDrop(d.slug);
            const livres = pecas.filter((p) => p.situacao === "disponivel");
            const esgotado = livres.length === 0;
            const layout = ["md:col-span-7", "md:col-span-5 md:mt-48", "md:col-span-5 md:col-start-2 md:-mt-10"][i];
            return (
              <Revelar key={d.slug} className={layout}>
                <article className={`flex flex-col gap-5 ${esgotado ? "grayscale" : ""}`}>
                  <Link href={esgotado ? "/loja" : `/loja?drop=${d.slug}`} className="metal flex h-14 items-center justify-between rounded-[2px] px-4 transition-transform duration-500 hover:-translate-y-0.5">
                    <span className="disp text-lg">Drop_{numeroDrop(d.numero)}</span>
                    <span className="mono text-[#5a5450]">
                      {formatarData(d.data)}
                      {i === 0 ? " · no ar" : esgotado ? " · arquivo" : ""}
                    </span>
                  </Link>
                  {i === 0 ? (
                    <div className="relative">
                      <FotoProvisoriaEditorial rotulo={`Campanha · drop ${numeroDrop(d.numero)}`} className={`h-[24rem] rounded-[4px] md:h-[34rem] ${tonsDrop[i]}`} />
                      {livres.slice(1, 3).map((p, j) => (
                        <Link
                          key={p.slug}
                          href={`/peca/${p.slug}`}
                          aria-label={p.nome}
                          className={`vidro absolute z-[3] w-32 rounded-2xl p-2 transition-transform duration-500 hover:-translate-y-1.5 hover:-rotate-1 md:w-40 ${
                            j === 0 ? "top-12 right-3" : "right-24 -bottom-10"
                          }`}
                        >
                          <span className="relative block aspect-square overflow-hidden rounded-xl bg-nevoa">
                            <FotoPeca produto={p} sizes="160px" />
                          </span>
                          <span className="mono block px-1 pt-2 text-[0.58rem]">
                            {p.marca} · {p.tamanho}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : esgotado ? (
                    <FotoProvisoriaEditorial rotulo={`Arquivo · drop ${numeroDrop(d.numero)}`} className={`h-72 rounded-[4px] ${tonsDrop[i % tonsDrop.length]}`} />
                  ) : null}
                  {!esgotado && i > 0 && <p className="mono text-vinho">Ainda dá tempo</p>}
                  <div className="flex flex-col gap-3 md:pr-10">
                    <h3 className={`titulo ${i === 0 ? "text-[clamp(3rem,6vw,4.2rem)]" : "text-[clamp(2.6rem,5vw,3.4rem)]"}`}>{d.nome}</h3>
                    <p className="text-suave">{d.descricao}</p>
                    <div className="flex flex-wrap items-center gap-5">
                      <span className={`mono ${esgotado ? "text-suave" : "text-vinho"}`}>
                        {esgotado ? "Todas as peças foram vendidas" : `${livres.length} de ${pecas.length} peças disponíveis`}
                      </span>
                      {!esgotado && (
                        <Link href={`/loja?drop=${d.slug}`} className="link">
                          Ver o drop →
                        </Link>
                      )}
                    </div>
                  </div>
                  {i > 0 && !esgotado && (
                    <ul className="grid grid-cols-2 gap-4">
                      {livres.slice(0, 2).map((p) => (
                        <li key={p.slug}>
                          <CardPeca produto={p} />
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </Revelar>
            );
          })}
          <Revelar className="flex flex-col gap-5 self-start md:col-span-5 md:col-start-8 md:mt-28">
            <p className="titulo text-[2.5rem] leading-[1.05]">“Quando alguém compra, ela sai da loja.”</p>
            <Link href="/loja" className="btn self-start">
              Ver a loja <IconeProximo className="h-4 w-4" />
            </Link>
          </Revelar>
        </div>
      </section>

      {/* ── Novidades: peças do drop atual ── */}
      <section className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 lg:px-10 lg:pt-40">
        <Revelar>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mono text-suave">
                Drop {numeroDrop(drop.numero)}, {drop.nome.toLowerCase()}
              </p>
              <h2 className="mt-3">
                <span className="disp text-[clamp(2.6rem,7vw,5.6rem)]">Novi</span>
                <span className="titulo text-[clamp(3.2rem,9vw,7.2rem)] text-vinho">dades</span>
              </h2>
            </div>
            <Link href={`/loja?drop=${drop.slug}`} className="link mb-2 shrink-0">
              Ver tudo na loja →
            </Link>
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {novidades.slice(0, 5).map((p, i) => (
              <li key={p.slug} className={i === 0 ? "col-span-2 md:row-span-2" : ""}>
                <CardPeca produto={p} prioridade={i < 2} destaque={i === 0} />
              </li>
            ))}
          </ul>
        </Revelar>
      </section>

      {/* ── Peças de drops anteriores ── */}
      {anteriores.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-10 lg:pt-32">
          <Revelar>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="titulo text-[clamp(2.8rem,7vw,4.6rem)]">Ainda dá tempo</h2>
                <p className="mt-2 text-suave">Peças de drops anteriores que continuam à venda.</p>
              </div>
              <Link href="/loja" className="link mb-1 shrink-0">
                Ver a loja →
              </Link>
            </div>
            <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
              {anteriores.map((p) => (
                <li key={p.slug}>
                  <CardPeca produto={p} />
                </li>
              ))}
            </ul>
          </Revelar>
        </section>
      )}

      {/* ── Índice: por estilo e por peça ── */}
      <section className="mt-28 bg-nevoa lg:mt-36">
        <Revelar className="mx-auto grid max-w-7xl gap-16 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-20 lg:px-10 lg:py-28">
          <div className="min-w-0">
            <h2 className="mono text-suave">Garimpe por estilo</h2>
            <ul className="mt-6">
              {estilos.map(({ estilo, qtd }) => (
                <li key={estilo}>
                  {/* Duas colunas: a palavra encolhe, a contagem tem espaço próprio e nunca fica por baixo */}
                  <Link
                    href={`/loja?estilo=${estilo}`}
                    className="linha-indice grid grid-cols-[minmax(0,1fr)_7.5rem] items-center gap-4 border-t border-[#d9d4cf] py-4 transition-[color,padding] duration-500 hover:pl-4 hover:text-vinho sm:grid-cols-[minmax(0,1fr)_9rem]"
                  >
                    <span className="disp text-[clamp(1.25rem,3.5vw,3rem)] whitespace-nowrap">{rotuloEstilo[estilo]}</span>
                    <span className="flex items-center justify-end gap-3">
                      <span className="mono text-suave">{qtd === 0 ? "esgotado" : `${qtd} ${qtd === 1 ? "peça" : "peças"}`}</span>
                      <span className="seta-indice text-vinho">→</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-6 lg:pt-10">
            <h2 className="mono text-suave">Compre por peça</h2>
            <ul className="flex flex-wrap gap-2.5">
              {categorias.map(({ categoria, qtd }) => (
                <li key={categoria}>
                  <Link
                    href={`/loja?categoria=${categoria}`}
                    className="inline-flex h-11 items-center gap-2.5 rounded-full border border-[#d9d4cf] bg-white pr-2 pl-4 text-sm font-medium transition-colors duration-300 hover:border-vinho hover:bg-vinho hover:text-white"
                  >
                    {rotuloCategoria[categoria]}
                    <span className="grid h-7 min-w-7 place-items-center rounded-full bg-cinza px-1.5 text-[0.7rem] font-semibold text-grafite">
                      {qtd}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="metal mt-6 flex flex-col gap-2.5 rounded-[2px] p-6">
              <span className="mono text-[#5a5450]">sistema / peça_única.exe</span>
              <p className="text-[1.6rem] leading-tight font-light text-tinta">Não tem reposição. Quando alguém compra, ela sai da loja.</p>
            </div>
          </div>
        </Revelar>
      </section>

      {/* ── Como funciona ── */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-10 lg:pt-28">
        <Revelar>
          <dl className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Cada peça é única", "Não tem reposição. Quando alguém compra, ela sai da loja."],
              ["Novidades em drops", "As peças chegam em lotes, avisados primeiro no Instagram."],
              ["Envio para todo o Brasil", "Pelos Correios, com código de rastreio no seu e-mail."],
              [`Até ${parcelasSemJuros}x sem juros`, `No cartão, em compras a partir de R$ ${parcelamentoMinimo}.`],
            ].map(([t, d], i) => (
              <div key={t} className="fato flex flex-col gap-3 border-t-2 border-grafite pt-6">
                <span className="mono text-sm text-vinho">{String(i + 1).padStart(2, "0")}</span>
                <dt className="disp text-[1.25rem] leading-tight">{t}</dt>
                <dd className="text-[1.05rem] leading-relaxed text-suave">{d}</dd>
              </div>
            ))}
          </dl>
        </Revelar>
      </section>

      {/* ── Instagram ── */}
      <section className="pt-24 lg:pt-32">
        <Revelar>
          <p className="mono mx-auto max-w-7xl px-4 text-suave sm:px-6 lg:px-10">Os drops saem primeiro no Instagram</p>
          <a
            href={loja.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="faixa-letreiro group mt-6 block overflow-hidden py-2"
            aria-label={`Seguir @${loja.instagram} no Instagram`}
          >
            {/* Alterna vinho cheio e só contorno; duas metades iguais para o loop não dar pulo */}
            <span className="letreiro flex w-max" aria-hidden="true">
              {[0, 1].map((k) => (
                <span key={k} className="flex shrink-0 gap-14 pr-14">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className={`disp text-[clamp(3.5rem,10vw,9rem)] leading-none transition-opacity group-hover:opacity-80 ${i % 2 ? "contorno" : "text-vinho"}`}
                    >
                      @{loja.instagram}
                    </span>
                  ))}
                </span>
              ))}
            </span>
          </a>
          <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-10">
            <a href={loja.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-cheio">
              Seguir no Instagram <IconeProximo className="h-4 w-4" />
            </a>
          </div>
        </Revelar>
      </section>
    </>
  );
}
