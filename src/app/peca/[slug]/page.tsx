import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BotaoCompartilhar } from "@/components/BotaoCompartilhar";
import { BotaoSacola } from "@/components/BotaoSacola";
import { CardPeca } from "@/components/CardPeca";
import { Galeria } from "@/components/Galeria";
import { IconeInstagram, IconeSeta, IconeVoltar } from "@/components/Icones";
import { loja } from "@/data/config-loja";
import { lerDados } from "@/lib/armazem";
import { buscarDrop, buscarPeca, numeroDrop, pecasDoDrop } from "@/lib/catalogo";
import { formatarPreco, resumoParcelamento } from "@/lib/precos";
import { explicacaoEstado, ordemEstados, rotuloCategoria, rotuloEstado, rotuloEstilo, rotuloSecao } from "@/lib/rotulos";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const peca = buscarPeca((await lerDados()).produtos, (await params).slug);
  if (!peca) return {};
  const title = `${peca.nome} ${peca.marca}`;
  const description = peca.descricao.split("\n")[0];
  // Com foto real, é ela que aparece ao compartilhar a peça; sem foto, fica a imagem geral do site.
  return { title, description, ...(peca.fotos[0] && { openGraph: { title, description, images: [peca.fotos[0]] } }) };
}

function Acordeao({ titulo, aberto = false, children }: { titulo: string; aberto?: boolean; children: React.ReactNode }) {
  return (
    <details className="acordeao border-b border-linha" open={aberto}>
      <summary className="flex min-h-14 items-center justify-between py-3 font-semibold">
        {titulo}
        <IconeSeta className="seta h-5 w-5 text-suave" />
      </summary>
      <div className="conteudo pb-5">{children}</div>
    </details>
  );
}

export default async function PaginaPeca({ params }: Props) {
  const { produtos, drops } = await lerDados();
  const peca = buscarPeca(produtos, (await params).slug);
  if (!peca) notFound();

  const drop = buscarDrop(drops, peca.drop);
  const vendida = peca.situacao === "vendida";
  const parcelamento = resumoParcelamento(peca.preco);
  const maisDoDrop = pecasDoDrop(produtos, drops, peca.drop)
    .filter((p) => p.slug !== peca.slug)
    .slice(0, 4);

  const detalhes = [
    ["Peça", rotuloCategoria[peca.categoria].replace(/s$/, "")],
    ["Seção", rotuloSecao[peca.secao]],
    ["Estilo", rotuloEstilo[peca.estilo]],
    ["Cor", peca.cor],
    ["Composição", peca.composicao],
    ["Drop", drop ? `Drop ${numeroDrop(drop.numero)}, ${drop.nome}` : undefined],
  ].filter((d): d is [string, string] => Boolean(d[1]));

  return (
    <div className={vendida ? "" : "pb-28 md:pb-0"}>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-10 lg:pt-10">
        <nav aria-label="Você está em" className="mono flex flex-wrap items-center gap-2.5 text-suave">
          <Link href="/loja" className="inline-flex min-h-11 items-center gap-1 transition-colors hover:text-vinho">
            <IconeVoltar className="h-4 w-4" />
            Loja
          </Link>
          {drop && (
            <>
              <span aria-hidden="true">/</span>
              <Link href={`/loja?drop=${drop.slug}`} className="transition-colors hover:text-vinho">
                Drop {numeroDrop(drop.numero)}
              </Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <Link href={`/loja?categoria=${peca.categoria}`} className="transition-colors hover:text-vinho">
            {rotuloCategoria[peca.categoria]}
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-grafite">
            {peca.nome}
          </span>
        </nav>

        <div className="mt-4 grid gap-10 md:grid-cols-[1.15fr_1fr] lg:gap-16">
          <Galeria produto={peca} />

          <div className="md:sticky md:top-24 md:self-start">
            <p className="mono text-suave">
              {peca.marca}
              {drop && ` · Drop ${numeroDrop(drop.numero)}`} · peça única
            </p>
            <h1 className="titulo mt-3 text-[clamp(2.8rem,6vw,4.6rem)]">{peca.nome}</h1>

            <div className="mt-6">
              {vendida ? (
                <p className="text-lg text-suave">Vendida por {formatarPreco(peca.preco)}</p>
              ) : (
                <>
                  <p className="flex flex-wrap items-baseline gap-x-3">
                    <span className="disp text-[1.9rem] tracking-[0.01em]">{formatarPreco(peca.preco)}</span>
                    {peca.precoOriginal && (
                      <span className="text-suave">
                        <span className="sr-only">Preço da peça nova: </span>
                        <s>{formatarPreco(peca.precoOriginal)}</s> nova
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-suave">
                    {parcelamento
                      ? `Desconto no Pix ou ${parcelamento.replace(/^ou /, "")} no cartão`
                      : "Desconto no Pix ou no cartão de crédito"}
                  </p>
                </>
              )}
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-2.5">
              <div className="metal flex flex-col gap-2 rounded-[2px] px-4 py-3.5">
                <dt className="mono text-[0.58rem] text-[#5a5450]">Tamanho</dt>
                <dd className="disp text-[1.35rem] leading-none">{peca.tamanho}</dd>
              </div>
              <div className="metal flex flex-col gap-2 rounded-[2px] px-4 py-3.5">
                <dt className="mono text-[0.58rem] text-[#5a5450]">Estado</dt>
                <dd className="disp text-[1.05rem] leading-none">{rotuloEstado[peca.estado]}</dd>
              </div>
            </dl>

            <div className="mt-6 hidden flex-col gap-3 md:flex">
              <BotaoSacola slug={peca.slug} situacao={peca.situacao} />
            </div>
            {!vendida && (
              <p className="mt-4 flex items-center gap-2.5 text-[0.84rem] text-suave">
                <span className="inline-block h-1.5 w-1.5 bg-vinho" aria-hidden="true" />
                Só existe uma. Quem paga primeiro leva.
              </p>
            )}
            <a
              href={loja.dmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link mt-3 inline-flex items-center gap-2 text-sm"
            >
              <IconeInstagram className="h-4 w-4" />
              Perguntar sobre esta peça na DM
            </a>
            <div>
              <BotaoCompartilhar titulo={`${peca.nome} ${peca.marca}`} />
            </div>

            <div className="mt-7 border-t border-linha">
              <Acordeao titulo="Sobre a peça" aberto>
                <div className="max-w-prose space-y-3 leading-relaxed">
                  {peca.descricao.split(/\n\s*\n/).map((par, i) => (
                    <p key={i}>{par}</p>
                  ))}
                </div>
              </Acordeao>

              <Acordeao titulo="Medidas">
                <table className="w-full max-w-sm text-left">
                  <tbody>
                    {peca.medidas.map((m) => (
                      <tr key={m.nome} className="border-b border-linha last:border-b-0">
                        <th scope="row" className="py-2 font-normal text-suave">{m.nome}</th>
                        <td className="py-2 text-right font-semibold">{m.cm} cm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-3 text-sm text-suave">
                  Medidas tiradas com a peça esticada sobre uma superfície plana. Compare com uma roupa sua que veste bem.
                </p>
              </Acordeao>

              <Acordeao titulo="Estado de conservação">
                <ol className="grid grid-cols-4 gap-1.5" aria-label="Escala de conservação">
                  {ordemEstados.map((e) => {
                    const atual = e === peca.estado;
                    return (
                      <li key={e} aria-current={atual ? "true" : undefined}>
                        <span className={`block h-1.5 rounded-full ${atual ? "bg-vinho" : "bg-linha"}`} />
                        <span className={`mt-2 block text-[0.78rem] leading-tight ${atual ? "font-semibold text-vinho" : "text-suave"}`}>
                          {rotuloEstado[e]}
                        </span>
                      </li>
                    );
                  })}
                </ol>
                <p className="mt-4">{explicacaoEstado[peca.estado]}</p>
                {peca.observacaoEstado && (
                  <p className="mt-2 rounded-[3px] bg-nevoa px-3 py-2.5 text-sm">
                    <span className="font-semibold">Detalhe: </span>
                    {peca.observacaoEstado}
                  </p>
                )}
              </Acordeao>

              <Acordeao titulo="Detalhes">
                <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                  {detalhes.map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="text-suave">{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </Acordeao>
            </div>
          </div>
        </div>
      </div>

      {maisDoDrop.length > 0 && drop && (
        <section className="mx-auto mt-28 max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2>
              <span className="disp text-[clamp(1.8rem,4vw,2.75rem)]">Mais do</span>{" "}
              <span className="titulo text-[clamp(2.6rem,5vw,3.75rem)] text-vinho">Drop {numeroDrop(drop.numero)}</span>
            </h2>
            <Link href={`/loja?drop=${drop.slug}`} className="link mb-1">
              Ver o drop inteiro →
            </Link>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 sm:gap-x-6">
            {maisDoDrop.map((p) => (
              <li key={p.slug}>
                <CardPeca produto={p} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Barra de compra fixa no celular (some quando a peça já foi vendida) */}
      {!vendida && (
        <div className="vidro fixed inset-x-2.5 bottom-3 z-30 rounded-[24px] py-2.5 pr-2.5 pl-5 md:hidden">
          <div className="flex items-center gap-4">
            <div className="min-w-0 shrink-0">
              <p className="mono text-[0.55rem] text-suave">Peça única · {peca.tamanho}</p>
              <p className="preco mt-0.5">{formatarPreco(peca.preco)}</p>
            </div>
            <div className="barra-compra flex min-w-0 flex-1 flex-col">
              <BotaoSacola slug={peca.slug} situacao={peca.situacao} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
