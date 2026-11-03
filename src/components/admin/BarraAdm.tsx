"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sair } from "@/app/admin/acoes";
import { loja } from "@/data/config-loja";

const links = [
  { href: "/admin", rotulo: "Visão geral" },
  { href: "/admin/pecas", rotulo: "Peças" },
  { href: "/admin/drops", rotulo: "Drops" },
  { href: "/admin/lookbook", rotulo: "Lookbook" },
];

export function BarraAdm() {
  const pathname = usePathname();
  const ativo = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
      <div className="relative isolate mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5">
        <div className="vidro absolute inset-0 -z-10 rounded-[20px]" aria-hidden="true" />
        <Link href="/admin" className="flex items-baseline gap-2">
          <span className="logo text-[1.1rem]">{loja.nome}</span>
          <span className="mono rounded-full bg-vinho px-2 py-0.5 text-[0.55rem] text-white">adm</span>
        </Link>
        <nav aria-label="Painel" className="sem-barra order-3 -mx-1 flex w-full gap-1 overflow-x-auto sm:order-none sm:mx-auto sm:w-auto">
          {links.map((l) => (
            <Link key={l.href} href={l.href} aria-current={ativo(l.href) ? "page" : undefined} className="link-nav shrink-0">
              {l.rotulo}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 sm:ml-0">
          <Link href="/" className="mono rounded-full px-3 py-2 text-[0.6rem] transition-colors hover:text-vinho">
            Ver site ↗
          </Link>
          <form action={sair}>
            <button type="submit" className="mono rounded-full bg-grafite/5 px-3 py-2 text-[0.6rem] transition-colors hover:bg-vinho hover:text-white">
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
