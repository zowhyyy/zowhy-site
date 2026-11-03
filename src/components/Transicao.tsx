"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { loja } from "@/data/config-loja";

type Fase = "parada" | "cobrindo" | "descobrindo";

/**
 * Transição entre páginas: uma cortina sobe cobrindo a tela, a página troca
 * e a cortina sai por cima. Funciona em todos os links internos.
 */
export function Transicao() {
  const router = useRouter();
  const pathname = usePathname();
  const [fase, setFase] = useState<Fase>("parada");
  const faseRef = useRef<Fase>("parada");
  const timers = useRef<number[]>([]);

  const mudar = (f: Fase) => {
    faseRef.current = f;
    setFase(f);
  };

  const descobrir = () => {
    if (faseRef.current !== "cobrindo") return;
    timers.current.forEach(clearTimeout);
    mudar("descobrindo");
    timers.current = [window.setTimeout(() => mudar("parada"), 560)];
  };

  useEffect(() => {
    function clique(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a");
      if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      if (faseRef.current === "cobrindo") {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      mudar("cobrindo");
      timers.current.forEach(clearTimeout);
      timers.current = [
        window.setTimeout(() => router.push(url.pathname + url.search + url.hash), 430),
        // Segurança: se a rota não mudar (ex.: só a busca mudou), descobre mesmo assim
        window.setTimeout(descobrir, 1600),
      ];
    }
    document.addEventListener("click", clique, true);
    return () => document.removeEventListener("click", clique, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    descobrir();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className={`cortina cortina-${fase}`} aria-hidden="true">
      <span className="disp cromo cortina-logo">{loja.nome}</span>
      <span className="cortina-linha" />
    </div>
  );
}
