"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { loja } from "@/data/config-loja";
import { Busca } from "./Busca";
import { IconeConta, IconeFechar, IconeMenu, IconeSacola } from "./Icones";
import { useSacola } from "./SacolaProvider";

const links = [
  { href: "/loja", rotulo: "Loja" },
  { href: "/drops", rotulo: "Drops" },
  { href: "/lookbook", rotulo: "Lookbook" },
  { href: "/sobre", rotulo: "Sobre" },
  { href: "/como-comprar", rotulo: "Como comprar" },
];

const ativo = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

/** Nome da loja no menu. O espaço tem tamanho fixo (150 × 28 px no computador). */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label={`${loja.nome}, início`} className={`flex h-7 w-[7.5rem] shrink-0 items-center sm:w-[9.4rem] ${className}`}>
      <span className="logo text-[1.1rem] sm:text-[1.25rem]">
        {loja.nome}
        <sup className="mono ml-0.5 align-top text-[0.5rem] tracking-normal text-vinho">©</sup>
      </span>
    </Link>
  );
}

export function Cabecalho() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const { quantidade, pronto, abrirGaveta } = useSacola();

  useEffect(() => setAberto(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
      <div className="relative isolate mx-auto flex h-[3.6rem] max-w-[75rem] items-center gap-2 pr-1.5 pl-1.5 lg:gap-6 lg:pl-5">
        {/* O vidro fica numa camada à parte: backdrop-filter no contêiner prenderia o fundo da busca dentro dele */}
        <div className="vidro absolute inset-0 -z-10 rounded-[20px]" aria-hidden="true" />
        <button
          type="button"
          className="icone-nav lg:hidden"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={aberto}
          onClick={() => setAberto((a) => !a)}
        >
          <span className={`icone-troca ${aberto ? "girar" : ""}`}>
            {aberto ? <IconeFechar className="h-6 w-6" /> : <IconeMenu className="h-6 w-6" />}
          </span>
        </button>

        <Logo className="max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:justify-center" />

        <nav aria-label="Principal" className="mx-auto hidden lg:block">
          <ul className="flex gap-0.5">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={ativo(pathname, l.href) ? "page" : undefined} className="link-nav">
                  {l.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center lg:ml-0">
          <Busca />
          {loja.contasAtivas && (
            <Link
              href="/entrar"
              className="icone-nav max-lg:hidden"
              aria-label="Minha conta"
              aria-current={pathname.startsWith("/entrar") ? "page" : undefined}
            >
              <IconeConta className="h-5 w-5" />
            </Link>
          )}
          <button
            type="button"
            onClick={abrirGaveta}
            className="icone-nav"
            aria-label={`Abrir sacola, ${quantidade} ${quantidade === 1 ? "peça" : "peças"}`}
          >
            <IconeSacola className="sacola-icone h-5 w-5" />
            {pronto && quantidade > 0 && (
              <span
                key={quantidade}
                className="pulo absolute top-1.5 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-vinho px-1 text-[0.62rem] font-semibold text-white"
              >
                {quantidade}
              </span>
            )}
          </button>
        </div>

        {aberto && (
          <nav aria-label="Menu" className="menu-mobile vidro absolute inset-x-0 top-full mt-2 rounded-[24px] px-5 pt-3 pb-5 lg:hidden">
            <ul>
              {[{ href: "/", rotulo: "Início" }, ...links].map((l, i) => (
                <li key={l.href} className="entrar border-b border-grafite/10" style={{ "--i": i } as React.CSSProperties}>
                  <Link
                    href={l.href}
                    aria-current={ativo(pathname, l.href) ? "page" : undefined}
                    className={`flex items-baseline justify-between py-3.5 transition-colors hover:text-vinho ${
                      ativo(pathname, l.href) ? "text-vinho" : ""
                    }`}
                  >
                    {l.href === "/como-comprar" ? (
                      <span className="titulo text-[2.4rem]">{l.rotulo}</span>
                    ) : (
                      <span className="disp text-[1.9rem]">{l.rotulo}</span>
                    )}
                    <span className="mono text-suave">→</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className={`mt-5 grid gap-2 ${loja.contasAtivas ? "grid-cols-2" : ""}`}>
              {loja.contasAtivas && (
                <Link href="/entrar" className="btn">
                  Entrar
                </Link>
              )}
              <button type="button" onClick={abrirGaveta} className="btn btn-cheio">
                Sacola{pronto && quantidade > 0 ? ` · ${quantidade}` : ""}
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
