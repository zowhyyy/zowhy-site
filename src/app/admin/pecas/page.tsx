import Link from "next/link";
import { ListaPecasAdm } from "@/components/admin/ListaPecasAdm";
import { lerDados } from "@/lib/armazem";
import { ordenarPecas } from "@/lib/catalogo";
import { exigirAdmNaPagina } from "@/lib/sessao";

export default async function PecasAdm() {
  await exigirAdmNaPagina();
  const { produtos, drops } = await lerDados();
  return (
    <div className="pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mono text-suave">Painel / peças</p>
          <h1 className="disp mt-3 text-[clamp(2rem,6vw,3.4rem)]">Peças</h1>
        </div>
        <Link href="/admin/pecas/nova" className="btn btn-cheio">
          + Nova peça
        </Link>
      </div>
      <ListaPecasAdm produtos={ordenarPecas(produtos, drops)} drops={drops} />
    </div>
  );
}
