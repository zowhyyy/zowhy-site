"use client";

import { useActionState, useState } from "react";
import { entrar } from "@/app/admin/acoes";
import { IconeOlho } from "../Icones";

export function FormLoginAdm() {
  const [estado, enviar, enviando] = useActionState(entrar, null);
  const [verSenha, setVerSenha] = useState(false);
  return (
    <form action={enviar} className="mt-7 flex flex-col gap-4">
      <label className="rotulo-campo">
        E-mail
        <input name="email" type="email" required autoComplete="username" className="campo" />
      </label>
      <label className="rotulo-campo">
        Senha
        <span className="relative block">
          <input name="senha" type={verSenha ? "text" : "password"} required autoComplete="current-password" className="campo pr-12" />
          <button
            type="button"
            onClick={() => setVerSenha((v) => !v)}
            aria-label={verSenha ? "Esconder senha" : "Mostrar senha"}
            className="absolute top-1/2 right-2 mt-[0.2rem] grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-suave hover:text-vinho"
          >
            <IconeOlho className="h-5 w-5" />
          </button>
        </span>
      </label>
      {estado?.erro && (
        <p role="alert" className="sacudir rounded-xl bg-vinho-claro px-3.5 py-2.5 text-sm text-vinho">
          {estado.erro}
        </p>
      )}
      <button type="submit" className="btn btn-cheio mt-2" disabled={enviando}>
        {enviando ? "Entrando…" : "Entrar no painel"}
      </button>
    </form>
  );
}
