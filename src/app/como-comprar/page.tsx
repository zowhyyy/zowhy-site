import type { Metadata } from "next";
import { Revelar } from "@/components/Revelar";
import { IconeSeta } from "@/components/Icones";
import { loja } from "@/data/config-loja";
import { formatarPreco } from "@/lib/precos";

export const metadata: Metadata = { title: "Como comprar" };

const passos = [
  { titulo: "Escolha a peça", texto: "Confira as medidas e o estado na página de cada peça. Ela é única, então quem paga primeiro leva." },
  { titulo: "Pague", texto: "No Pix, com desconto, ou no cartão. Enquanto você paga, a peça fica reservada para você." },
  { titulo: "A gente posta", texto: "A peça é lavada, embalada e postada nos Correios em até 2 dias úteis depois do pagamento." },
  { titulo: "Acompanhe", texto: "O código de rastreio chega no seu e-mail assim que a peça é postada." },
];

export default function ComoComprar() {
  const { parcelamentoMinimo, parcelasSemJuros, parcelasMaximas, jurosMensal } = loja.pagamento;

  const perguntas = [
    {
      p: "Posso reservar uma peça?",
      r: "Não fazemos reserva: a peça é de quem pagar primeiro. Enquanto alguém está pagando, ela aparece como reservada por alguns minutos.",
    },
    { p: "As peças são lavadas?", r: "Sim. Toda peça é lavada e revisada antes de ir para o site." },
    {
      p: "Como sei se a peça vai servir?",
      r: "Pegue uma roupa sua que veste bem, estique sobre uma mesa e meça. Depois compare com as medidas na página da peça.",
    },
    { p: "Quando sai o próximo drop?", r: `Avisamos sempre no Instagram @${loja.instagram}, alguns dias antes.` },
    { p: "Vocês têm loja física?", r: "Não. Vendemos só pelo site, com envio para todo o Brasil." },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-10 lg:pt-24">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <h1 className="flex flex-col gap-1">
          <span className="revela-linha">
            <span className="disp cromo text-[clamp(3rem,9vw,7.5rem)]">Como</span>
          </span>
          <span className="revela-linha">
            <span className="titulo text-[clamp(3.8rem,12vw,9.5rem)] text-vinho md:ml-24" style={{ "--i": 1 } as React.CSSProperties}>
              comprar
            </span>
          </span>
        </h1>
        <p className="entrar max-w-xs text-[1.05rem] text-suave" style={{ "--i": 2 } as React.CSSProperties}>
          Quatro passos. Cada peça é única, então quem paga primeiro leva.
        </p>
      </div>

      <ol className="relative mt-20 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        <li aria-hidden="true" className="absolute inset-x-0 top-16 hidden border-t-2 border-dashed border-metal lg:block" />
        {passos.map((passo, i) => (
          <li
            key={passo.titulo}
            className={`entrar relative flex flex-col gap-3.5 transition-transform duration-500 hover:-translate-y-1.5 ${i % 2 ? "lg:mt-14" : ""}`}
            style={{ "--i": i + 2 } as React.CSSProperties}
          >
            <span className="metal grid h-32 w-32 place-items-center rounded-[2px] font-display text-6xl font-bold text-vinho">{i + 1}</span>
            <h2 className="text-xl font-semibold">{passo.titulo}</h2>
            <p className="text-suave">{passo.texto}</p>
          </li>
        ))}
      </ol>

      <div className="mt-28 grid gap-6 lg:grid-cols-3">
        <Revelar>
          <section id="pagamento" className="vidro flex h-full flex-col gap-4 rounded-[26px] p-8">
            <p className="mono text-vinho">Pagamento</p>
            <h2 className="titulo text-[2.8rem]">Pix ou cartão</h2>
            <ul className="mt-4 space-y-3 leading-relaxed">
              <li>
                <strong className="font-semibold">Pix:</strong> tem desconto, aplicado na hora do pagamento.
              </li>
              <li>
                <strong className="font-semibold">Cartão de crédito:</strong> em até {parcelasSemJuros}x sem juros para compras a
                partir de {formatarPreco(parcelamentoMinimo)} em peças. Também dá para parcelar em até {parcelasMaximas}x, com
                juros de {(jurosMensal * 100).toLocaleString("pt-BR")}% ao mês nas parcelas acima de {parcelasSemJuros}x.
              </li>
              <li>Abaixo de {formatarPreco(parcelamentoMinimo)}, dá para pagar no crédito em 1x, sem parcelamento.</li>
            </ul>
          </section>
        </Revelar>

        <Revelar>
          <section id="envio" className="vidro flex h-full flex-col gap-4 rounded-[26px] p-8 lg:mt-14">
            <p className="mono text-vinho">Envio</p>
            <h2 className="titulo text-[2.8rem]">Correios, Brasil todo</h2>
            <ul className="mt-4 space-y-3 leading-relaxed">
              <li>Enviamos pelos Correios, PAC ou SEDEX, para todo o Brasil. O valor e o prazo aparecem quando você digita o CEP.</li>
              <li>A postagem acontece em até 2 dias úteis depois da confirmação do pagamento.</li>
              <li>Comprou mais de uma peça? Vai tudo junto, em um frete só.</li>
            </ul>
          </section>
        </Revelar>

        <Revelar>
          <section id="trocas" className="vidro flex h-full flex-col gap-4 rounded-[26px] p-8">
            <p className="mono text-vinho">Trocas e devoluções</p>
            <h2 className="titulo text-[2.8rem]">7 dias para devolver</h2>
            <ul className="mt-4 space-y-3 leading-relaxed">
              <li>
                Como cada peça é única, não temos outro tamanho para trocar. Se a peça não servir ou não for o que você esperava,
                você pode devolver em até 7 dias corridos depois de receber, e devolvemos o valor pago.
              </li>
              <li>A peça precisa voltar do jeito que foi enviada, sem uso e sem lavagem.</li>
              <li>
                Para devolver, mande uma DM para{" "}
                <a className="link" href={loja.dmUrl} target="_blank" rel="noopener noreferrer">
                  @{loja.instagram}
                </a>{" "}
                com o número do pedido.
              </li>
            </ul>
          </section>
        </Revelar>

      </div>

      <Revelar>
        <section id="duvidas" className="mt-28 grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <h2>
              <span className="disp text-[clamp(2rem,4.5vw,3rem)]">Dúvidas</span>
              <br />
              <span className="titulo text-[clamp(2.8rem,6vw,4.2rem)] text-vinho">frequentes</span>
            </h2>
            <p className="mt-5 text-suave">
              Não achou? Chama na{" "}
              <a className="link" href={loja.dmUrl} target="_blank" rel="noopener noreferrer">
                DM do @{loja.instagram}
              </a>
              .
            </p>
          </div>
          <div className="border-t border-grafite">
            {perguntas.map((q) => (
              <details key={q.p} className="acordeao border-b border-linha">
                <summary className="flex min-h-[4.5rem] items-center justify-between gap-5 py-3 text-lg font-medium transition-[padding] duration-500 hover:pl-3">
                  {q.p}
                  <IconeSeta className="seta h-5 w-5 shrink-0 text-suave" />
                </summary>
                <p className="conteudo max-w-2xl pb-6 text-[1.05rem] text-[#4a433f]">{q.r}</p>
              </details>
            ))}
          </div>
        </section>
      </Revelar>
    </div>
  );
}
