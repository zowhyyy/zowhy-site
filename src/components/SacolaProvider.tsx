"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Produto } from "@/lib/tipos";
import { useCatalogo } from "./CatalogoProvider";

// A sacola guarda só os slugs das peças. Cada peça é única, então não existe quantidade.
const CHAVE = "closet-zowhy-sacola";

interface Sacola {
  itens: Produto[];
  pronto: boolean;
  quantidade: number;
  tem: (slug: string) => boolean;
  adicionar: (slug: string) => void;
  remover: (slug: string) => void;
  esvaziar: () => void;
  /** Gaveta lateral da sacola */
  gaveta: boolean;
  abrirGaveta: () => void;
  fecharGaveta: () => void;
}

const Contexto = createContext<Sacola | null>(null);

export function SacolaProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [pronto, setPronto] = useState(false);
  const [gaveta, setGaveta] = useState(false);
  const { produtos } = useCatalogo();
  const abrirGaveta = useCallback(() => setGaveta(true), []);
  const fecharGaveta = useCallback(() => setGaveta(false), []);

  useEffect(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem(CHAVE) ?? "[]");
      if (Array.isArray(salvo)) setSlugs(salvo.filter((s) => typeof s === "string"));
    } catch {}
    setPronto(true);
  }, []);

  useEffect(() => {
    if (!pronto) return;
    try {
      localStorage.setItem(CHAVE, JSON.stringify(slugs));
    } catch {}
  }, [slugs, pronto]);

  const adicionar = useCallback((slug: string) => setSlugs((s) => (s.includes(slug) ? s : [...s, slug])), []);
  const remover = useCallback((slug: string) => setSlugs((s) => s.filter((x) => x !== slug)), []);
  const esvaziar = useCallback(() => setSlugs([]), []);

  const valor = useMemo<Sacola>(() => {
    const itens = slugs.map((s) => produtos.find((p) => p.slug === s)).filter((p): p is Produto => Boolean(p));
    return {
      itens,
      pronto,
      quantidade: itens.length,
      tem: (slug) => slugs.includes(slug),
      adicionar,
      remover,
      esvaziar,
      gaveta,
      abrirGaveta,
      fecharGaveta,
    };
  }, [slugs, produtos, pronto, adicionar, remover, esvaziar, gaveta, abrirGaveta, fecharGaveta]);

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useSacola() {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useSacola precisa estar dentro de <SacolaProvider>");
  return ctx;
}
