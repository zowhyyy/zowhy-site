"use client";

import { useCallback, useEffect, useState } from "react";

type Msg = { ok?: string; erro?: string } | null;

/** Mensagem flutuante de "salvo" / erro do painel. Some sozinha depois de alguns segundos. */
export function useAviso() {
  const [msg, setMsg] = useState<Msg>(null);
  useEffect(() => {
    if (!msg) return;
    const t = window.setTimeout(() => setMsg(null), msg.erro ? 6000 : 3000);
    return () => window.clearTimeout(t);
  }, [msg]);
  return [msg, useCallback((m: Msg) => setMsg(m), [])] as const;
}

export function Aviso({ msg }: { msg: Msg }) {
  if (!msg) return null;
  return (
    <p
      role={msg.erro ? "alert" : "status"}
      className={`entrar fixed bottom-5 left-1/2 z-[150] -translate-x-1/2 rounded-full px-5 py-3 text-sm font-medium shadow-[0_20px_40px_-20px_rgb(37_32_29/0.6)] ${
        msg.erro ? "bg-vinho text-white" : "bg-grafite text-white"
      }`}
    >
      {msg.erro ?? `✓ ${msg.ok}`}
    </p>
  );
}
