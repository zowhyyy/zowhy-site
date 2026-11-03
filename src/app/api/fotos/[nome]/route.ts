import { promises as fs } from "node:fs";
import path from "node:path";
import { PASTA_FOTOS } from "@/lib/armazem";

// Entrega as fotos enviadas pelo painel de ADM (guardadas em dados/fotos/).
const tipos: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif" };

export async function GET(_req: Request, { params }: { params: Promise<{ nome: string }> }) {
  const { nome } = await params;
  const casa = /^[a-z0-9-]+\.(jpg|png|webp|avif)$/.exec(nome);
  if (!casa) return new Response("Não encontrada", { status: 404 });
  try {
    const arquivo = await fs.readFile(path.join(PASTA_FOTOS, nome));
    return new Response(new Uint8Array(arquivo), {
      headers: { "Content-Type": tipos[casa[1]], "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Não encontrada", { status: 404 });
  }
}
