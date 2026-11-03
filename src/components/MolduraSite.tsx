"use client";

import { usePathname } from "next/navigation";

/**
 * Decide o que envolve cada página: o painel de ADM (sem navbar nem rodapé),
 * o aviso de loja fechada ou o site normal.
 * Precisa rodar no navegador: o layout raiz não é refeito quando se navega
 * de uma página para outra (ex.: do painel para o site pelo "Ver site").
 */
export function MolduraSite({
  fechada,
  avisoFechado,
  topo,
  rodape,
  children,
}: {
  /** Loja fechada para quem está visitando (a ADM logada não conta) */
  fechada: boolean;
  avisoFechado: React.ReactNode;
  topo: React.ReactNode;
  rodape: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return children;
  if (fechada) return avisoFechado;
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
      >
        Pular para o conteúdo
      </a>
      {topo}
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      {rodape}
    </>
  );
}
