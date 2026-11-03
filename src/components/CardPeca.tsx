import Link from "next/link";
import { formatarPreco, resumoParcelamento } from "@/lib/precos";
import type { Produto } from "@/lib/tipos";
import { BotaoRapido } from "./BotaoRapido";
import { FotoPeca } from "./FotoPeca";

/** Chapinha metálica com tamanho e marca, no canto da foto. */
export function Etiqueta({ tamanho, marca, apagada = false }: { tamanho: string; marca: string; apagada?: boolean }) {
  return (
    <div className={`etiqueta ${apagada ? "etiqueta-apagada" : ""}`} aria-hidden="true">
      <div className="etiqueta-corpo metal">
        <span className="etiqueta-tamanho">{tamanho}</span>
        <span className="etiqueta-marca">{marca}</span>
      </div>
    </div>
  );
}

export function Carimbo({ grande = false }: { grande?: boolean }) {
  return <span className={`carimbo ${grande ? "carimbo-grande" : ""}`}>Vendida</span>;
}

export function CardPeca({ produto, prioridade = false, destaque = false }: { produto: Produto; prioridade?: boolean; destaque?: boolean }) {
  const vendida = produto.situacao === "vendida";
  const reservada = produto.situacao === "reservada";
  const href = `/peca/${produto.slug}`;
  const parcelas = !vendida ? resumoParcelamento(produto.preco) : null;

  return (
    <article className={`card-peca group flex flex-col ${destaque ? "h-full" : ""}`}>
      <div className={`relative ${destaque ? "flex-1" : ""}`}>
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className={`card-foto relative block overflow-hidden rounded-[4px] bg-nevoa ${destaque ? "aspect-[4/5] h-full md:aspect-auto md:min-h-[34rem]" : "aspect-[4/5]"} ${
            vendida ? "foto-vendida" : ""
          }`}
        >
          <FotoPeca produto={produto} prioridade={prioridade} sizes={destaque ? "(min-width: 768px) 50vw, 100vw" : undefined} />
          <Etiqueta tamanho={produto.tamanho} marca={produto.marca} apagada={vendida} />
          {vendida && <Carimbo />}
          {reservada && <span className="selo-reservada">Reservada</span>}
        </Link>
        {!vendida && !reservada && <BotaoRapido slug={produto.slug} nome={produto.nome} />}
      </div>
      <Link href={href} className="block pt-3.5">
        <p className="mono text-[0.62rem] text-suave">{produto.marca}</p>
        <h3 className={`mt-1 leading-snug font-medium transition-colors group-hover:text-vinho ${destaque ? "text-lg" : "text-[0.95rem]"}`}>
          {produto.nome}
        </h3>
        <p className={`mt-2 ${vendida ? "text-sm text-suave" : "preco"}`}>{formatarPreco(produto.preco)}</p>
        {parcelas && <p className="mt-0.5 text-[0.78rem] text-suave">{parcelas.replace(/^ou /, "")}</p>}
      </Link>
    </article>
  );
}
