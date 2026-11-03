"use client";

import Link from "next/link";

export default function Erro({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 pt-20 pb-24 text-center sm:px-6">
      <p className="mono text-vinho">Erro</p>
      <p className="titulo mt-3 text-6xl">Algo deu errado</p>
      <p className="mt-3 text-suave">Não conseguimos abrir esta página agora. Tente de novo em instantes.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-cheio">
          Tentar de novo
        </button>
        <Link href="/loja" className="btn">
          Ir para a loja
        </Link>
      </div>
    </div>
  );
}
