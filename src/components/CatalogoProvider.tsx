"use client";

import { createContext, useContext } from "react";
import type { Drop, Produto } from "@/lib/tipos";

// Peças e drops atuais (vindos do armazém) para os componentes que rodam no navegador:
// sacola, busca e carrossel. O layout lê os dados no servidor e entrega aqui.

interface Catalogo {
  produtos: Produto[];
  drops: Drop[];
}

const Contexto = createContext<Catalogo>({ produtos: [], drops: [] });

export function CatalogoProvider({ produtos, drops, children }: Catalogo & { children: React.ReactNode }) {
  return <Contexto.Provider value={{ produtos, drops }}>{children}</Contexto.Provider>;
}

export function useCatalogo() {
  return useContext(Contexto);
}
