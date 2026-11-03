import Link from "next/link";
import { EditorLookbook } from "@/components/admin/EditorLookbook";
import { lerDados } from "@/lib/armazem";
import { ordenarPecas } from "@/lib/catalogo";
import { exigirAdmNaPagina } from "@/lib/sessao";

export default async function LookbookAdm() {
  await exigirAdmNaPagina();
  const { lookbook, produtos, drops } = await lerDados();
  return (
    <div className="pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mono text-suave">Painel / lookbook</p>
          <h1 className="disp mt-3 text-[clamp(2rem,6vw,3.4rem)]">Lookbook</h1>
          <p className="mt-2 max-w-xl text-suave">Cada foto vira uma página do livro em /lookbook. Escolha as peças que aparecem em cada foto para o cliente achar e comprar.</p>
        </div>
        <Link href="/lookbook" target="_blank" className="link">
          Ver o lookbook ↗
        </Link>
      </div>
      <EditorLookbook
        paginas={lookbook}
        pecas={ordenarPecas(produtos, drops).map((p) => ({ slug: p.slug, nome: p.nome, marca: p.marca, vendida: p.situacao === "vendida" }))}
      />
    </div>
  );
}
