import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { drops as dropsIniciais } from "@/data/drops";
import { produtos as produtosIniciais } from "@/data/produtos";
import type { DadosLoja } from "./tipos";

// ─────────────────────────────────────────────────────────────────────────────
// ARMAZÉM DA LOJA (só roda no servidor)
// Peças, drops, lookbook e o aviso de loja fechada ficam em dados/loja.json,
// e as fotos enviadas pelo painel em dados/fotos/.
// Na primeira vez, o arquivo nasce com o conteúdo de src/data/produtos.ts e drops.ts.
//
// PARA QUEM FOR CUIDAR DO BACK-END: arquivo em disco funciona em servidor próprio
// (VPS, Railway, Render com disco). Em hospedagem sem disco permanente, como a Vercel,
// troque só lerDados() e salvarDados() por um banco de dados, e as fotos por um storage.
// O resto do site não precisa mudar.
// ─────────────────────────────────────────────────────────────────────────────

const PASTA = path.join(process.cwd(), "dados");
const ARQUIVO = path.join(PASTA, "loja.json");
export const PASTA_FOTOS = path.join(PASTA, "fotos");

function iniciais(): DadosLoja {
  return {
    produtos: produtosIniciais,
    drops: dropsIniciais,
    lookbook: [
      { id: "look-01", foto: "/lookbook/look-01.jpg", titulo: "Frio de garimpo", posicao: "35% 35%", pecas: [] },
      { id: "look-02", foto: "/lookbook/look-02.jpg", titulo: "Grife por preço de brechó", posicao: "25% 45%", pecas: [] },
      { id: "look-03", foto: "/lookbook/look-03.jpg", titulo: "Uma peça de cada", posicao: "25% 55%", pecas: [] },
    ],
    aviso: {
      fechada: false,
      titulo: "Estamos preparando o próximo drop",
      mensagem: "A loja está fechada enquanto as peças novas entram. Siga o Instagram para saber a hora em que ela abrir.",
    },
  };
}

async function lerDoDisco(): Promise<DadosLoja> {
  try {
    const salvo = JSON.parse(await fs.readFile(ARQUIVO, "utf8")) as Partial<DadosLoja>;
    return { ...iniciais(), ...salvo };
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return iniciais();
    throw e;
  }
}

/** Dados da loja. Lido uma vez por visita de página. */
export const lerDados = cache(lerDoDisco);

// Uma gravação por vez, para duas edições ao mesmo tempo não se atropelarem
let fila: Promise<unknown> = Promise.resolve();

/** Lê a versão mais nova, aplica a mudança e grava. */
export function alterarDados(mudar: (d: DadosLoja) => void): Promise<DadosLoja> {
  const tarefa = fila.then(async () => {
    const dados = await lerDoDisco();
    mudar(dados);
    await fs.mkdir(PASTA, { recursive: true });
    const temporario = `${ARQUIVO}.tmp`;
    await fs.writeFile(temporario, JSON.stringify(dados, null, 2), "utf8");
    await fs.rename(temporario, ARQUIVO);
    return dados;
  });
  fila = tarefa.catch(() => {});
  return tarefa;
}
