"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { apagarDrop, salvarDrop } from "@/app/admin/acoes";
import { numeroDrop } from "@/lib/catalogo";
import type { Drop } from "@/lib/tipos";
import { Aviso, useAviso } from "./Aviso";

function hoje() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function CartaoDrop({
  drop,
  qtd,
  novo,
  aoSalvar,
  aoApagar,
  ocupado,
}: {
  drop: Drop;
  qtd: number;
  novo?: boolean;
  aoSalvar: (d: Drop) => void;
  aoApagar?: () => void;
  ocupado: boolean;
}) {
  const [d, setD] = useState(drop);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        aoSalvar(d);
      }}
      className={`grid gap-4 rounded-[22px] p-5 sm:grid-cols-[7rem_minmax(0,1fr)_11rem] ${novo ? "border-2 border-dashed border-vinho/40 bg-white/70" : "vidro"}`}
    >
      <label className="rotulo-campo">
        Número
        <input className="campo" type="number" min={1} required value={d.numero} onChange={(e) => setD({ ...d, numero: Number(e.target.value) })} />
      </label>
      <label className="rotulo-campo">
        Nome
        <input className="campo" required maxLength={80} value={d.nome} onChange={(e) => setD({ ...d, nome: e.target.value })} placeholder="Ex.: Frio de garimpo" />
      </label>
      <label className="rotulo-campo">
        Data
        <input className="campo" type="date" required value={d.data} onChange={(e) => setD({ ...d, data: e.target.value })} />
      </label>
      <label className="rotulo-campo sm:col-span-3">
        Descrição curta
        <input className="campo" maxLength={400} value={d.descricao} onChange={(e) => setD({ ...d, descricao: e.target.value })} />
      </label>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-3">
        <button type="submit" className={`btn ${novo ? "btn-cheio" : ""} min-h-10`} disabled={ocupado}>
          {novo ? "Criar drop" : "Salvar"}
        </button>
        {!novo && (
          <>
            <span className="mono text-suave">
              Drop_{numeroDrop(drop.numero)} · {qtd} {qtd === 1 ? "peça" : "peças"}
            </span>
            <button
              type="button"
              className="mono ml-auto rounded-full px-3 py-2 text-[0.6rem] text-vinho hover:bg-vinho hover:text-white"
              disabled={ocupado}
              onClick={aoApagar}
            >
              Apagar drop
            </button>
          </>
        )}
      </div>
    </form>
  );
}

export function EditorDrops({ drops, contagem }: { drops: Drop[]; contagem: Record<string, number> }) {
  const router = useRouter();
  const [ocupado, iniciar] = useTransition();
  const [msg, mostrar] = useAviso();
  const [chaveNovo, setChaveNovo] = useState(0);
  const proximo = (drops[0]?.numero ?? 0) + 1;

  const agir = (acao: () => Promise<{ erro?: string }>, ok: string, depois?: () => void) =>
    iniciar(async () => {
      const r = await acao();
      if (r.erro) mostrar({ erro: r.erro });
      else {
        mostrar({ ok });
        depois?.();
        router.refresh();
      }
    });

  return (
    <div className="mt-8 flex flex-col gap-4">
      <h2 className="mono">Novo drop</h2>
      <CartaoDrop
        key={`novo-${chaveNovo}-${proximo}`}
        novo
        drop={{ slug: "", numero: proximo, nome: "", data: hoje(), descricao: "" }}
        qtd={0}
        ocupado={ocupado}
        aoSalvar={(d) => agir(() => salvarDrop(d, null), `Drop ${numeroDrop(d.numero)} criado.`, () => setChaveNovo((k) => k + 1))}
      />
      <h2 className="mono mt-6">Drops da loja</h2>
      {drops.map((d) => (
        <CartaoDrop
          key={`${d.slug}-${d.numero}-${d.nome}-${d.data}`}
          drop={d}
          qtd={contagem[d.slug] ?? 0}
          ocupado={ocupado}
          aoSalvar={(nd) => agir(() => salvarDrop(nd, d.slug), "Drop salvo.")}
          aoApagar={() => {
            if (window.confirm(`Apagar o Drop ${numeroDrop(d.numero)}?`)) agir(() => apagarDrop(d.slug), "Drop apagado.");
          }}
        />
      ))}
      <Aviso msg={msg} />
    </div>
  );
}
