import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN DO ADM
// E-mail e senha ficam no arquivo .env.local (ADMIN_EMAIL, ADMIN_SENHA e ADMIN_SEGREDO).
// Para trocar a senha: edite .env.local e reinicie o site. Isso também desloga quem estava logado.
// Login simples, de uma pessoa só. Quem for cuidar da segurança pode trocar por um sistema
// de contas de verdade sem mexer no painel: basta manter ehAdm() e entrarComoAdm().
// ─────────────────────────────────────────────────────────────────────────────

export const COOKIE_ADM = "zowhy-adm";
const DURACAO_S = 60 * 60 * 24 * 7; // 7 dias logado

export function admConfigurado() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_SENHA && process.env.ADMIN_SEGREDO);
}

function assinar(texto: string) {
  return createHmac("sha256", `${process.env.ADMIN_SEGREDO}:${process.env.ADMIN_SENHA}`).update(texto).digest("hex");
}

/** Compara sem vazar pelo tempo de resposta quantos caracteres batem. */
function iguais(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

function tokenValido(token: string | undefined) {
  if (!token || !admConfigurado()) return false;
  const [expira, assinatura] = token.split(".");
  if (!expira || !assinatura || Number(expira) * 1000 < Date.now()) return false;
  return iguais(assinatura, assinar(`adm.${expira}`));
}

export async function ehAdm() {
  return tokenValido((await cookies()).get(COOKIE_ADM)?.value);
}

/** Para páginas do painel: manda para o login quem não é ADM. */
export async function exigirAdmNaPagina() {
  if (!(await ehAdm())) redirect("/admin/entrar");
}

/** Para ações do painel (salvar, apagar...): recusa quem não é ADM. */
export async function exigirAdm() {
  if (!(await ehAdm())) throw new Error("Sessão de ADM expirada. Entre de novo.");
}

/** Confere e-mail e senha; se baterem, grava o cookie de sessão. */
export async function entrarComoAdm(email: string, senha: string) {
  if (!admConfigurado()) return false;
  // As duas comparações rodam sempre, para a resposta levar o mesmo tempo com e-mail certo ou errado
  const emailOk = iguais(email.trim().toLowerCase(), process.env.ADMIN_EMAIL!.trim().toLowerCase());
  const senhaOk = iguais(senha, process.env.ADMIN_SENHA!);
  if (!emailOk || !senhaOk) return false;
  const expira = Math.floor(Date.now() / 1000) + DURACAO_S;
  (await cookies()).set(COOKIE_ADM, `${expira}.${assinar(`adm.${expira}`)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DURACAO_S,
  });
  return true;
}

export async function sairDoAdm() {
  (await cookies()).delete(COOKIE_ADM);
}
