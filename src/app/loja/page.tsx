import type { Metadata } from "next";
import { Catalogo, type Filtros } from "@/components/Catalogo";
import { lerDados } from "@/lib/armazem";
import { ordenarPecas } from "@/lib/catalogo";

export const metadata: Metadata = { title: "Loja" };

type Params = Record<string, string | string[] | undefined>;

export default async function Loja({ searchParams }: { searchParams: Promise<Params> }) {
  const sp = await searchParams;
  const { produtos, drops } = await lerDados();
  const inicial: Filtros = {};
  for (const chave of ["secao", "categoria", "tamanho", "estilo", "faixa", "drop", "busca"] as const) {
    const v = sp[chave];
    if (typeof v === "string") inicial[chave] = v;
  }
  return <Catalogo key={JSON.stringify(inicial)} produtos={ordenarPecas(produtos, drops)} drops={drops} inicial={inicial} />;
}
