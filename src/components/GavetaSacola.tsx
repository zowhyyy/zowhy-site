"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { loja } from "@/data/config-loja";
import { formatarPreco } from "@/lib/precos";
import { FotoPeca } from "./FotoPeca";
import { IconeFechar } from "./Icones";
import { useSacola } from "./SacolaProvider";

/** Sacola que abre na lateral da tela. */
export function GavetaSacola() {
  const { itens, gaveta, fecharGaveta, remover } = useSacola();
  const pathname = usePathname();
  const subtotal = itens.reduce((s, p) => s + p.preco, 0);
  const { parcelamentoMinimo, parcelasSemJuros } = loja.pagamento;

  useEffect(() => fecharGaveta(), [pathname, fecharGaveta]);

  useEffect(() => {
    if (!gaveta) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && fecharGaveta();
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [gaveta, fecharGaveta]);

  return (
    <div className={`gaveta ${gaveta ? "gaveta-aberta" : ""}`} aria-hidden={!gaveta} inert={!gaveta}>
      <div className="gaveta-fundo" onClick={fecharGaveta} />
      <aside className="gaveta-painel" role="dialog" aria-modal="true" aria-label="Sacola">
        <div className="flex items-center justify-between border-b border-grafite/10 px-5 py-4">
          <h2 className="flex items-baseline gap-3">
            <span className="disp text-xl">Sacola</span>
            {itens.length > 0 && <span className="titulo text-2xl text-vinho">{itens.length === 1 ? "1 peça" : `${itens.length} peças`}</span>}
          </h2>
          <button
            type="button"
            onClick={fecharGaveta}
            aria-label="Fechar sacola"
            className="grid h-11 w-11 place-items-center rounded-full bg-grafite/5 transition-[rotate,background,color] duration-300 hover:rotate-90 hover:bg-grafite hover:text-white"
          >
            <IconeFechar className="h-5 w-5" />
          </button>
        </div>

        {itens.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="titulo text-4xl">Sua sacola está vazia</p>
            <p className="mt-2 text-suave">Cada peça é única, então não espere muito.</p>
            <Link href="/loja" className="btn btn-cheio mt-6">
              Ir para a loja
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-grafite/10 overflow-x-hidden overflow-y-auto px-5">
              {itens.map((p, i) => (
                <li key={p.slug} className="gaveta-item flex gap-4 py-4" style={{ "--i": i } as React.CSSProperties}>
                  <Link href={`/peca/${p.slug}`} className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-[3px] bg-nevoa">
                    <FotoPeca produto={p} sizes="80px" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="mono text-[0.6rem] text-suave">{p.marca}</p>
                    <p className="mt-0.5 leading-snug font-medium">{p.nome}</p>
                    <p className="text-sm text-suave">Tamanho {p.tamanho} · peça única</p>
                    <div className="mt-auto flex items-end justify-between pt-1">
                      <button type="button" onClick={() => remover(p.slug)} className="link text-sm">
                        Remover
                      </button>
                      <p className="preco">{formatarPreco(p.preco)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-dashed border-metal px-5 py-5">
              <div className="flex justify-between font-mono text-sm">
                <span>Subtotal</span>
                <span className="font-semibold">{formatarPreco(subtotal)}</span>
              </div>
              <p className="mt-1 text-sm text-suave">
                {subtotal >= parcelamentoMinimo
                  ? `Em até ${parcelasSemJuros}x de ${formatarPreco(subtotal / parcelasSemJuros)} sem juros. Frete calculado no pagamento.`
                  : "Frete calculado no pagamento."}
              </p>
              <Link href="/checkout" className="btn btn-cheio mt-4 w-full">
                Finalizar compra
              </Link>
              <Link href="/sacola" className="btn mt-2 w-full">
                Ver sacola
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
