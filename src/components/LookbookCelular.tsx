"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { FotoInteira, type Pagina } from "./LivroLookbook";

const dois = (n: number) => String(n).padStart(2, "0");

/**
 * Lookbook do celular: só as fotos, uma embaixo da outra, inteiras e no formato original (sem corte),
 * ocupando a largura da tela. Tocar na foto abre ela em tela cheia (dá para girar o celular).
 * No computador continua o livro (LivroLookbook).
 */
export function LookbookCelular({ paginas }: { paginas: Pagina[] }) {
  const [ampliada, setAmpliada] = useState<number | null>(null);
  const mudarAmpliada = useCallback((i: number) => setAmpliada(i), []);
  const fecharAmpliada = useCallback(() => setAmpliada(null), []);

  if (paginas.length === 0) {
    return (
      <div className="px-4 py-16">
        <div className="vidro rounded-[28px] p-8 text-center">
          <p className="titulo text-4xl">O lookbook está sendo montado.</p>
          <p className="mt-3 text-suave">As fotos chegam em breve. Enquanto isso, veja as peças na loja.</p>
          <Link href="/loja" className="btn btn-cheio mt-6">
            Ver a loja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section aria-label="Lookbook" className="flex flex-col gap-4 px-4 pt-6 pb-10">
      {paginas.map((pagina, i) => (
        <button
          key={pagina.id}
          type="button"
          onClick={() => setAmpliada(i)}
          aria-label={`Look ${i + 1}${pagina.titulo ? `: ${pagina.titulo}` : ""}. Abrir em tela cheia`}
          className="block overflow-hidden rounded-[22px] bg-nevoa shadow-[0_30px_60px_-34px_rgb(37_32_29/0.6)]"
        >
          {/* width/height 0 + h-auto: a foto aparece no formato dela, sem corte */}
          <Image
            src={pagina.foto}
            alt={`Look ${dois(i + 1)}${pagina.titulo ? `: ${pagina.titulo}` : ""}`}
            width={0}
            height={0}
            sizes="100vw"
            priority={i === 0}
            draggable={false}
            className="block h-auto w-full"
          />
        </button>
      ))}

      {ampliada !== null && <FotoInteira paginas={paginas} indice={ampliada} mudar={mudarAmpliada} fechar={fecharAmpliada} />}
    </section>
  );
}
