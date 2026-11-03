"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { apagarPeca, mudarSituacao } from "@/app/admin/acoes";
import { numeroDrop } from "@/lib/catalogo";
import { formatarPreco } from "@/lib/precos";
import { rotuloSituacao } from "@/lib/rotulos";
import type { Drop, Produto, Situacao } from "@/lib/tipos";
import { normalizar } from "../Busca";
import { FotoPeca } from "../FotoPeca";
import { Aviso, useAviso } from "./Aviso";

const corSituacao: Record<Situacao, string> = {
  disponivel: "bg-[#e6f2ea] text-[#22663b]",
  reservada: "bg-[#fbf0dc] text-[#8a5a12]",
  vendida: "bg-cinza text-suave",
};

export function ListaPecasAdm({ produtos, drops }: { produtos: Produto[]; drops: Drop[] }) {
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const [drop, setDrop] = useState("");
  const [ocupado, iniciar] = useTransition();
  const [msg, mostrar] = useAviso();

  const lista = useMemo(
    () =>
      produtos.filter(
        (p) => (!drop || p.drop === drop) && (!busca.trim() || normalizar(`${p.nome} ${p.marca} ${p.tamanho}`).includes(normalizar(busca.trim()))),
      ),
    [produtos, busca, drop],
  );

  const rotuloDrop = (slug: string) => {
    const d = drops.find((x) => x.slug === slug);
    return d ? `Drop ${numeroDrop(d.numero)}` : "Sem drop";
  };

  const agir = (acao: () => Promise<{ erro?: string }>, ok: string) =>
    iniciar(async () => {
      const r = await acao();
      if (r.erro) mostrar({ erro: r.erro });
      else {
        mostrar({ ok });
        router.refresh();
      }
    });

  return (
    <>
      <div className="vidro mt-8 flex flex-wrap items-center gap-3 rounded-[20px] p-3">
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, marca ou tamanho"
          aria-label="Buscar peças"
          className="campo mt-0 min-w-0 flex-1 basis-60"
        />
        <select value={drop} onChange={(e) => setDrop(e.target.value)} aria-label="Filtrar por drop" className="campo mt-0 w-auto">
          <option value="">Todos os drops</option>
          {[...drops]
            .sort((a, b) => b.numero - a.numero)
            .map((d) => (
              <option key={d.slug} value={d.slug}>
                Drop {numeroDrop(d.numero)} · {d.nome}
              </option>
            ))}
        </select>
        <span className="mono px-2 text-suave">{lista.length} peças</span>
      </div>

      <ul className={`mt-4 flex flex-col gap-2 transition-opacity ${ocupado ? "opacity-60" : ""}`}>
        {lista.map((p) => (
          <li key={p.slug} className="vidro flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[20px] p-2.5 pr-4">
            <span className={`relative block h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-nevoa ${p.situacao === "vendida" ? "grayscale" : ""}`}>
              <FotoPeca produto={p} sizes="56px" />
            </span>
            <div className="min-w-0 flex-1 basis-40">
              <p className="mono text-[0.58rem] text-suave">
                {p.marca} · {rotuloDrop(p.drop)} · tam. {p.tamanho}
              </p>
              <Link href={`/admin/pecas/${p.slug}`} className="mt-1 block truncate font-medium transition-colors hover:text-vinho">
                {p.nome}
              </Link>
            </div>
            <span className="preco w-24 text-right">{formatarPreco(p.preco)}</span>
            <select
              value={p.situacao}
              aria-label={`Situação de ${p.nome}`}
              disabled={ocupado}
              onChange={(e) => agir(() => mudarSituacao(p.slug, e.target.value as Situacao), `${p.nome}: ${rotuloSituacao[e.target.value as Situacao].toLowerCase()}.`)}
              className={`h-9 rounded-full border-0 px-3 text-[0.8rem] font-semibold ${corSituacao[p.situacao]}`}
            >
              {(Object.keys(rotuloSituacao) as Situacao[]).map((s) => (
                <option key={s} value={s}>
                  {rotuloSituacao[s]}
                </option>
              ))}
            </select>
            <div className="flex gap-1">
              <Link href={`/admin/pecas/${p.slug}`} className="mono rounded-full px-3 py-2 text-[0.6rem] hover:bg-grafite hover:text-white">
                Editar
              </Link>
              <Link href={`/peca/${p.slug}`} target="_blank" className="mono rounded-full px-3 py-2 text-[0.6rem] hover:bg-grafite hover:text-white">
                Ver ↗
              </Link>
              <button
                type="button"
                disabled={ocupado}
                onClick={() => {
                  if (window.confirm(`Apagar "${p.nome}" de vez? Isso não pode ser desfeito.\n\nSe ela só foi vendida, prefira mudar a situação para "Vendida".`)) {
                    agir(() => apagarPeca(p.slug), "Peça apagada.");
                  }
                }}
                className="mono rounded-full px-3 py-2 text-[0.6rem] text-vinho hover:bg-vinho hover:text-white"
              >
                Apagar
              </button>
            </div>
          </li>
        ))}
        {lista.length === 0 && <li className="vidro rounded-[20px] p-8 text-center text-suave">Nenhuma peça encontrada.</li>}
      </ul>
      <Aviso msg={msg} />
    </>
  );
}
