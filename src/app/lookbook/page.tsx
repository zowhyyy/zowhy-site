import type { Metadata } from "next";
import { LivroLookbook } from "@/components/LivroLookbook";
import { lerDados } from "@/lib/armazem";
import type { Produto } from "@/lib/tipos";

export const metadata: Metadata = {
  title: "Lookbook",
  description: "O lookbook do brechó: folheie as fotos e veja as peças de cada look.",
};

export default async function Lookbook() {
  const { lookbook, produtos } = await lerDados();
  const paginas = lookbook.map((p) => ({
    ...p,
    produtos: p.pecas.map((s) => produtos.find((x) => x.slug === s)).filter((x): x is Produto => Boolean(x)),
  }));

  return (
    <div className="relative overflow-x-clip">
      <div className="grade absolute inset-0 -z-10 [mask-image:linear-gradient(180deg,#000_40%,transparent)]" aria-hidden="true" />
      <header className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-4 pt-10 sm:px-6 lg:px-10 lg:pt-14">
        <div>
          <p className="mono entrar text-suave">Editorial / folheie</p>
          <h1 className="revela-linha mt-3">
            <span className="disp text-[clamp(2.6rem,8vw,5.2rem)]">Look</span>
            <span className="titulo text-[clamp(3.2rem,10vw,6.4rem)] text-vinho">book</span>
          </h1>
        </div>
        <p className="entrar max-w-xs text-suave" style={{ "--i": 2 } as React.CSSProperties}>
          Clique na página, arraste ou use as setas para virar. As peças de cada look estão do lado da foto.
        </p>
      </header>
      <LivroLookbook paginas={paginas} />
    </div>
  );
}
