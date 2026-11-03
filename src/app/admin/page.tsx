import Link from "next/link";
import { PainelLoja } from "@/components/admin/PainelLoja";
import { lerDados } from "@/lib/armazem";
import { dropAtual, numeroDrop } from "@/lib/catalogo";
import { exigirAdmNaPagina } from "@/lib/sessao";

export default async function VisaoGeral() {
  await exigirAdmNaPagina();
  const { produtos, drops, lookbook, aviso } = await lerDados();
  const drop = dropAtual(drops);
  const contar = (s: string) => produtos.filter((p) => p.situacao === s).length;
  const numeros = [
    ["À venda", contar("disponivel")],
    ["Reservadas", contar("reservada")],
    ["Vendidas", contar("vendida")],
    ["Fotos no lookbook", lookbook.length],
  ] as const;

  return (
    <div className="pt-10">
      <p className="mono entrar text-suave">Painel / visão geral</p>
      <h1 className="mt-3">
        <span className="disp text-[clamp(2rem,6vw,3.4rem)]">Olá, </span>
        <span className="titulo text-[clamp(2.8rem,8vw,4.6rem)] text-vinho">zowhy</span>
      </h1>

      <PainelLoja aviso={aviso} />

      <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {numeros.map(([rotulo, n]) => (
          <div key={rotulo} className="metal flex flex-col gap-2 rounded-[2px] px-5 py-4">
            <dt className="mono text-[0.58rem] text-[#5a5450]">{rotulo}</dt>
            <dd className="text-[2.4rem] leading-none font-light text-tinta">{n}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {[
          ["/admin/pecas/nova", "Adicionar peça", "Fotos, preço, medidas, descrição."],
          ["/admin/drops", "Lançar um drop", drop ? `Drop atual: ${numeroDrop(drop.numero)}, ${drop.nome}.` : "Nenhum drop ainda."],
          ["/admin/lookbook", "Editar o lookbook", "Enviar fotos e escolher as peças de cada look."],
        ].map(([href, titulo, texto]) => (
          <Link
            key={href}
            href={href}
            className="vidro group flex flex-col gap-2 rounded-[22px] p-5 transition-transform duration-500 hover:-translate-y-1"
          >
            <span className="flex items-center justify-between">
              <span className="disp text-[1.05rem]">{titulo}</span>
              <span className="text-vinho transition-transform group-hover:translate-x-1">→</span>
            </span>
            <span className="text-sm text-suave">{texto}</span>
          </Link>
        ))}
      </div>

      <section className="vidro mt-6 rounded-[22px] p-5 text-sm leading-relaxed text-suave">
        <h2 className="mono text-grafite">Roteiro para lançar um drop</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5">
          <li>Feche a loja aqui em cima. Os clientes passam a ver o aviso; você continua vendo o site.</li>
          <li>Em Drops, crie o drop novo (o de maior número vira o drop atual da página inicial).</li>
          <li>Em Peças, adicione as peças novas escolhendo esse drop.</li>
          <li>Confira tudo em &quot;Ver site&quot; e abra a loja de novo.</li>
        </ol>
      </section>
    </div>
  );
}
