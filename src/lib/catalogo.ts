import type { Drop, Produto, Situacao } from "./tipos";

// Funções de consulta do catálogo. Recebem as listas (do armazém, no servidor,
// ou do useCatalogo(), no navegador) em vez de importar um arquivo fixo.

const pesoSituacao: Record<Situacao, number> = { disponivel: 0, reservada: 1, vendida: 2 };

/** Disponíveis primeiro, depois reservadas e vendidas por último; dentro de cada grupo, drop mais novo primeiro. */
export function ordenarPecas(lista: Produto[], drops: Drop[]) {
  const numero = (slug: string) => drops.find((d) => d.slug === slug)?.numero ?? 0;
  return [...lista].sort((a, b) => pesoSituacao[a.situacao] - pesoSituacao[b.situacao] || numero(b.drop) - numero(a.drop));
}

export function buscarPeca(produtos: Produto[], slug: string) {
  return produtos.find((p) => p.slug === slug);
}

export function buscarDrop(drops: Drop[], slug: string) {
  return drops.find((d) => d.slug === slug);
}

export function dropsOrdenados(drops: Drop[]) {
  return [...drops].sort((a, b) => b.numero - a.numero);
}

export function dropAtual(drops: Drop[]) {
  return dropsOrdenados(drops)[0] as Drop | undefined;
}

export function pecasDoDrop(produtos: Produto[], drops: Drop[], slug: string) {
  return ordenarPecas(
    produtos.filter((p) => p.drop === slug),
    drops,
  );
}

/** "03" */
export function numeroDrop(n: number) {
  return String(n).padStart(2, "0");
}

export function formatarData(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("pt-BR", { day: "numeric", month: "long", timeZone: "UTC" });
}

/** "Jaqueta Jeans 90's!" → "jaqueta-jeans-90-s" */
export function criarSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
