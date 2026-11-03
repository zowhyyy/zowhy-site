"use client";

import { useRef, useState } from "react";

/** Botão que envia uma ou mais fotos para o servidor e devolve os caminhos delas. */
export function EnviarFotos({
  aoEnviar,
  aoErrar,
  multiplas = true,
  rotulo = "+ Enviar fotos",
  className = "btn",
}: {
  aoEnviar: (caminhos: string[]) => void;
  aoErrar: (erro: string) => void;
  multiplas?: boolean;
  rotulo?: string;
  className?: string;
}) {
  const campo = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(arquivos: FileList | null) {
    if (!arquivos?.length) return;
    setEnviando(true);
    try {
      const form = new FormData();
      for (const a of Array.from(arquivos)) form.append("fotos", a);
      const resp = await fetch("/api/admin/fotos", { method: "POST", body: form });
      const json = (await resp.json().catch(() => ({}))) as { caminhos?: string[]; erro?: string };
      if (!resp.ok || !json.caminhos) aoErrar(json.erro ?? "Não deu para enviar as fotos.");
      else aoEnviar(json.caminhos);
    } catch {
      aoErrar("Sem conexão com o servidor. Tente de novo.");
    } finally {
      setEnviando(false);
      if (campo.current) campo.current.value = "";
    }
  }

  return (
    <>
      <input
        ref={campo}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple={multiplas}
        hidden
        onChange={(e) => enviar(e.target.files)}
      />
      <button type="button" className={className} disabled={enviando} onClick={() => campo.current?.click()}>
        {enviando ? "Enviando…" : rotulo}
      </button>
    </>
  );
}
