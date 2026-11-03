import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FormLoginAdm } from "@/components/admin/FormLoginAdm";
import { loja } from "@/data/config-loja";
import { admConfigurado, ehAdm } from "@/lib/sessao";

export const metadata: Metadata = { title: "Entrar no painel" };

export default async function EntrarAdm() {
  if (await ehAdm()) redirect("/admin");
  return (
    <div className="grid min-h-dvh place-items-center py-10">
      <span className="mancha fixed top-[10%] left-[8%] -z-10 h-[34vmax] w-[34vmax] rounded-full bg-vinho/60 blur-[90px]" aria-hidden="true" />
      <section className="vidro entrar w-full max-w-md rounded-[30px] px-6 py-9 sm:px-10">
        <p className="logo text-[1.25rem]">
          {loja.nome}
          <sup className="mono ml-0.5 align-top text-[0.5rem] tracking-normal text-vinho">©</sup>
        </p>
        <p className="mono mt-7 flex items-center gap-2.5 text-[#5a5450]">
          <span className="inline-block h-2 w-2 bg-vinho" aria-hidden="true" />
          Área restrita
        </p>
        <h1 className="mt-3 flex flex-col">
          <span className="disp text-[2rem]">Painel</span>
          <span className="titulo text-[3rem] leading-none text-vinho">da loja</span>
        </h1>
        {admConfigurado() ? (
          <FormLoginAdm />
        ) : (
          <p className="mt-6 rounded-2xl bg-vinho-claro p-4 text-sm leading-relaxed text-vinho">
            O login de ADM ainda não foi configurado. Preencha ADMIN_EMAIL, ADMIN_SENHA e ADMIN_SEGREDO no arquivo .env.local e
            reinicie o site.
          </p>
        )}
      </section>
    </div>
  );
}
