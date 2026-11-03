import Link from "next/link";
import { notFound } from "next/navigation";
import { FormularioPecaAdm } from "@/components/admin/FormularioPecaAdm";
import { lerDados } from "@/lib/armazem";
import { buscarPeca } from "@/lib/catalogo";
import { exigirAdmNaPagina } from "@/lib/sessao";

export default async function EditarPeca({ params }: { params: Promise<{ slug: string }> }) {
  await exigirAdmNaPagina();
  const { produtos, drops } = await lerDados();
  const peca = buscarPeca(produtos, (await params).slug);
  if (!peca) notFound();
  return (
    <div className="pt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/pecas" className="mono text-suave hover:text-vinho">
          ← Peças
        </Link>
        <Link href={`/peca/${peca.slug}`} target="_blank" className="mono text-vinho hover:opacity-70">
          Ver no site ↗
        </Link>
      </div>
      <h1 className="titulo mt-3 text-[clamp(2.4rem,6vw,3.8rem)]">{peca.nome}</h1>
      <FormularioPecaAdm key={peca.slug} peca={peca} drops={drops} />
    </div>
  );
}
