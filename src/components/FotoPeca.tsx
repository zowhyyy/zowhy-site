import Image from "next/image";
import type { Categoria, Produto } from "@/lib/tipos";

const fundos = ["#EDECE9", "#E7E8EA", "#EEEBE7", "#E8E9E5"];
const cor = "#D5D2CD";

function silhueta(categoria: Categoria, fundo: string) {
  switch (categoria) {
    case "jaqueta":
      return (
        <>
          <path d="M150 105 L182 92 L200 130 L218 92 L250 105 L300 150 L322 330 L292 336 L268 200 L266 404 L134 404 L132 200 L108 336 L78 330 L100 150 Z" fill={cor} />
          <path d="M200 130 V404" stroke={fundo} strokeWidth="3" />
        </>
      );
    case "moletom":
      return (
        <>
          <path d="M150 105 L180 94 Q200 112 220 94 L250 105 L300 150 L322 330 L292 336 L268 200 L266 404 L134 404 L132 200 L108 336 L78 330 L100 150 Z" fill={cor} />
          <path d="M160 300 H240 L250 350 H150 Z" fill={fundo} opacity="0.55" />
        </>
      );
    case "camiseta":
    case "camisa":
      return <path d="M150 110 L180 96 Q200 118 220 96 L250 110 L318 170 L292 204 L262 180 L262 404 L138 404 L138 180 L108 204 L82 170 Z" fill={cor} />;
    case "calca":
      return <path d="M138 96 H262 L282 412 H218 L200 190 L182 412 H118 Z" fill={cor} />;
    case "bermuda":
      return <path d="M138 140 H262 L276 330 H214 L200 230 L186 330 H124 Z" fill={cor} />;
    case "saia":
      return <path d="M160 130 H240 L290 360 H110 Z" fill={cor} />;
    case "vestido":
      return <path d="M172 88 H186 Q200 104 214 88 H228 L236 170 L292 410 H108 L164 170 Z" fill={cor} />;
    case "tenis":
      return (
        <>
          <path d="M82 318 Q84 268 126 262 L182 248 Q206 280 246 282 L306 296 Q330 304 328 334 H82 Z" fill={cor} />
          <rect x="82" y="334" width="246" height="18" rx="6" fill="#C9C6C0" />
        </>
      );
    case "acessorio":
      return (
        <>
          <path d="M160 222 Q160 150 200 150 Q240 150 240 222" fill="none" stroke={cor} strokeWidth="10" />
          <path d="M126 220 H274 L290 390 H110 Z" fill={cor} />
        </>
      );
  }
}

/** Imagem provisória usada enquanto a peça não tem foto. */
export function FotoProvisoria({ categoria, semente = 0, rotulo }: { categoria: Categoria; semente?: number; rotulo?: string }) {
  const fundo = fundos[semente % fundos.length];
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="foto h-full w-full" role="img" aria-label="Foto em breve">
      <rect width="400" height="500" fill={fundo} />
      {silhueta(categoria, fundo)}
      {rotulo && (
        <text x="200" y="470" textAnchor="middle" fontSize="15" fill="#8d8a84" fontFamily="inherit">
          {rotulo}
        </text>
      )}
    </svg>
  );
}

function semente(slug: string) {
  let n = 0;
  for (const c of slug) n += c.charCodeAt(0);
  return n;
}

export function FotoPeca({
  produto,
  indice = 0,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  prioridade = false,
  rotuloProvisorio,
}: {
  produto: Produto;
  indice?: number;
  sizes?: string;
  prioridade?: boolean;
  rotuloProvisorio?: string;
}) {
  const src = produto.fotos[indice];
  if (src) {
    return (
      <Image
        src={src}
        alt={`${produto.nome}, foto ${indice + 1}`}
        fill
        sizes={sizes}
        priority={prioridade}
        className="foto object-cover"
      />
    );
  }
  return <FotoProvisoria categoria={produto.categoria} semente={semente(produto.slug) + indice} rotulo={rotuloProvisorio} />;
}
