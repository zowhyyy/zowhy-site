import type { Metadata } from "next";
import { FormularioConta } from "@/components/FormularioConta";
import { loja } from "@/data/config-loja";

export const metadata: Metadata = { title: "Entrar" };

export default function Entrar() {
  return (
    <div className="-mt-[4.35rem] grid min-h-[calc(100dvh-34px)] md:grid-cols-2">
      <div className="foto-editorial grao cantos relative min-h-[22rem] md:min-h-0" style={{ background: "radial-gradient(110% 80% at 30% 20%,#b9c2cf 0%,#5f6a7b 46%,#1c1f26 100%)" }}>
        <span className="foto-editorial-rotulo">
          Foto editorial · retrato com flash
          <br />
          placeholder · substituir
        </span>
        <div className="absolute bottom-10 left-6 z-[3] flex flex-col gap-3 sm:left-12">
          <span className="mono text-cinza">Área do cliente</span>
          <span className="disp cromo-claro text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.9]">
            Sua
            <br />
            conta
          </span>
        </div>
        <div className="metal absolute top-32 -right-10 z-[3] hidden w-60 flex-col gap-2.5 rounded-[2px] px-5 py-4 md:flex" aria-hidden="true">
          <span className="mono text-[0.6rem] text-[#5a5450]">{loja.nome.toLowerCase()} / login.exe</span>
          <span className="text-[1.9rem] leading-none font-light text-tinta">
            (acesso)<sup className="text-sm text-vinho">2</sup>
          </span>
        </div>
      </div>

      <div className="grade relative flex items-center justify-center bg-nevoa px-3 pt-10 pb-16 sm:px-6 md:pt-28">
        <span className="vidro absolute top-36 right-14 hidden h-20 w-44 rounded-[50%] md:block" aria-hidden="true" />
        <span className="vidro absolute bottom-28 left-16 hidden h-12 w-28 rounded-[50%] md:block" aria-hidden="true" />
        <FormularioConta />
      </div>
    </div>
  );
}
