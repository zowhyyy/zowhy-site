import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { PASTA_FOTOS } from "@/lib/armazem";
import { ehAdm } from "@/lib/sessao";

// Recebe fotos do painel de ADM e devolve o caminho de cada uma (/api/fotos/<nome>).
const extensoes: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };
const LIMITE_MB = 15;

export async function POST(req: Request) {
  if (!(await ehAdm())) return Response.json({ erro: "Sessão de ADM expirada. Entre de novo." }, { status: 401 });

  const form = await req.formData();
  const arquivos = form.getAll("fotos").filter((f): f is File => f instanceof File);
  if (arquivos.length === 0) return Response.json({ erro: "Nenhuma foto enviada." }, { status: 400 });

  await fs.mkdir(PASTA_FOTOS, { recursive: true });
  const caminhos: string[] = [];
  for (const arquivo of arquivos) {
    const ext = extensoes[arquivo.type];
    if (!ext) return Response.json({ erro: `"${arquivo.name}" não é JPG, PNG, WEBP ou AVIF.` }, { status: 400 });
    if (arquivo.size > LIMITE_MB * 1024 * 1024) {
      return Response.json({ erro: `"${arquivo.name}" passa de ${LIMITE_MB} MB.` }, { status: 400 });
    }
    const nome = `${Date.now().toString(36)}-${randomBytes(5).toString("hex")}.${ext}`;
    await fs.writeFile(path.join(PASTA_FOTOS, nome), Buffer.from(await arquivo.arrayBuffer()));
    caminhos.push(`/api/fotos/${nome}`);
  }
  return Response.json({ caminhos });
}
