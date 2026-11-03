"use client";

import Link from "next/link";
import { FotoPeca } from "@/components/FotoPeca";
import { useSacola } from "@/components/SacolaProvider";
import { loja } from "@/data/config-loja";
import { formatarPreco } from "@/lib/precos";

export default function PaginaSacola() {
  const { itens, remover, pronto } = useSacola();
  const subtotal = itens.reduce((s, p) => s + p.preco, 0);
  const indisponiveis = itens.filter((p) => p.situacao !== "disponivel");
  const { parcelamentoMinimo, parcelasSemJuros } = loja.pagamento;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:pt-20">
      <h1 className="flex flex-wrap items-end gap-x-6">
        <span className="revela-linha">
          <span className="disp cromo text-[clamp(3.6rem,12vw,8.5rem)]">Sacola</span>
        </span>
        {pronto && itens.length > 0 && (
          <span className="titulo entrar mb-2 text-[clamp(2.4rem,5vw,3.4rem)] text-vinho">
            {itens.length === 1 ? "1 peça" : `${itens.length} peças`}
          </span>
        )}
      </h1>

      {!pronto ? null : itens.length === 0 ? (
        <div className="grade entrar mt-10 flex flex-col items-start gap-4 rounded-[30px] bg-nevoa px-8 py-16 sm:px-12">
          <p className="mono text-vinho">0 peças</p>
          <p className="titulo text-[clamp(2.8rem,6vw,4rem)]">Sua sacola está vazia.</p>
          <p className="max-w-md text-suave">As peças do drop atual estão na loja. Cada uma é única, então não espere muito.</p>
          <Link href="/loja" className="btn btn-cheio mt-2">
            Ir para a loja
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_23rem] lg:gap-16">
          <ul className="border-t border-grafite">
            {itens.map((p, i) => {
              const indisponivel = p.situacao !== "disponivel";
              return (
                <li key={p.slug} className="entrar flex gap-5 border-b border-linha py-6" style={{ "--i": i } as React.CSSProperties}>
                  <span className="mono hidden w-6 pt-1 text-metal sm:block">{String(i + 1).padStart(2, "0")}</span>
                  <Link
                    href={`/peca/${p.slug}`}
                    className={`relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-[4px] bg-nevoa transition-transform duration-500 hover:scale-[1.03] sm:w-32 ${
                      indisponivel ? "grayscale" : ""
                    }`}
                  >
                    <FotoPeca produto={p} sizes="128px" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="mono text-[0.6rem] text-suave">{p.marca}</p>
                    <Link href={`/peca/${p.slug}`} className="mt-1 text-lg leading-snug font-medium hover:text-vinho">
                      {p.nome}
                    </Link>
                    <p className="mt-0.5 text-sm text-suave">Tamanho {p.tamanho} · peça única · 1 un.</p>
                    {indisponivel && (
                      <p role="alert" className="mt-3 rounded-xl bg-vinho-claro px-3 py-2.5 text-sm font-medium text-vinho">
                        Esta peça foi {p.situacao === "vendida" ? "vendida" : "reservada"} por outra pessoa. Remova para continuar.
                      </p>
                    )}
                    <div className="mt-auto flex items-end justify-between gap-3 pt-3">
                      <button type="button" className="link text-sm" onClick={() => remover(p.slug)}>
                        Remover
                      </button>
                      <p className={indisponivel ? "text-suave line-through" : "preco"}>{formatarPreco(p.preco)}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="vidro self-start rounded-[28px] p-7 lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <h2 className="disp text-lg">Resumo</h2>
              <span className="mono text-suave">recibo</span>
            </div>
            <dl className="mt-5 space-y-2.5 border-y border-dashed border-metal py-4 font-mono text-[0.84rem]">
              <div className="flex justify-between">
                <dt>Subtotal ({itens.length} {itens.length === 1 ? "peça" : "peças"})</dt>
                <dd className="font-semibold">{formatarPreco(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-sm text-vinho">
                <dt>Pagando no Pix</dt>
                <dd>tem desconto</dd>
              </div>
              <div className="flex justify-between text-sm text-suave">
                <dt>Frete</dt>
                <dd>calculado no pagamento</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-suave">
              {subtotal >= parcelamentoMinimo
                ? `No cartão em até ${parcelasSemJuros}x de ${formatarPreco(subtotal / parcelasSemJuros)} sem juros.`
                : `No crédito em 1x. O parcelamento é liberado a partir de ${formatarPreco(parcelamentoMinimo)}: faltam ${formatarPreco(parcelamentoMinimo - subtotal)}.`}
            </p>
            {indisponiveis.length > 0 ? (
              <>
                <button type="button" className="btn btn-cheio mt-5 w-full" disabled>
                  Ir para o pagamento
                </button>
                <p className="mt-2 text-center text-[0.8rem] text-vinho">Remova a peça indisponível para continuar.</p>
              </>
            ) : (
              <Link href="/checkout" className="btn btn-cheio mt-5 w-full">
                Ir para o pagamento →
              </Link>
            )}
            <Link href="/loja" className="link mx-auto mt-4 block w-max text-sm">
              Continuar comprando
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
