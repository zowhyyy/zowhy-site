import Link from "next/link";
import { FormularioPecaAdm } from "@/components/admin/FormularioPecaAdm";
import { lerDados } from "@/lib/armazem";
import { exigirAdmNaPagina } from "@/lib/sessao";

export default async function NovaPeca() {
  await exigirAdmNaPagina();
  const { drops } = await lerDados();
  return (
    <div className="pt-10">
      <Link href="/admin/pecas" className="mono text-suave hover:text-vinho">
        ← Peças
      </Link>
      <h1 className="mt-3">
        <span className="disp text-[clamp(1.8rem,5vw,3rem)]">Nova </span>
        <span className="titulo text-[clamp(2.6rem,7vw,4.2rem)] text-vinho">peça</span>
      </h1>
      <FormularioPecaAdm peca={null} drops={drops} />
    </div>
  );
}
