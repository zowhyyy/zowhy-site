import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { loja } from "@/data/config-loja";

export const alt = `${loja.nome}, brechó online de peças únicas`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const arquivo = (caminho: string) => readFile(path.join(process.cwd(), caminho));

/** Imagem que aparece quando o link do site é compartilhado (WhatsApp, Instagram e afins). Usa as fontes do site (src/fontes). */
export default async function ImagemCompartilhar() {
  const [logo, syncopate, instrument] = await Promise.all([
    arquivo("public/icone.svg"),
    arquivo("src/fontes/syncopate-700.woff"),
    arquivo("src/fontes/instrument-serif-italic.woff"),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 88,
        color: "#25201d",
        backgroundColor: "#ffffff",
        backgroundImage:
          "radial-gradient(circle at 92% 8%, rgba(130,36,52,0.55), rgba(130,36,52,0) 46%), radial-gradient(circle at 8% 100%, rgba(201,204,211,0.8), rgba(201,204,211,0) 42%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/svg+xml;base64,${logo.toString("base64")}`} width={150} height={150} alt="" />
        <div style={{ display: "flex", fontFamily: "Syncopate", fontSize: 92, letterSpacing: 4 }}>{loja.nome}</div>
      </div>
      <div style={{ display: "flex", marginTop: 44, fontFamily: "Instrument Serif", fontStyle: "italic", fontSize: 92, color: "#822434" }}>
        peças únicas, em drops
      </div>
      <div style={{ display: "flex", marginTop: 40, fontFamily: "Syncopate", fontSize: 22, letterSpacing: 3, color: "#6b635e" }}>
        BRECHÓ ONLINE · @{loja.instagram.toUpperCase()}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Syncopate", data: syncopate, weight: 700, style: "normal" },
        { name: "Instrument Serif", data: instrument, weight: 400, style: "italic" },
      ],
    },
  );
}
