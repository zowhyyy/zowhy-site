import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

/** Gera o ícone do site em PNG a partir da logo (public/logo.svg). */
export async function iconeMarca(lado: number) {
  const logo = await readFile(path.join(process.cwd(), "public/logo.svg"));
  return new ImageResponse(
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`data:image/svg+xml;base64,${logo.toString("base64")}`} width={lado} height={lado} alt="" />,
    { width: lado, height: lado },
  );
}
