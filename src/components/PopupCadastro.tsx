"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { loja } from "@/data/config-loja";
import { EMAIL_VALIDO, enviarCadastro, lerRegistroPopup, salvarRegistroPopup } from "@/lib/cadastro";
import { IconeFechar, IconeInstagram } from "./Icones";

// Páginas onde o popup nunca aparece: atrapalharia a compra.
const SEM_POPUP = ["/checkout", "/sacola", "/pedido-confirmado", "/entrar"];
const ATRASO = 1200;
const DIA = 24 * 60 * 60 * 1000;

type Estado = "form" | "enviando" | "ok" | "sem-lista";

/**
 * Card de boas-vindas que aparece na primeira visita.
 * Se a pessoa fechar, só volta depois de loja.cadastro.reaparecerEmDias. Depois do cadastro, nunca mais.
 */
export function PopupCadastro() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState(false);
  const [estado, setEstado] = useState<Estado>("form");
  const campo = useRef<HTMLInputElement>(null);
  const verificado = useRef(false);

  useEffect(() => {
    if (verificado.current || !loja.cadastro.ativo) return;
    if (SEM_POPUP.some((p) => pathname.startsWith(p))) return;
    verificado.current = true;
    const reg = lerRegistroPopup();
    if (reg?.estado === "cadastrado") return;
    if (reg?.estado === "fechado" && Date.now() - reg.em < loja.cadastro.reaparecerEmDias * DIA) return;
    const t = window.setTimeout(() => setAberto(true), ATRASO);
    return () => window.clearTimeout(t);
  }, [pathname]);

  const fechar = () => {
    setAberto(false);
    if (estado !== "ok") salvarRegistroPopup("fechado");
  };

  useEffect(() => {
    if (!aberto) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && fechar();
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => campo.current?.focus({ preventScroll: true }), 400);
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
      window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto]);

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_VALIDO.test(email.trim())) {
      setErro(true);
      campo.current?.focus();
      return;
    }
    if (!loja.cadastro.listaConectada) {
      setEstado("sem-lista");
      return;
    }
    setEstado("enviando");
    try {
      await enviarCadastro(email.trim());
      salvarRegistroPopup("cadastrado");
      setEstado("ok");
    } catch {
      setEstado("sem-lista");
    }
  }

  if (!aberto) return null;

  return (
    <>
      <div className="popup-fundo" onClick={fechar} />
      <div className="popup vidro grid md:grid-cols-[0.9fr_1.1fr]" role="dialog" aria-modal="true" aria-labelledby="popup-titulo">
        <div className="foto-editorial grao cantos tom-vinho hidden min-h-[520px] md:flex">
          <span className="foto-editorial-rotulo">
            Foto editorial
            <br />
            placeholder · substituir
          </span>
          <span className="mono absolute top-6 left-6 z-[3] text-white">n.º 001 / bem-vinde</span>
          <span className="disp cromo-claro absolute bottom-5 left-6 z-[3] text-[4rem]" aria-hidden="true">
            ZO
            <br />
            WHY
          </span>
        </div>

        <div className="relative flex flex-col gap-4 p-6 pt-7 sm:p-11">
          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar"
            className="absolute top-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-white/70 transition-[background,color,rotate] duration-400 hover:rotate-90 hover:bg-grafite hover:text-white"
          >
            <IconeFechar className="h-5 w-5" />
          </button>
          <p className="mono text-vinho">Primeira vez por aqui?</p>
          <h2 id="popup-titulo" className="leading-[0.95]">
            <span className="disp text-[2.1rem] sm:text-[2.7rem]">Entre pra</span>
            <br />
            <span className="titulo text-[3.6rem] text-vinho sm:text-[5.2rem]">lista.</span>
          </h2>

          {estado === "form" || estado === "enviando" ? (
            <>
              <p className="max-w-sm text-[#4a433f]">
                Cada peça existe uma vez só. Cadastre seu e-mail e receba o aviso quando um drop novo entrar no ar.
              </p>
              <form onSubmit={cadastrar} noValidate className="flex flex-col gap-2">
                <label htmlFor="popup-email" className="rotulo-campo">
                  Seu e-mail
                </label>
                <input
                  ref={campo}
                  id="popup-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="voce@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErro(false);
                  }}
                  aria-invalid={erro}
                  aria-describedby={erro ? "popup-erro" : undefined}
                  className="campo mt-0"
                />
                {erro && (
                  <p id="popup-erro" role="alert" className="text-sm text-[#b3261e]">
                    Confere o e-mail? Parece que falta alguma coisa.
                  </p>
                )}
                <button type="submit" className="btn btn-cheio mt-2" disabled={estado === "enviando"}>
                  {estado === "enviando" && <span className="carregando" aria-hidden="true" />}
                  {estado === "enviando" ? "Cadastrando…" : "Cadastrar"}
                </button>
              </form>
            </>
          ) : estado === "ok" ? (
            <div role="status" className="entrar flex flex-col gap-4">
              <p className="text-lg">Pronto, você está na lista. O próximo drop chega no seu e-mail.</p>
              <button type="button" className="btn" onClick={fechar}>
                Continuar navegando
              </button>
            </div>
          ) : (
            <div role="status" className="entrar flex flex-col gap-4">
              <p className="text-lg">
                O aviso por e-mail ainda está sendo preparado e seu e-mail não foi salvo. Por enquanto, os drops saem primeiro no
                Instagram.
              </p>
              <a href={loja.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-cheio">
                <IconeInstagram className="h-5 w-5" />
                Seguir @{loja.instagram}
              </a>
              <button type="button" className="link self-start text-sm" onClick={fechar}>
                Continuar navegando
              </button>
            </div>
          )}

          <p className="mt-auto pt-2 text-sm text-[#5a5450]">
            Já tem conta?{" "}
            <Link href="/entrar" className="link" onClick={() => setAberto(false)}>
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
