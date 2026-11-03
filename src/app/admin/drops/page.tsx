import { EditorDrops } from "@/components/admin/EditorDrops";
import { lerDados } from "@/lib/armazem";
import { exigirAdmNaPagina } from "@/lib/sessao";

export default async function DropsAdm() {
  await exigirAdmNaPagina();
  const { produtos, drops } = await lerDados();
  const contagem = Object.fromEntries(drops.map((d) => [d.slug, produtos.filter((p) => p.drop === d.slug).length]));
  return (
    <div className="pt-10">
      <p className="mono text-suave">Painel / drops</p>
      <h1 className="disp mt-3 text-[clamp(2rem,6vw,3.4rem)]">Drops</h1>
      <p className="mt-2 max-w-xl text-suave">O drop de maior número é o &quot;drop atual&quot;: aparece em destaque na página inicial e na faixa do topo.</p>
      <EditorDrops drops={[...drops].sort((a, b) => b.numero - a.numero)} contagem={contagem} />
    </div>
  );
}
