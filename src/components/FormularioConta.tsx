"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { loja } from "@/data/config-loja";
import { EMAIL_VALIDO } from "@/lib/cadastro";
import { IconeOlho } from "./Icones";

type Modo = "entrar" | "criar" | "recuperar";
type Erros = Partial<Record<"nome" | "email" | "senha", string>>;

const textos: Record<Modo, { titulo: string; sub: string; botao: string; carregando: string }> = {
  entrar: { titulo: "Bom te ver.", sub: "Entre para acompanhar seus pedidos.", botao: "Entrar", carregando: "Entrando…" },
  criar: {
    titulo: "Crie sua conta.",
    sub: "Guarde seus dados para comprar mais rápido e acompanhar pedidos.",
    botao: "Criar conta",
    carregando: "Criando…",
  },
  recuperar: {
    titulo: "Esqueceu a senha?",
    sub: "Digite o e-mail da sua conta. A gente manda um link para criar uma senha nova.",
    botao: "Enviar link",
    carregando: "Enviando…",
  },
};

/** 0 a 4: quão forte está a senha (só para o medidor visual). */
function forcaDaSenha(s: string) {
  if (!s) return 0;
  if (s.length < 8) return 1;
  if (!(/\d/.test(s) && /[a-z]/i.test(s))) return 2;
  return s.length >= 12 ? 4 : 3;
}

/**
 * Interface de login, criação de conta e recuperação de senha.
 * As contas ainda não existem (loja.contasAtivas = false): o formulário valida os campos e
 * avisa isso, sem fingir que entrou. Para ligar, troque o trecho marcado em enviar().
 */
export function FormularioConta() {
  const [modo, setModo] = useState<Modo>("entrar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [erros, setErros] = useState<Erros>({});
  const [estado, setEstado] = useState<"form" | "enviando" | "aviso">("form");
  const timer = useRef<number | undefined>(undefined);
  const t = textos[modo];
  const forca = forcaDaSenha(senha);

  const ir = (m: Modo) => {
    window.clearTimeout(timer.current);
    setModo(m);
    setErros({});
    setEstado("form");
  };

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const novos: Erros = {};
    if (modo === "criar" && !nome.trim()) novos.nome = "Como a gente te chama?";
    if (!EMAIL_VALIDO.test(email.trim())) novos.email = "Esse e-mail não parece completo.";
    if (modo === "entrar" && !senha) novos.senha = "Digite sua senha.";
    if (modo === "criar" && senha.length < 8) novos.senha = "A senha precisa ter pelo menos 8 caracteres.";
    setErros(novos);
    if (Object.keys(novos).length) return;

    setEstado("enviando");
    // Quando as contas existirem: chame a autenticação aqui no lugar deste aviso.
    timer.current = window.setTimeout(() => setEstado("aviso"), 700);
  }

  const campoProps = (chave: keyof Erros) => ({
    "aria-invalid": Boolean(erros[chave]),
    "aria-describedby": erros[chave] ? `erro-${chave}` : undefined,
    className: "campo",
  });
  const Erro = ({ chave }: { chave: keyof Erros }) =>
    erros[chave] ? (
      <p id={`erro-${chave}`} role="alert" className="mt-1.5 text-sm text-[#b3261e]">
        {erros[chave]}
      </p>
    ) : null;

  return (
    <div className="vidro entrar relative z-[2] flex w-full max-w-[29rem] flex-col gap-6 rounded-[30px] p-6 sm:p-9">
      {modo !== "recuperar" && (
        <div className="relative grid grid-cols-2 rounded-full bg-grafite/5 p-1.5" role="tablist" aria-label="Acesso">
          <span
            aria-hidden="true"
            className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-full bg-grafite transition-transform duration-500 ease-[var(--curva)]"
            style={{ transform: modo === "criar" ? "translateX(100%)" : "none" }}
          />
          {(["entrar", "criar"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={modo === m}
              onClick={() => ir(m)}
              className={`relative z-[1] h-11 rounded-full text-sm font-semibold transition-colors duration-300 ${modo === m ? "text-white" : "text-suave hover:text-grafite"}`}
            >
              {m === "entrar" ? "Entrar" : "Criar conta"}
            </button>
          ))}
        </div>
      )}

      {estado === "aviso" ? (
        <div role="status" className="entrar flex flex-col gap-4">
          <p className="mono text-vinho">Em breve</p>
          <h1 className="titulo text-5xl">As contas ainda não estão ativas.</h1>
          <p className="text-[#4a433f]">
            Por enquanto dá para comprar sem conta: o resumo do pedido e o código de rastreio chegam no e-mail que você informar no
            pagamento.
          </p>
          <Link href="/loja" className="btn btn-cheio">
            Ir para a loja →
          </Link>
          <button type="button" className="link self-start text-sm" onClick={() => ir("entrar")}>
            Voltar
          </button>
        </div>
      ) : (
        <form key={modo} onSubmit={enviar} noValidate className="entrar flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h1 className="titulo text-5xl">{t.titulo}</h1>
            <p className="text-suave">{t.sub}</p>
          </div>

          {modo === "criar" && (
            <label className="block">
              <span className="rotulo-campo">Nome</span>
              <input autoComplete="name" value={nome} onChange={(e) => setNome(e.target.value)} {...campoProps("nome")} />
              <Erro chave="nome" />
            </label>
          )}

          <label className="block">
            <span className="rotulo-campo">E-mail</span>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="voce@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              {...campoProps("email")}
            />
            <Erro chave="email" />
          </label>

          {modo !== "recuperar" && (
            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="senha" className="rotulo-campo">
                  Senha
                </label>
                {modo === "entrar" && (
                  <button type="button" className="link text-[0.8rem]" onClick={() => ir("recuperar")}>
                    Esqueci a senha
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="senha"
                  type={verSenha ? "text" : "password"}
                  autoComplete={modo === "criar" ? "new-password" : "current-password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  {...campoProps("senha")}
                  className="campo pr-14"
                />
                <button
                  type="button"
                  onClick={() => setVerSenha((v) => !v)}
                  aria-label={verSenha ? "Esconder senha" : "Mostrar senha"}
                  aria-pressed={verSenha}
                  className="absolute top-[0.65rem] right-1.5 grid h-11 w-11 place-items-center rounded-[10px] text-suave transition-colors hover:bg-grafite/5 hover:text-vinho"
                >
                  <IconeOlho className="h-5 w-5" />
                </button>
              </div>
              {modo === "criar" && (
                <>
                  <div className="mt-2.5 flex gap-1" aria-hidden="true">
                    {[0, 1, 2, 3].map((i) => (
                      <span key={i} className={`h-1.5 flex-1 transition-colors duration-300 ${i < forca ? "bg-vinho" : "bg-linha"}`} />
                    ))}
                  </div>
                  <p className="mt-1.5 text-[0.8rem] text-suave">Mínimo de 8 caracteres.</p>
                </>
              )}
              <Erro chave="senha" />
            </div>
          )}

          <button type="submit" className="btn btn-cheio" disabled={estado === "enviando"}>
            {estado === "enviando" && <span className="carregando" aria-hidden="true" />}
            {estado === "enviando" ? t.carregando : t.botao}
          </button>

          {modo === "recuperar" ? (
            <button type="button" className="link self-start text-sm" onClick={() => ir("entrar")}>
              ← Voltar para entrar
            </button>
          ) : modo === "entrar" ? (
            <p className="text-sm text-suave">
              Primeira vez?{" "}
              <button type="button" className="link" onClick={() => ir("criar")}>
                Criar uma conta
              </button>
            </p>
          ) : null}
          {!loja.contasAtivas && <p className="mono text-[0.58rem] text-metal">Contas em preparação: nenhum dado é salvo ainda.</p>}
        </form>
      )}
    </div>
  );
}
