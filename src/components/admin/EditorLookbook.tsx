"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { salvarLookbook } from "@/app/admin/acoes";
import type { PaginaLookbook } from "@/lib/tipos";
import { Aviso, useAviso } from "./Aviso";
import { EnviarFotos } from "./EnviarFotos";

type PecaResumo = { slug: string; nome: string; marca: string; vendida: boolean };

const novoId = () => `look-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export function EditorLookbook({ paginas: iniciais, pecas }: { paginas: PaginaLookbook[]; pecas: PecaResumo[] }) {
  const router = useRouter();
  const [paginas, setPaginas] = useState(iniciais);
  const [alterado, setAlterado] = useState(false);
  const [salvando, iniciar] = useTransition();
  const [msg, mostrar] = useAviso();

  // Avisa antes de sair da página com mudanças não salvas
  useEffect(() => {
    if (!alterado) return;
    const aviso = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", aviso);
    return () => window.removeEventListener("beforeunload", aviso);
  }, [alterado]);

  const mudar = (lista: PaginaLookbook[]) => {
    setPaginas(lista);
    setAlterado(true);
  };
  const editar = (i: number, parte: Partial<PaginaLookbook>) => mudar(paginas.map((p, j) => (j === i ? { ...p, ...parte } : p)));
  const mover = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= paginas.length) return;
    const lista = [...paginas];
    [lista[i], lista[j]] = [lista[j], lista[i]];
    mudar(lista);
  };

  const salvar = () =>
    iniciar(async () => {
      const r = await salvarLookbook(paginas);
      if (r.erro) mostrar({ erro: r.erro });
      else {
        setAlterado(false);
        mostrar({ ok: "Lookbook salvo." });
        router.refresh();
      }
    });

  return (
    <div className="mt-8 flex flex-col gap-4">
      <div className="vidro sticky top-[5.2rem] z-30 flex flex-wrap items-center gap-3 rounded-[20px] p-3 max-sm:top-[7.6rem]">
        <EnviarFotos
          rotulo="+ Adicionar fotos"
          aoEnviar={(c) => mudar([...paginas, ...c.map((foto) => ({ id: novoId(), foto, titulo: "", pecas: [] }))])}
          aoErrar={(erro) => mostrar({ erro })}
          className="btn min-h-10 px-4"
        />
        <span className="mono text-suave">{paginas.length} páginas</span>
        <button type="button" onClick={salvar} disabled={salvando || !alterado} className="btn btn-cheio ml-auto min-h-10 px-5">
          {salvando ? "Salvando…" : alterado ? "Salvar lookbook" : "Tudo salvo"}
        </button>
      </div>

      {paginas.length === 0 && <p className="vidro rounded-[22px] p-10 text-center text-suave">Nenhuma foto ainda. Adicione as fotos do lookbook.</p>}

      <ol className="flex flex-col gap-4">
        {paginas.map((p, i) => {
          const [x, y] = (p.posicao ?? "50% 50%").split(" ").map((v) => parseFloat(v));
          const disponiveis = pecas.filter((pc) => !p.pecas.includes(pc.slug));
          return (
            <li key={p.id} className="vidro grid gap-5 rounded-[22px] p-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
              <div>
                {/* Clique na foto para escolher o ponto que nunca é cortado (a pessoa/roupa) */}
                <button
                  type="button"
                  className="relative block aspect-[16/10] w-full overflow-hidden rounded-2xl bg-nevoa"
                  aria-label="Escolher o centro da foto"
                  onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    const px = Math.round(((e.clientX - r.left) / r.width) * 100);
                    const py = Math.round(((e.clientY - r.top) / r.height) * 100);
                    editar(i, { posicao: `${px}% ${py}%` });
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.foto} alt="" className="h-full w-full object-cover" />
                  <span
                    className="pointer-events-none absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-vinho/70 shadow-[0_0_0_4px_rgb(130_36_52/0.3)]"
                    style={{ left: `${x}%`, top: `${y}%` }}
                    aria-hidden="true"
                  />
                  <span className="mono absolute top-2 left-2 rounded-full bg-grafite/80 px-2.5 py-1 text-[0.55rem] text-white">
                    Página {String(i + 1).padStart(2, "0")}
                  </span>
                </button>
                <p className="mt-2 text-[0.78rem] text-suave">Clique na foto para marcar a roupa: esse ponto nunca fica cortado no livro.</p>
              </div>

              <div className="flex flex-col gap-3">
                <label className="rotulo-campo">
                  Título do look
                  <input className="campo" maxLength={90} value={p.titulo} onChange={(e) => editar(i, { titulo: e.target.value })} placeholder="Ex.: Frio de garimpo" />
                </label>
                <label className="rotulo-campo">
                  Texto (opcional)
                  <textarea className="campo min-h-20 py-3" maxLength={400} value={p.texto ?? ""} onChange={(e) => editar(i, { texto: e.target.value })} />
                </label>
                <div>
                  <p className="rotulo-campo">Peças na foto ({p.pecas.length}/6)</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {p.pecas.map((s) => {
                      const pc = pecas.find((x) => x.slug === s);
                      return (
                        <li key={s}>
                          <button
                            type="button"
                            onClick={() => editar(i, { pecas: p.pecas.filter((v) => v !== s) })}
                            className="chip"
                            aria-pressed="true"
                            aria-label={`Tirar ${pc?.nome ?? s}`}
                          >
                            {pc ? pc.nome : s} ✕
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  {p.pecas.length < 6 && (
                    <select
                      className="campo"
                      value=""
                      aria-label="Adicionar peça ao look"
                      onChange={(e) => e.target.value && editar(i, { pecas: [...p.pecas, e.target.value] })}
                    >
                      <option value="">+ Adicionar peça…</option>
                      {disponiveis.map((pc) => (
                        <option key={pc.slug} value={pc.slug}>
                          {pc.nome} · {pc.marca}
                          {pc.vendida ? " (vendida)" : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="mt-auto flex flex-wrap gap-1 pt-2">
                  <button type="button" onClick={() => mover(i, -1)} disabled={i === 0} className="mono rounded-full px-3 py-2 text-[0.6rem] hover:bg-grafite hover:text-white disabled:opacity-30">
                    ↑ Subir
                  </button>
                  <button
                    type="button"
                    onClick={() => mover(i, 1)}
                    disabled={i === paginas.length - 1}
                    className="mono rounded-full px-3 py-2 text-[0.6rem] hover:bg-grafite hover:text-white disabled:opacity-30"
                  >
                    ↓ Descer
                  </button>
                  <button
                    type="button"
                    onClick={() => window.confirm("Tirar esta foto do lookbook?") && mudar(paginas.filter((_, j) => j !== i))}
                    className="mono ml-auto rounded-full px-3 py-2 text-[0.6rem] text-vinho hover:bg-vinho hover:text-white"
                  >
                    Tirar foto
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <Aviso msg={msg} />
    </div>
  );
}
