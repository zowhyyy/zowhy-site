import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

/**
 * Gera um ícone do site em PNG a partir de um SVG de public/.
 * icone.svg: a máscara com contorno branco fino (aba do navegador, fundo transparente).
 * icone-app.svg: a máscara num quadrado branco (tela inicial do celular, que não aceita transparência).
 */
export async function iconeMarca(lado: number, arquivo = "icone.svg") {
  const svg = await readFile(path.join(process.cwd(), "public", arquivo));
  return new ImageResponse(
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`data:image/svg+xml;base64,${svg.toString("base64")}`} width={lado} height={lado} alt="" />,
    { width: lado, height: lado },
  );
}
