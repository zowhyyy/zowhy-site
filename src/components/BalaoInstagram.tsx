"use client";

import { usePathname } from "next/navigation";
import { loja } from "@/data/config-loja";
import { IconeInstagram } from "./Icones";

/** Balão fixo no canto da tela que abre a DM do Instagram do brechó. */
export function BalaoInstagram() {
  const pathname = usePathname();
  if (pathname.startsWith("/checkout")) return null;
  // Na página da peça, no celular, sobe para não cobrir a barra de compra.
  const naPeca = pathname.startsWith("/peca/");

  return (
    <a
      href={loja.dmUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Tirar dúvidas pela DM do Instagram @${loja.instagram}`}
      className={`group fixed right-4 z-30 flex min-h-11 items-center gap-2 rounded-[1.4rem_1.4rem_0.3rem_1.4rem] bg-vinho py-2.5 pr-4 pl-3 text-[0.72rem] font-semibold tracking-[0.1em] text-white uppercase shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_10px_24px_-10px_rgb(130_36_52/0.8)] transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-vinho-escuro active:scale-95 md:right-6 md:bottom-6 ${
        naPeca ? "bottom-24" : "bottom-4"
      }`}
    >
      <IconeInstagram className="h-5 w-5 transition-transform duration-300 group-hover:rotate-[-8deg]" />
      <span>Dúvidas? Chama na DM</span>
    </a>
  );
}
