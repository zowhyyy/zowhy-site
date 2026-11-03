import type { Metadata } from "next";
import { BarraAdm } from "@/components/admin/BarraAdm";
import { ehAdm } from "@/lib/sessao";

export const metadata: Metadata = { title: "Painel ADM", robots: { index: false, follow: false } };

/** Painel de ADM: fica fora do visual da loja (sem navbar, rodapé, sacola nem popup). */
export default async function LayoutAdm({ children }: { children: React.ReactNode }) {
  const adm = await ehAdm();
  return (
    <div className="relative isolate min-h-dvh bg-[#faf9f7]">
      <div className="grade fixed inset-0 -z-10" aria-hidden="true" />
      {adm && <BarraAdm />}
      <main className="mx-auto max-w-6xl px-3 pb-24 sm:px-6">{children}</main>
    </div>
  );
}
