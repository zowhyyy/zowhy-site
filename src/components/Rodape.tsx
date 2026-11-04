import Link from "next/link";
import { loja } from "@/data/config-loja";
import { BotaoEmail } from "./BotaoEmail";

export function Rodape() {
  const { parcelasSemJuros, parcelamentoMinimo } = loja.pagamento;
  return (
    <footer className="relative mt-28 overflow-hidden bg-grafite text-[#cfc9c4]">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pt-20 sm:px-6 md:grid-cols-[1.4fr_1fr_1.2fr] lg:px-10">
        <div>
          <p className="logo text-2xl text-white">
            {loja.nome}
            <sup className="mono ml-0.5 align-top text-[0.55rem] text-[#c25a6c]">©</sup>
          </p>
          <p className="mt-4 max-w-xs">Brechó online de peças únicas. Enviamos para todo o Brasil.</p>
        </div>

        <div>
          <h2 className="mono text-white">Loja</h2>
          <ul className="mt-5 flex flex-col gap-2.5">
            {[
              ["/loja", "Todas as peças"],
              ["/drops", "Drops"],
              ["/lookbook", "Lookbook"],
              ["/como-comprar", "Como comprar"],
              ["/como-comprar#trocas", "Trocas e devoluções"],
              ["/sobre", "Sobre o brechó"],
            ].map(([href, rotulo]) => (
              <li key={href}>
                <Link className="inline-block transition-[color,translate] duration-300 hover:translate-x-1 hover:text-white" href={href}>
                  {rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mono text-white">Fale com a gente</h2>
          <ul className="mt-5 flex flex-col gap-2.5">
            <li>
              <a className="transition-colors hover:text-white" href={loja.dmUrl} target="_blank" rel="noopener noreferrer">
                DM no Instagram @{loja.instagram}
              </a>
            </li>
            <li>
              <BotaoEmail className="transition-colors hover:text-white">{loja.email}</BotaoEmail>
            </li>
          </ul>
          <p className="mt-6 text-sm text-metal">
            Desconto no Pix. Cartão de crédito em até {parcelasSemJuros}x sem juros em compras a partir de R$&nbsp;{parcelamentoMinimo}.
          </p>
        </div>
      </div>

      <div className="mt-16 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 text-sm sm:px-6 lg:px-10">
          © {new Date().getFullYear()} {loja.nome}
        </div>
      </div>
    </footer>
  );
}
