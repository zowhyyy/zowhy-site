import type { MetadataRoute } from "next";
import { lerDados } from "@/lib/armazem";
import { urlSite } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { produtos } = await lerDados();
  const paginas = ["", "/loja", "/drops", "/lookbook", "/sobre", "/como-comprar"];
  return [...paginas.map((p) => ({ url: `${urlSite}${p}` })), ...produtos.map((p) => ({ url: `${urlSite}/peca/${p.slug}` }))];
}
