import Link from "next/link";

/** Faixa no topo do site que só a ADM logada vê. */
export function FaixaAdm({ fechada }: { fechada: boolean }) {
  return (
    <div className="relative z-50 flex items-center justify-center gap-4 bg-vinho px-4 py-2 text-white">
      <span className="mono text-[0.6rem]">
        Modo ADM · {fechada ? "loja FECHADA: os clientes veem o aviso, só você vê o site" : "loja aberta"}
      </span>
      <Link href="/admin" className="mono rounded-full bg-white/15 px-3 py-1 text-[0.6rem] transition-colors hover:bg-white hover:text-vinho">
        Painel →
      </Link>
    </div>
  );
}
