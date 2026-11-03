import type { Metadata } from "next";
import Link from "next/link";
import { Revelar } from "@/components/Revelar";
import { loja } from "@/data/config-loja";

export const metadata: Metadata = { title: "Sobre" };

const etapas = [
  { nome: "Garimpa", tom: "tom-prata", foto: "garimpo" },
  { nome: "Lava", tom: "tom-bege", foto: "lavagem" },
  { nome: "Revisa", tom: "tom-grafite", foto: "revisão" },
  { nome: "Fotografa", tom: "tom-vinho", foto: "estúdio" },
];

// Texto provisório: troque pela história real do brechó.
export default function Sobre() {
  return (
    <div>
      <header className="relative mx-auto max-w-7xl px-4 pt-14 pb-20 sm:px-6 lg:px-10 lg:pt-24">
        <p className="mono entrar text-suave">Sobre o brechó</p>
        <h1 className="mt-6 flex flex-col gap-1">
          <span className="revela-linha">
            <span className="disp cromo text-[clamp(2.6rem,8vw,6.5rem)]">Roupa boa</span>
          </span>
          <span className="revela-linha">
            <span className="titulo text-[clamp(3.6rem,11vw,9.5rem)] text-vinho md:ml-28" style={{ "--i": 1 } as React.CSSProperties}>
              não precisa
            </span>
          </span>
          <span className="revela-linha">
            <span className="disp text-[clamp(2.6rem,8vw,6.5rem)]" style={{ "--i": 2 } as React.CSSProperties}>
              ser nova.
            </span>
          </span>
        </h1>
        <div
          className="metal entrar absolute right-10 bottom-24 hidden w-64 flex-col gap-2.5 rounded-[2px] px-5 py-4 lg:flex"
          style={{ "--i": 3 } as React.CSSProperties}
          aria-hidden="true"
        >
          <span className="mono text-[0.6rem] text-[#5a5450]">{loja.nome.toLowerCase()} / manifesto</span>
          <span className="text-[2rem] leading-none font-light text-tinta">
            (garimpo)<sup className="text-base text-vinho">2</sup>
          </span>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-14 px-4 pb-24 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:gap-20 lg:px-10">
        <div className="capitular space-y-5 text-lg leading-relaxed md:columns-2 md:gap-12 [&_p]:break-inside-avoid">
          <p>
            O {loja.nome} é um brechó online de peças únicas. A gente garimpa roupa que vale a pena, como vintage, grife e básicos que
            duram, e lava, revisa e fotografa cada uma antes de colocar no ar.
          </p>
          <p>
            Como cada peça existe uma vez só, não tem reposição: quando alguém compra, ela sai da loja. Por isso as novidades chegam em
            drops, avisados primeiro no Instagram.
          </p>
          <p>
            Comprar de brechó é vestir algo que já tem história e evitar que uma roupa boa vá para o lixo. A nossa parte é fazer ela
            chegar até você do jeito certo, com as medidas e o estado descritos sem enrolação.
          </p>
        </div>

        <aside className="vidro flex flex-col gap-4 self-start rounded-[28px] p-8 lg:sticky lg:top-24">
          <h2 className="titulo text-[2.75rem]">Fale com a gente</h2>
          <p className="text-[#4a433f]">Dúvida sobre uma peça, tamanho ou envio? O jeito mais rápido é a DM do Instagram.</p>
          <div className="flex flex-wrap gap-2.5">
            <a href={loja.dmUrl} target="_blank" rel="noopener noreferrer" className="btn btn-cheio">
              Mandar DM no Instagram
            </a>
            <a href={`mailto:${loja.email}`} className="btn">
              Enviar e-mail
            </a>
          </div>
          <p className="text-sm text-suave">
            Não temos loja física. Todas as vendas são pelo site, com envio pelos Correios para todo o Brasil.{" "}
            <Link href="/como-comprar" className="link">
              Veja como comprar
            </Link>
            .
          </p>
        </aside>
      </section>

      <section className="bg-nevoa py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Revelar>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2>
                <span className="disp text-[clamp(2rem,5vw,3.4rem)]">Antes de</span>{" "}
                <span className="titulo text-[clamp(2.8rem,7vw,4.6rem)] text-vinho">ir pro ar</span>
              </h2>
              <p className="mono text-suave">Toda peça passa por aqui</p>
            </div>
          </Revelar>
          <ol className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {etapas.map((e, i) => (
              <li key={e.nome} className={`transition-transform duration-500 hover:-translate-y-1.5 ${i % 2 ? "lg:mt-14" : ""}`}>
                <Revelar className="flex flex-col gap-3">
                  <div className={`foto-editorial grao h-56 rounded-[4px] sm:h-80 ${e.tom}`}>
                    <span className="foto-editorial-rotulo">
                      Foto · {e.foto}
                      <br />
                      placeholder
                    </span>
                  </div>
                  <span className="mono text-vinho">{String(i + 1).padStart(2, "0")}</span>
                  <span className="disp text-lg">{e.nome}</span>
                </Revelar>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
