"use client";

import { useState, useTransition } from "react";
import { salvarAviso } from "@/app/admin/acoes";
import type { AvisoLoja } from "@/lib/tipos";
import { Aviso, useAviso } from "./Aviso";

/** Abre e fecha a loja e edita o texto do aviso que os clientes veem quando ela está fechada. */
export function PainelLoja({ aviso: inicial }: { aviso: AvisoLoja }) {
  const [aviso, setAviso] = useState(inicial);
  const [salvando, iniciar] = useTransition();
  const [msg, mostrar] = useAviso();

  const gravar = (novo: AvisoLoja, texto: string) =>
    iniciar(async () => {
      const r = await salvarAviso(novo);
      if (r.erro) mostrar({ erro: r.erro });
      else {
        setAviso(novo);
        mostrar({ ok: texto });
      }
    });

  return (
    <section className={`mt-8 overflow-hidden rounded-[26px] ${aviso.fechada ? "bg-vinho text-white" : "vidro"}`}>
      <div className="flex flex-wrap items-center justify-between gap-5 p-6">
        <div className="flex items-center gap-4">
          <span className={`relative grid h-12 w-12 place-items-center rounded-full ${aviso.fechada ? "bg-white/15" : "bg-[#e6f2ea]"}`} aria-hidden="true">
            <span className={`h-3 w-3 animate-pulse rounded-full ${aviso.fechada ? "bg-white" : "bg-[#2f8a4f]"}`} />
          </span>
          <div>
            <p className={`mono text-[0.6rem] ${aviso.fechada ? "text-white/70" : "text-suave"}`}>Situação da loja</p>
            <p className="disp mt-1 text-[1.4rem]">{aviso.fechada ? "Fechada" : "Aberta"}</p>
          </div>
        </div>
        <button
          type="button"
          disabled={salvando}
          onClick={() =>
            gravar({ ...aviso, fechada: !aviso.fechada }, aviso.fechada ? "Loja aberta: os clientes já veem o site." : "Loja fechada: os clientes veem o aviso.")
          }
          className={`btn ${aviso.fechada ? "bg-white text-vinho shadow-none hover:bg-grafite hover:text-white" : "btn-cheio"}`}
        >
          {salvando ? "Salvando…" : aviso.fechada ? "Abrir a loja" : "Fechar a loja"}
        </button>
      </div>

      <details className={`border-t ${aviso.fechada ? "border-white/15" : "border-grafite/10"}`}>
        <summary className="mono flex min-h-12 items-center px-6 text-[0.62rem]">Editar o aviso de loja fechada ▾</summary>
        <form
          className="grid gap-4 px-6 pb-6"
          onSubmit={(e) => {
            e.preventDefault();
            gravar(aviso, "Aviso salvo.");
          }}
        >
          <label className={`rotulo-campo ${aviso.fechada ? "text-white/80" : ""}`}>
            Título
            <input className="campo" value={aviso.titulo} maxLength={90} onChange={(e) => setAviso({ ...aviso, titulo: e.target.value })} />
          </label>
          <label className={`rotulo-campo ${aviso.fechada ? "text-white/80" : ""}`}>
            Mensagem
            <textarea
              className="campo min-h-24 py-3"
              value={aviso.mensagem}
              maxLength={400}
              onChange={(e) => setAviso({ ...aviso, mensagem: e.target.value })}
            />
          </label>
          <button type="submit" className="btn self-start bg-white" disabled={salvando}>
            Salvar aviso
          </button>
        </form>
      </details>
      <Aviso msg={msg} />
    </section>
  );
}
