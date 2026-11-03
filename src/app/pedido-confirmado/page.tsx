"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loja } from "@/data/config-loja";
import { CHAVE_PEDIDO, type Pedido } from "@/lib/pedido";
import { formatarPreco } from "@/lib/precos";

const RESERVA_MS = 30 * 60 * 1000;

/** Contagem regressiva da reserva da peça enquanto o Pix não é pago. */
function Reserva({ desde }: { desde: string }) {
  const [agora, setAgora] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setAgora(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  const resta = Math.max(0, new Date(desde).getTime() + RESERVA_MS - agora);
  const mm = String(Math.floor(resta / 60000)).padStart(2, "0");
  const ss = String(Math.floor((resta % 60000) / 1000)).padStart(2, "0");
  return <span className="mono text-vinho">{resta > 0 ? `Reservada por ${mm}:${ss}` : "Reserva expirada"}</span>;
}

export default function PedidoConfirmado() {
  const [pedido, setPedido] = useState<Pedido | null | undefined>(undefined);

  useEffect(() => {
    try {
      const salvo = sessionStorage.getItem(CHAVE_PEDIDO);
      setPedido(salvo ? (JSON.parse(salvo) as Pedido) : null);
    } catch {
      setPedido(null);
    }
  }, []);

  if (pedido === undefined) return null;

  if (pedido === null) {
    return (
      <div className="mx-auto max-w-xl px-4 pt-20 text-center sm:px-6">
        <p className="titulo text-5xl">Nenhum pedido recente</p>
        <p className="mt-3 text-suave">Os pedidos aparecem aqui logo depois do pagamento.</p>
        <Link href="/loja" className="btn btn-cheio mt-7">
          Ir para a loja
        </Link>
      </div>
    );
  }

  const pix = pedido.pagamento.metodo === "pix";

  return (
    <div className="grade">
      <div className="mx-auto grid max-w-6xl gap-14 px-4 pt-12 pb-10 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pt-20">
        <div className="flex flex-col gap-7">
          <ol className="mono flex items-center gap-2.5 text-metal" aria-label="Etapas da compra">
            <li>01 Sacola</li>
            <li aria-hidden="true" className="h-0.5 w-6 bg-vinho" />
            <li>02 Pagamento</li>
            <li aria-hidden="true" className="h-0.5 w-6 bg-vinho" />
            <li className="text-vinho" aria-current="step">
              03 Confirmado
            </li>
          </ol>
          {/* Check em pixel art */}
          <svg className="entrar h-[4.5rem] w-[4.5rem]" viewBox="0 0 18 18" shapeRendering="crispEdges" role="img" aria-label="Confirmado">
            <path fill="#822434" d="M5 0h8v1h2v1h1v2h1v2h1v6h-1v2h-1v2h-1v1h-2v1H5v-1H3v-1H2v-2H1v-2H0V6h1V4h1V2h1V1h2z" />
            <path fill="#fff" d="M12 5h2v2h-1v1h-1v1h-1v1h-1v1H9v1H8v1H7v-1H6v-1H5v-1H4V8h2v1h1v1h1V9h1V8h1V7h1V6h1z" />
          </svg>
          <h1 className="flex flex-col gap-1">
            <span className="revela-linha">
              <span className="disp cromo text-[clamp(2.8rem,7vw,5.2rem)]">Pedido</span>
            </span>
            <span className="revela-linha">
              <span className="titulo text-[clamp(3.6rem,9vw,6.5rem)] text-vinho" style={{ "--i": 1 } as React.CSSProperties}>
                confirmado.
              </span>
            </span>
          </h1>
          <p className="entrar max-w-lg text-lg" style={{ "--i": 2 } as React.CSSProperties}>
            Valeu, {pedido.cliente.nome.split(" ")[0]}! O pedido nº {pedido.numero} foi registrado e o resumo vai para {pedido.cliente.email}.
          </p>

          {pix && (
            <section
              aria-labelledby="pix-titulo"
              className="vidro entrar flex flex-wrap items-center gap-6 rounded-[26px] p-6"
              style={{ "--i": 3 } as React.CSSProperties}
            >
              <div className="relative grid h-40 w-40 shrink-0 place-items-center rounded-xl bg-white p-3 text-center shadow-[inset_0_0_0_1px_var(--color-linha)]">
                <span className="mono text-[0.6rem] leading-relaxed text-[#5a5450]">
                  QR code
                  <br />
                  do Pix
                  <br />
                  (teste)
                </span>
              </div>
              <div className="flex min-w-[14rem] flex-1 flex-col gap-2.5">
                <h2 id="pix-titulo" className="disp text-lg">
                  Pague com Pix
                </h2>
                <p className="text-sm text-[#4a433f]">
                  Na versão final, o QR code e o código copia e cola aparecem aqui. A peça fica reservada por 30 minutos até o pagamento.
                </p>
                <Reserva desde={pedido.criadoEm} />
              </div>
            </section>
          )}
        </div>

        <aside className="vidro entrar self-start rounded-[28px] p-7 lg:sticky lg:top-24" style={{ "--i": 2 } as React.CSSProperties}>
          <div className="flex items-center justify-between">
            <h2 className="disp text-lg">Resumo</h2>
            <span className="mono text-suave">n.º {pedido.numero}</span>
          </div>
          <ul className="mt-5 space-y-2.5 border-y border-dashed border-metal py-4 text-sm">
            {pedido.itens.map((p) => (
              <li key={p.slug} className="flex justify-between gap-3">
                <span>
                  {p.nome} <span className="text-suave">({p.marca}, {p.tamanho})</span>
                </span>
                <span className="shrink-0 font-mono">{formatarPreco(p.preco)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 font-mono text-[0.8rem]">
            <div className="flex justify-between gap-4">
              <dt>Frete Correios {pedido.frete.tipo}</dt>
              <dd>{formatarPreco(pedido.frete.valor)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Pagamento</dt>
              <dd className="text-right">
                {pix
                  ? "Pix"
                  : `Cartão, ${pedido.pagamento.parcelas}x de ${formatarPreco(pedido.pagamento.valorParcela)}${pedido.pagamento.comJuros ? " com juros" : ""}`}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Prazo de entrega</dt>
              <dd className="text-right">{pedido.frete.prazo} após a confirmação</dd>
            </div>
          </dl>
          <div className="mt-4 flex items-baseline justify-between border-t border-dashed border-metal pt-4">
            <span className="font-semibold">Total</span>
            <span className="disp text-[1.5rem] tracking-[0.01em]">{formatarPreco(pedido.total)}</span>
          </div>
          <p className="metal mt-6 rounded-[2px] px-4 py-3.5 text-sm text-[#4a433f]">
            O código de rastreio é enviado por e-mail assim que a peça for postada. Dúvidas? Chama na{" "}
            <a className="link" href={loja.dmUrl} target="_blank" rel="noopener noreferrer">
              DM do @{loja.instagram}
            </a>
            .
          </p>
          <Link href="/loja" className="btn btn-cheio mt-6 w-full">
            Voltar para a loja
          </Link>
        </aside>
      </div>
    </div>
  );
}
