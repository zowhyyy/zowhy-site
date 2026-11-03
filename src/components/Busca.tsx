"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ordenarPecas } from "@/lib/catalogo";
import { formatarPreco } from "@/lib/precos";
import { rotuloCategoria, rotuloEstilo, rotuloSecao } from "@/lib/rotulos";
import type { Produto } from "@/lib/tipos";
import { useCatalogo } from "./CatalogoProvider";
import { FotoPeca } from "./FotoPeca";
import { IconeBusca, IconeFechar } from "./Icones";

export function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function combinaComBusca(p: Produto, termo: string) {
  const alvo = normalizar(
    [p.nome, p.marca, p.cor ?? "", rotuloCategoria[p.categoria], rotuloEstilo[p.estilo], rotuloSecao[p.secao], p.tamanho].join(" "),
  );
  return normalizar(termo)
    .split(/\s+/)
    .filter(Boolean)
    .every((palavra) => alvo.includes(palavra));
}

export function Busca() {
  const [aberta, setAberta] = useState(false);
  const [termo, setTermo] = useState("");
  const campo = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const { produtos, drops } = useCatalogo();

  useEffect(() => setAberta(false), [pathname]);

  useEffect(() => {
    if (!aberta) return;
    campo.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberta(false);
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [aberta]);

  const resultados = useMemo(
    () => (termo.trim().length < 2 ? [] : ordenarPecas(produtos, drops).filter((p) => combinaComBusca(p, termo))),
    [termo, produtos, drops],
  );

  return (
    <>
      <button
        type="button"
        className="icone-nav"
        aria-label="Buscar peças"
        aria-expanded={aberta}
        onClick={() => setAberta((a) => !a)}
      >
        <IconeBusca className="h-5 w-5" />
      </button>

      {aberta && (
        <>
          <div
            className="fundo-escuro fixed inset-0 -z-10 bg-grafite/25 backdrop-blur-[6px]"
            onClick={() => setAberta(false)}
          />
          <div className="painel-busca absolute inset-x-0 top-full z-40 mt-2 rounded-[24px] bg-white/95 shadow-[0_30px_60px_-30px_rgb(37_32_29/0.6)] backdrop-blur-xl">
            <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6">
              <form
                role="search"
                className="flex items-center gap-3 border-b-2 border-grafite pb-2 focus-within:border-vinho"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (termo.trim()) {
                    const a = document.createElement("a");
                    a.href = `/loja?busca=${encodeURIComponent(termo.trim())}`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                  }
                }}
              >
                <IconeBusca className="h-6 w-6 shrink-0 text-suave" />
                <input
                  ref={campo}
                  type="search"
                  value={termo}
                  onChange={(e) => setTermo(e.target.value)}
                  placeholder="Busque por peça, marca ou cor"
                  aria-label="Buscar"
                  className="titulo min-w-0 flex-1 bg-transparent text-[1.9rem] placeholder:text-linha focus:outline-none"
                />
                {termo && (
                  <button type="button" onClick={() => setTermo("")} className="text-sm text-suave hover:text-vinho">
                    Limpar
                  </button>
                )}
                <button type="button" aria-label="Fechar busca" onClick={() => setAberta(false)} className="text-suave hover:text-vinho">
                  <IconeFechar className="h-6 w-6" />
                </button>
              </form>

              {termo.trim().length >= 2 && (
                <div className="mt-4" aria-live="polite">
                  {resultados.length === 0 ? (
                    <p className="py-4 text-suave">Nenhuma peça encontrada para &quot;{termo}&quot;.</p>
                  ) : (
                    <>
                      <ul className="max-h-[55vh] divide-y divide-linha overflow-y-auto">
                        {resultados.slice(0, 6).map((p, i) => (
                          <li key={p.slug} className="resultado-entrar" style={{ "--i": i } as React.CSSProperties}>
                            <Link href={`/peca/${p.slug}`} className="group flex items-center gap-4 py-3">
                              <span
                                className={`relative block aspect-[4/5] w-14 shrink-0 overflow-hidden rounded-[3px] bg-nevoa ${
                                  p.situacao === "vendida" ? "grayscale" : ""
                                }`}
                              >
                                <FotoPeca produto={p} sizes="56px" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm text-suave">{p.marca}</span>
                                <span className="block truncate transition-colors group-hover:text-vinho">{p.nome}</span>
                              </span>
                              <span className={`shrink-0 text-sm ${p.situacao === "vendida" ? "text-suave" : "font-semibold"}`}>
                                {p.situacao === "vendida" ? "Vendida" : formatarPreco(p.preco)}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link href={`/loja?busca=${encodeURIComponent(termo.trim())}`} className="btn mt-4 w-full">
                        Ver todos os {resultados.length} resultados
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
