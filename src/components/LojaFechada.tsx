import Link from "next/link";
import { loja } from "@/data/config-loja";
import type { AvisoLoja } from "@/lib/tipos";
import { IconeInstagram } from "./Icones";

/**
 * Tela que o cliente vê enquanto a loja está fechada pelo painel de ADM
 * (por exemplo, montando um drop novo). Título e mensagem são editados no painel.
 */
export function LojaFechada({ aviso }: { aviso: AvisoLoja }) {
  const [primeira, ...resto] = aviso.titulo.split(" ");
  return (
    <main className="relative isolate grid min-h-dvh place-items-center overflow-hidden px-4 py-16">
      <div className="grade absolute inset-0 -z-20" aria-hidden="true" />
      {/* Manchas de cor atrás do vidro */}
      <span className="mancha mancha-vinho absolute top-[calc(8%-7vmax)] left-[calc(12%-7vmax)] -z-10 h-[52vmax] w-[52vmax]" aria-hidden="true" />
      <span
        className="mancha mancha-cinza absolute right-[calc(6%-6vmax)] bottom-[calc(4%-6vmax)] -z-10 h-[42vmax] w-[42vmax]"
        style={{ animationDelay: "-6s" }}
        aria-hidden="true"
      />
      <section className="vidro entrar relative w-full max-w-[40rem] rounded-[32px] px-6 pt-8 pb-8 sm:px-12 sm:pt-12 sm:pb-11">
        <div className="flex items-center justify-between gap-4">
          <p className="logo text-[1.3rem]">
            {loja.nome}
            <sup className="mono ml-0.5 align-top text-[0.5rem] tracking-normal text-vinho">©</sup>
          </p>
          {/* Selo de vidro com o status do drop: ponto vinho pulsando e um brilho passando */}
          <span className="selo-status vidro mono relative hidden items-center gap-2 overflow-hidden rounded-full py-1.5 pr-3.5 pl-2.5 text-[0.55rem] text-grafite sm:inline-flex" aria-hidden="true">
            <span className="relative grid h-2 w-2 place-items-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-vinho/60" />
              <span className="h-2 w-2 rounded-full bg-vinho" />
            </span>
            drop em preparo
          </span>
        </div>
        <p className="mono mt-8 flex items-center gap-2.5 text-[#5a5450]">
          <span className="inline-block h-2 w-2 animate-pulse bg-vinho" aria-hidden="true" />
          Loja fechada por enquanto
        </p>
        <h1 className="mt-4 flex flex-col">
          <span className="disp text-[clamp(1.9rem,6vw,3.1rem)]">{primeira}</span>
          {resto.length > 0 && <span className="titulo text-[clamp(2.6rem,8vw,4.4rem)] leading-[1] text-vinho">{resto.join(" ")}</span>}
        </h1>
        <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-[#3f3935]">{aviso.mensagem}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href={loja.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-cheio">
            <IconeInstagram className="h-4 w-4" />
            Seguir @{loja.instagram}
          </a>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-grafite/10 pt-4">
          <p className="mono text-[0.58rem] text-suave">
            Peça única · sem reposição ·{" "}
            <Link href="/admin/entrar" className="transition-colors hover:text-vinho">
              adm
            </Link>
          </p>
          {/* Barrinha de carregamento em quadradinhos pixel, acendendo um por um */}
          <span className="flex items-center gap-2.5" aria-hidden="true">
            <span className="mono text-[0.55rem] text-suave">carregando</span>
            <span className="flex gap-[3px]">
              {Array.from({ length: 10 }, (_, i) => (
                <span key={i} className="pixel-carga h-[7px] w-[7px]" style={{ animationDelay: `${i * 0.14}s` }} />
              ))}
            </span>
          </span>
        </div>
      </section>
    </main>
  );
}
