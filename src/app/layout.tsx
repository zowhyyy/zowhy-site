import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Syncopate } from "next/font/google";
import { AvisoCookies } from "@/components/AvisoCookies";
import { BalaoInstagram } from "@/components/BalaoInstagram";
import { BarraAvisos } from "@/components/BarraAvisos";
import { BarraRolagem } from "@/components/BarraRolagem";
import { Cabecalho } from "@/components/Cabecalho";
import { CatalogoProvider } from "@/components/CatalogoProvider";
import { CursorVidro } from "@/components/CursorVidro";
import { Efeitos } from "@/components/Efeitos";
import { FaixaAdm } from "@/components/FaixaAdm";
import { GavetaSacola } from "@/components/GavetaSacola";
import { LojaFechada } from "@/components/LojaFechada";
import { ModoLeve } from "@/components/ModoLeve";
import { MolduraSite } from "@/components/MolduraSite";
import { PopupCadastro } from "@/components/PopupCadastro";
import { Rodape } from "@/components/Rodape";
import { SacolaProvider } from "@/components/SacolaProvider";
import { Transicao } from "@/components/Transicao";
import { loja } from "@/data/config-loja";
import { lerDados } from "@/lib/armazem";
import { urlSite } from "@/lib/site";
import { ehAdm } from "@/lib/sessao";
import "./globals.css";

// Peças, preços e o aviso de loja fechada mudam pelo painel: o site sempre lê a versão atual.
export const dynamic = "force-dynamic";

// Fontes do site. Para trocar, importe outra de "next/font/google" e mantenha a variable.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const syncopate = Syncopate({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-syncopate", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(urlSite),
  title: { default: `${loja.nome} · brechó online`, template: `%s · ${loja.nome}` },
  description: "Brechó online com peças únicas: vintage, grife e básicos. Novidades em drops.",
  openGraph: { siteName: loja.nome, locale: "pt_BR", type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

/**
 * Roda antes de desenhar a página: marca que há JavaScript e já liga o modo leve em aparelho
 * muito fraco, com economia de dados ou que já ficou lento nesta visita (ver ModoLeve.tsx).
 */
const marcarAparelho = `(function(){var h=document.documentElement,n=navigator,l=false;h.dataset.js='1';try{l=sessionStorage.getItem('zowhy-leve')==='1'}catch(e){}if(l||(n.hardwareConcurrency||8)<=2||(n.deviceMemory||8)<=2||(n.connection&&n.connection.saveData))h.dataset.leve='1'})()`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [dados, adm] = await Promise.all([lerDados(), ehAdm()]);

  return (
    // suppressHydrationWarning: o script abaixo marca data-js no <html> antes do React carregar
    <html
      lang="pt-BR"
      className={`${geist.variable} ${geistMono.variable} ${syncopate.variable} ${instrument.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: marcarAparelho }} />
      </head>
      <body className="flex min-h-dvh flex-col overflow-x-clip antialiased">
        <CatalogoProvider produtos={dados.produtos} drops={dados.drops}>
          <SacolaProvider>
            {/* Loja fechada: o cliente vê só o aviso. A ADM logada continua vendo o site normal. */}
            <MolduraSite
              fechada={dados.aviso.fechada && !adm}
              avisoFechado={<LojaFechada aviso={dados.aviso} />}
              topo={
                <>
                  {adm && <FaixaAdm fechada={dados.aviso.fechada} />}
                  <BarraAvisos />
                  <Cabecalho />
                </>
              }
              rodape={
                <>
                  <Rodape />
                  <BalaoInstagram />
                  <GavetaSacola />
                  <PopupCadastro />
                  <Transicao />
                </>
              }
            >
              {children}
            </MolduraSite>
          </SacolaProvider>
        </CatalogoProvider>
        <AvisoCookies />
        <ModoLeve />
        <BarraRolagem />
        <Efeitos />
        {loja.cursor === "vidro" && <CursorVidro />}
      </body>
    </html>
  );
}
