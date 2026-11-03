"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { IconeVoltar } from "@/components/Icones";
import { useSacola } from "@/components/SacolaProvider";
import { CHAVE_PEDIDO, type Pedido } from "@/lib/pedido";
import { calcularFrete, formatarPreco, opcoesParcelamento, precoNoPix, type OpcaoFrete } from "@/lib/precos";

// Visual dos campos fica na classe .campo do globals.css
const campo = "campo";

function mascaraCep(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export default function Checkout() {
  const router = useRouter();
  const { itens, pronto, esvaziar } = useSacola();
  const [cep, setCep] = useState("");
  const [freteEscolhido, setFreteEscolhido] = useState<OpcaoFrete["tipo"]>("PAC");
  const [metodo, setMetodo] = useState<"pix" | "cartao">("pix");
  const [parcelas, setParcelas] = useState(1);
  const [enviando, setEnviando] = useState(false);

  const subtotal = itens.reduce((s, p) => s + p.preco, 0);
  const frete = calcularFrete(cep);
  const opcaoFrete = frete?.opcoes.find((o) => o.tipo === freteEscolhido);
  const valorFrete = opcaoFrete?.valor ?? 0;

  const totalPix = precoNoPix(subtotal) + valorFrete;
  const opcoesCartao = useMemo(() => opcoesParcelamento(subtotal + valorFrete, subtotal), [subtotal, valorFrete]);
  const parcelaEscolhida = opcoesCartao.find((o) => o.parcelas === parcelas) ?? opcoesCartao[0];
  const total = metodo === "pix" ? totalPix : parcelaEscolhida.total;

  if (!pronto) return null;

  if (itens.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 pt-20 text-center sm:px-6">
        <p className="titulo text-5xl">Sua sacola está vazia</p>
        <Link href="/loja" className="btn btn-cheio mt-6">
          Ir para a loja
        </Link>
      </div>
    );
  }

  function finalizar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!opcaoFrete) return;
    setEnviando(true);
    const dados = new FormData(e.currentTarget);
    const pedido: Pedido = {
      numero: String(Date.now()).slice(-6),
      criadoEm: new Date().toISOString(),
      cliente: { nome: String(dados.get("nome")), email: String(dados.get("email")) },
      itens: itens.map(({ slug, nome, marca, tamanho, preco }) => ({ slug, nome, marca, tamanho, preco })),
      subtotal,
      frete: { tipo: opcaoFrete.tipo, valor: opcaoFrete.valor, prazo: opcaoFrete.prazo },
      pagamento:
        metodo === "pix"
          ? { metodo, parcelas: 1, valorParcela: totalPix, comJuros: false }
          : { metodo, parcelas: parcelaEscolhida.parcelas, valorParcela: parcelaEscolhida.valorParcela, comJuros: parcelaEscolhida.comJuros },
      total,
    };
    try {
      sessionStorage.setItem(CHAVE_PEDIDO, JSON.stringify(pedido));
    } catch {}
    // Simula o tempo de processamento do pagamento
    setTimeout(() => {
      router.push("/pedido-confirmado");
      esvaziar();
    }, 900);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:pt-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/sacola" className="mono inline-flex min-h-11 items-center gap-1 text-suave transition-colors hover:text-vinho">
          <IconeVoltar className="h-4 w-4" />
          Voltar para a sacola
        </Link>
        <ol className="mono flex items-center gap-2.5 text-metal" aria-label="Etapas da compra">
          <li>01 Sacola</li>
          <li aria-hidden="true" className="h-0.5 w-6 bg-vinho" />
          <li className="text-vinho" aria-current="step">
            02 Pagamento
          </li>
          <li aria-hidden="true" className="h-0.5 w-6 bg-linha" />
          <li>03 Confirmado</li>
        </ol>
      </div>
      <h1 className="mt-4 flex flex-wrap items-baseline">
        <span className="disp cromo text-[clamp(3.2rem,10vw,7.5rem)]">Paga</span>
        <span className="titulo text-[clamp(3.6rem,11vw,8rem)] text-vinho">mento</span>
      </h1>
      <p className="metal mt-6 flex items-center gap-3 rounded-[2px] px-4 py-3 text-sm font-medium text-vinho">
        <span className="inline-block h-2 w-2 shrink-0 bg-vinho" aria-hidden="true" />
        Site em teste: nenhum pagamento é cobrado e nenhum pedido é enviado.
      </p>

      <form onSubmit={finalizar} className="mt-12 grid gap-12 lg:grid-cols-[1fr_24rem] lg:gap-16">
        <div className="space-y-14">
          <fieldset>
            <legend className="flex items-baseline gap-3.5">
              <span className="mono text-vinho">01</span>
              <span className="titulo text-[2.6rem]">Seus dados</span>
            </legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="rotulo-campo">Nome completo</span>
                <input name="nome" required autoComplete="name" className={campo} />
              </label>
              <label>
                <span className="rotulo-campo">E-mail</span>
                <input name="email" type="email" required autoComplete="email" className={campo} />
              </label>
              <label>
                <span className="rotulo-campo">Celular</span>
                <input name="celular" type="tel" required autoComplete="tel" inputMode="tel" className={campo} />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend className="flex items-baseline gap-3.5">
              <span className="mono text-vinho">02</span>
              <span className="titulo text-[2.6rem]">Entrega</span>
            </legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-[10rem_1fr]">
              <label>
                <span className="rotulo-campo">CEP</span>
                <input
                  name="cep"
                  required
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="00000-000"
                  value={cep}
                  onChange={(e) => setCep(mascaraCep(e.target.value))}
                  className={campo}
                  aria-describedby="cep-ajuda"
                />
              </label>
              <p id="cep-ajuda" className="self-end pb-3 text-sm text-suave">
                {frete ? `Entrega para ${frete.regiao}` : "Digite o CEP para ver as opções de frete."}
              </p>
            </div>

            {frete && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {frete.opcoes.map((o) => (
                  <label
                    key={o.tipo}
                    className={`opcao ${freteEscolhido === o.tipo ? "opcao-ativa" : ""}`}
                  >
                    <input
                      type="radio"
                      name="frete"
                      className="mt-1 accent-vinho"
                      checked={freteEscolhido === o.tipo}
                      onChange={() => setFreteEscolhido(o.tipo)}
                    />
                    <span className="flex-1">
                      <span className="flex justify-between font-semibold">
                        Correios {o.tipo} <span>{formatarPreco(o.valor)}</span>
                      </span>
                      <span className="text-sm text-suave">{o.prazo}</span>
                    </span>
                  </label>
                ))}
              </div>
            )}

            <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_7rem]">
              <label>
                <span className="rotulo-campo">Rua</span>
                <input name="rua" required autoComplete="address-line1" className={campo} />
              </label>
              <label>
                <span className="rotulo-campo">Número</span>
                <input name="numero" required className={campo} />
              </label>
              <label>
                <span className="rotulo-campo">Complemento (opcional)</span>
                <input name="complemento" autoComplete="address-line2" className={campo} />
              </label>
              <span className="hidden sm:block" />
              <label>
                <span className="rotulo-campo">Bairro</span>
                <input name="bairro" required className={campo} />
              </label>
              <span className="hidden sm:block" />
              <label>
                <span className="rotulo-campo">Cidade</span>
                <input name="cidade" required autoComplete="address-level2" className={campo} />
              </label>
              <label>
                <span className="rotulo-campo">UF</span>
                <input name="uf" required maxLength={2} autoComplete="address-level1" className={`${campo} uppercase`} />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend className="flex items-baseline gap-3.5">
              <span className="mono text-vinho">03</span>
              <span className="titulo text-[2.6rem]">Forma de pagamento</span>
            </legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label
                className={`opcao flex-col items-stretch gap-0 ${metodo === "pix" ? "opcao-ativa" : ""}`}
              >
                <span className="flex items-center gap-3">
                  <input type="radio" name="metodo" className="accent-vinho" checked={metodo === "pix"} onChange={() => setMetodo("pix")} />
                  <span className="font-semibold">Pix</span>
                  <span className="ml-auto text-sm font-semibold text-vinho">com desconto</span>
                </span>
                <span className="mt-1 block pl-7 text-sm text-suave">{formatarPreco(totalPix)} com frete</span>
              </label>
              <label
                className={`opcao flex-col items-stretch gap-0 ${metodo === "cartao" ? "opcao-ativa" : ""}`}
              >
                <span className="flex items-center gap-3">
                  <input type="radio" name="metodo" className="accent-vinho" checked={metodo === "cartao"} onChange={() => setMetodo("cartao")} />
                  <span className="font-semibold">Cartão de crédito</span>
                </span>
                <span className="mt-1 block pl-7 text-sm text-suave">
                  {opcoesCartao.length > 1 ? `Até ${opcoesCartao.filter((o) => !o.comJuros).length}x sem juros` : "Crédito em 1x"}
                </span>
              </label>
            </div>

            {metodo === "cartao" && (
              <div className="mt-4">
                {opcoesCartao.length > 1 ? (
                  <label className="block max-w-sm">
                    <span className="rotulo-campo">Parcelas</span>
                    <select className={campo} value={parcelaEscolhida.parcelas} onChange={(e) => setParcelas(Number(e.target.value))}>
                      {opcoesCartao.map((o) => (
                        <option key={o.parcelas} value={o.parcelas}>
                          {o.parcelas}x de {formatarPreco(o.valorParcela)} {o.comJuros ? `com juros (total ${formatarPreco(o.total)})` : "sem juros"}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <p className="text-sm text-suave">
                    Pagamento no crédito em 1x. O parcelamento é liberado para compras a partir de R$ 300 em peças.
                  </p>
                )}
                <p className="mt-3 text-sm text-suave">
                  Na versão final, os dados do cartão serão preenchidos no ambiente seguro do provedor de pagamento.
                </p>
              </div>
            )}
          </fieldset>
        </div>

        <aside className="vidro self-start rounded-[28px] p-7 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h2 className="disp text-lg">Seu pedido</h2>
            <Link href="/sacola" className="link text-sm">
              Editar
            </Link>
          </div>
          <ul className="mt-4 space-y-2 border-b border-dashed border-metal pb-4 text-sm">
            {itens.map((p) => (
              <li key={p.slug} className="flex justify-between gap-3">
                <span className="min-w-0">
                  {p.nome} <span className="text-suave">({p.tamanho})</span>
                </span>
                <span className="shrink-0">{formatarPreco(p.preco)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 font-mono text-[0.8rem]">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatarPreco(subtotal)}</dd>
            </div>
            {metodo === "pix" && (
              <div className="flex justify-between text-vinho">
                <dt>Desconto no Pix</dt>
                <dd>−{formatarPreco(subtotal - precoNoPix(subtotal))}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt>Frete</dt>
              <dd>{opcaoFrete ? formatarPreco(opcaoFrete.valor) : "informe o CEP"}</dd>
            </div>
            {metodo === "cartao" && parcelaEscolhida.comJuros && (
              <div className="flex justify-between">
                <dt>Juros</dt>
                <dd>{formatarPreco(parcelaEscolhida.total - subtotal - valorFrete)}</dd>
              </div>
            )}
          </dl>
          <div className="mt-4 flex items-baseline justify-between border-t border-dashed border-metal pt-4">
            <span className="font-semibold">Total</span>
            <span className="disp text-[1.4rem] tracking-[0.01em]">{formatarPreco(total)}</span>
          </div>
          {metodo === "cartao" && parcelaEscolhida.parcelas > 1 && (
            <p className="text-right text-sm text-suave">
              {parcelaEscolhida.parcelas}x de {formatarPreco(parcelaEscolhida.valorParcela)}
            </p>
          )}
          <button type="submit" className="btn btn-cheio mt-6 w-full" disabled={!opcaoFrete || enviando}>
            {enviando && <span className="carregando" aria-hidden="true" />}
            {enviando ? "Confirmando…" : metodo === "pix" ? "Pagar com Pix" : "Pagar com cartão"}
          </button>
          {!opcaoFrete && <p className="mt-2 text-center text-sm text-suave">Informe o CEP para continuar.</p>}
        </aside>
      </form>
    </div>
  );
}
