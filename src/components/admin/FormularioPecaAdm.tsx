"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { salvarPeca } from "@/app/admin/acoes";
import { numeroDrop } from "@/lib/catalogo";
import { rotuloCategoria, rotuloEstado, rotuloEstilo, rotuloSecao, rotuloSituacao } from "@/lib/rotulos";
import type { Drop, Medida, Produto } from "@/lib/tipos";
import { Aviso, useAviso } from "./Aviso";
import { EnviarFotos } from "./EnviarFotos";

/** Medidas sugeridas para cada tipo de peça, para não ter que digitar o nome toda vez. */
const medidasSugeridas: Record<string, string[]> = {
  camiseta: ["Busto", "Comprimento"],
  camisa: ["Busto", "Ombro a ombro", "Comprimento", "Manga"],
  moletom: ["Busto", "Comprimento", "Manga"],
  jaqueta: ["Busto", "Ombro a ombro", "Comprimento", "Manga"],
  calca: ["Cintura", "Quadril", "Gancho", "Comprimento"],
  bermuda: ["Cintura", "Comprimento"],
  saia: ["Cintura", "Comprimento"],
  vestido: ["Busto", "Cintura", "Comprimento"],
  tenis: ["Palmilha"],
  acessorio: ["Largura", "Altura"],
};

type Rascunho = Omit<Produto, "preco" | "precoOriginal" | "medidas"> & {
  preco: string;
  precoOriginal: string;
  medidas: { nome: string; cm: string }[];
};

function paraRascunho(p: Produto | null, drops: Drop[]): Rascunho {
  const dropMaisNovo = [...drops].sort((a, b) => b.numero - a.numero)[0]?.slug ?? "";
  if (!p) {
    return {
      slug: "",
      nome: "",
      marca: "",
      preco: "",
      precoOriginal: "",
      tamanho: "",
      medidas: medidasSugeridas.camiseta.map((nome) => ({ nome, cm: "" })),
      estado: "excelente",
      observacaoEstado: "",
      descricao: "",
      categoria: "camiseta",
      secao: "unissex",
      estilo: "vintage",
      drop: dropMaisNovo,
      situacao: "disponivel",
      fotos: [],
      cor: "",
      composicao: "",
    };
  }
  return {
    ...p,
    preco: String(p.preco),
    precoOriginal: p.precoOriginal ? String(p.precoOriginal) : "",
    medidas: p.medidas.map((m: Medida) => ({ nome: m.nome, cm: String(m.cm) })),
  };
}

const num = (v: string) => Number(v.replace(",", "."));

export function FormularioPecaAdm({ peca, drops }: { peca: Produto | null; drops: Drop[] }) {
  const router = useRouter();
  const [r, setR] = useState(() => paraRascunho(peca, drops));
  const [salvando, iniciar] = useTransition();
  const [msg, mostrar] = useAviso();
  const mudar = <K extends keyof Rascunho>(k: K, v: Rascunho[K]) => setR((x) => ({ ...x, [k]: v }));

  const moverFoto = (i: number, d: -1 | 1) =>
    setR((x) => {
      const fotos = [...x.fotos];
      const j = i + d;
      if (j < 0 || j >= fotos.length) return x;
      [fotos[i], fotos[j]] = [fotos[j], fotos[i]];
      return { ...x, fotos };
    });

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    iniciar(async () => {
      const res = await salvarPeca(
        {
          ...r,
          preco: num(r.preco),
          precoOriginal: r.precoOriginal ? num(r.precoOriginal) : undefined,
          medidas: r.medidas.map((m) => ({ nome: m.nome, cm: num(m.cm) })),
        },
        peca?.slug ?? null,
      );
      if (res.erro) mostrar({ erro: res.erro });
      else {
        mostrar({ ok: peca ? "Peça salva." : "Peça criada." });
        if (!peca) router.replace(`/admin/pecas/${res.slug}`);
        router.refresh();
      }
    });
  }

  const select = <T extends string>(k: keyof Rascunho, rotulo: string, opcoes: Record<T, string>) => (
    <label className="rotulo-campo">
      {rotulo}
      <select className="campo" value={r[k] as string} onChange={(e) => mudar(k, e.target.value as never)}>
        {(Object.keys(opcoes) as T[]).map((o) => (
          <option key={o} value={o}>
            {opcoes[o]}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <form onSubmit={salvar} className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-4">
        {/* Fotos */}
        <section className="vidro rounded-[22px] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="mono">Fotos</h2>
            <EnviarFotos
              aoEnviar={(c) => mudar("fotos", [...r.fotos, ...c].slice(0, 12))}
              aoErrar={(erro) => mostrar({ erro })}
              className="btn min-h-10 px-4"
            />
          </div>
          <p className="mt-1 text-sm text-suave">A primeira é a capa. Use as setas para mudar a ordem. Até 12 fotos.</p>
          {r.fotos.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-[#d6d1cc] p-8 text-center text-sm text-suave">
              Sem fotos ainda: o site mostra um desenho provisório da peça.
            </p>
          ) : (
            <ul className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {r.fotos.map((f, i) => (
                <li key={f} className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-nevoa">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
                  {i === 0 && <span className="mono absolute top-1.5 left-1.5 rounded-full bg-vinho px-2 py-0.5 text-[0.5rem] text-white">capa</span>}
                  <span className="absolute inset-x-1.5 bottom-1.5 flex justify-between gap-1">
                    <span className="flex gap-1">
                      <button type="button" aria-label="Mover para a esquerda" onClick={() => moverFoto(i, -1)} className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-xs hover:bg-grafite hover:text-white">
                        ←
                      </button>
                      <button type="button" aria-label="Mover para a direita" onClick={() => moverFoto(i, 1)} className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-xs hover:bg-grafite hover:text-white">
                        →
                      </button>
                    </span>
                    <button
                      type="button"
                      aria-label="Tirar foto"
                      onClick={() => mudar("fotos", r.fotos.filter((x) => x !== f))}
                      className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-xs text-vinho hover:bg-vinho hover:text-white"
                    >
                      ✕
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Texto */}
        <section className="vidro grid gap-4 rounded-[22px] p-5 sm:grid-cols-2">
          <h2 className="mono sm:col-span-2">Sobre a peça</h2>
          <label className="rotulo-campo sm:col-span-2">
            Nome da peça
            <input className="campo" required maxLength={120} value={r.nome} onChange={(e) => mudar("nome", e.target.value)} placeholder="Ex.: Jaqueta jeans trucker anos 90" />
          </label>
          <label className="rotulo-campo">
            Marca
            <input className="campo" maxLength={80} value={r.marca} onChange={(e) => mudar("marca", e.target.value)} placeholder="Ex.: Levi's (ou deixe vazio)" />
          </label>
          <label className="rotulo-campo">
            Cor
            <input className="campo" maxLength={60} value={r.cor ?? ""} onChange={(e) => mudar("cor", e.target.value)} />
          </label>
          <label className="rotulo-campo sm:col-span-2">
            Descrição
            <textarea
              className="campo min-h-36 py-3 leading-relaxed"
              value={r.descricao}
              onChange={(e) => mudar("descricao", e.target.value)}
              placeholder="Conte como é a peça. Deixe uma linha em branco para separar parágrafos."
            />
          </label>
          <label className="rotulo-campo sm:col-span-2">
            Composição
            <input className="campo" maxLength={120} value={r.composicao ?? ""} onChange={(e) => mudar("composicao", e.target.value)} placeholder="Ex.: 100% algodão" />
          </label>
        </section>

        {/* Medidas */}
        <section className="vidro rounded-[22px] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="mono">Medidas (cm)</h2>
            <button
              type="button"
              className="mono rounded-full px-3 py-2 text-[0.6rem] hover:bg-grafite hover:text-white"
              onClick={() => mudar("medidas", (medidasSugeridas[r.categoria] ?? []).map((nome) => ({ nome, cm: "" })))}
            >
              Usar medidas sugeridas
            </button>
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {r.medidas.map((m, i) => (
              <li key={i} className="flex items-center gap-2">
                <input
                  className="campo mt-0 flex-1"
                  aria-label="Nome da medida"
                  value={m.nome}
                  onChange={(e) => mudar("medidas", r.medidas.map((x, j) => (j === i ? { ...x, nome: e.target.value } : x)))}
                />
                <input
                  className="campo mt-0 w-24"
                  aria-label={`${m.nome} em cm`}
                  inputMode="decimal"
                  value={m.cm}
                  onChange={(e) => mudar("medidas", r.medidas.map((x, j) => (j === i ? { ...x, cm: e.target.value } : x)))}
                />
                <button
                  type="button"
                  aria-label="Tirar medida"
                  onClick={() => mudar("medidas", r.medidas.filter((_, j) => j !== i))}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-vinho hover:bg-vinho hover:text-white"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="link mt-3 text-sm" onClick={() => mudar("medidas", [...r.medidas, { nome: "", cm: "" }])}>
            + Adicionar medida
          </button>
        </section>
      </div>

      <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
        <section className="vidro grid grid-cols-2 gap-4 rounded-[22px] p-5">
          <h2 className="mono col-span-2">Preço e situação</h2>
          <label className="rotulo-campo">
            Preço (R$)
            <input className="campo" required inputMode="decimal" value={r.preco} onChange={(e) => mudar("preco", e.target.value)} placeholder="189,90" />
          </label>
          <label className="rotulo-campo">
            Preço da nova (R$)
            <input className="campo" inputMode="decimal" value={r.precoOriginal} onChange={(e) => mudar("precoOriginal", e.target.value)} placeholder="Opcional" />
          </label>
          <div className="col-span-2">{select("situacao", "Situação", rotuloSituacao)}</div>
          <label className="rotulo-campo col-span-2">
            Drop
            <select className="campo" value={r.drop} onChange={(e) => mudar("drop", e.target.value)}>
              {[...drops]
                .sort((a, b) => b.numero - a.numero)
                .map((d) => (
                  <option key={d.slug} value={d.slug}>
                    Drop {numeroDrop(d.numero)} · {d.nome}
                  </option>
                ))}
            </select>
          </label>
        </section>

        <section className="vidro grid grid-cols-2 gap-4 rounded-[22px] p-5">
          <h2 className="mono col-span-2">Classificação</h2>
          {select("categoria", "Peça", rotuloCategoria)}
          <label className="rotulo-campo">
            Tamanho
            <input className="campo" required maxLength={20} value={r.tamanho} onChange={(e) => mudar("tamanho", e.target.value)} placeholder="P, M, 38…" />
          </label>
          {select("secao", "Seção", rotuloSecao)}
          {select("estilo", "Estilo", rotuloEstilo)}
          <div className="col-span-2">{select("estado", "Estado", rotuloEstado)}</div>
          <label className="rotulo-campo col-span-2">
            Detalhe do estado
            <input
              className="campo"
              maxLength={400}
              value={r.observacaoEstado ?? ""}
              onChange={(e) => mudar("observacaoEstado", e.target.value)}
              placeholder="Ex.: leve desbotado nos punhos (opcional)"
            />
          </label>
        </section>

        <button type="submit" className="btn btn-cheio w-full" disabled={salvando}>
          {salvando ? "Salvando…" : peca ? "Salvar alterações" : "Criar peça"}
        </button>
      </div>
      <Aviso msg={msg} />
    </form>
  );
}
