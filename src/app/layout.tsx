import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Syncopate } from "next/font/google";
import { BalaoInstagram } from "@/components/BalaoInstagram";
import { BarraAvisos } from "@/components/BarraAvisos";
import { BarraRolagem } from "@/components/BarraRolagem";
import { Cabecalho } from "@/components/Cabecalho";
import { CatalogoProvider } from "@/components/CatalogoProvider";
import { Efeitos } from "@/components/Efeitos";
import { FaixaAdm } from "@/components/FaixaAdm";
import { GavetaSacola } from "@/components/GavetaSacola";
import { LojaFechada } from "@/components/LojaFechada";
import { MolduraSite } from "@/components/MolduraSite";
import { PopupCadastro } from "@/components/PopupCadastro";
import { Rodape } from "@/components/Rodape";
import { SacolaProvider } from "@/components/SacolaProvider";
import { Transicao } from "@/components/Transicao";
import { loja } from "@/data/config-loja";
import { lerDados } from "@/lib/armazem";
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
  title: { default: `${loja.nome} · brechó online`, template: `%s · ${loja.nome}` },
  description: "Brechó online com peças únicas: vintage, grife e básicos. Novidades em drops.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

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
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js='1'" }} />
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
        <BarraRolagem />
        <Efeitos />
      </body>
    </html>
  );
}
