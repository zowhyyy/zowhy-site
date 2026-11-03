// Cadastro de e-mail para a lista de drops.
// Hoje NÃO existe serviço de e-mail ligado (config-loja.ts → cadastro.listaConectada: false).
// Para ligar: crie uma rota em src/app/api/cadastro/route.ts que envie o e-mail para o serviço
// escolhido (Brevo, Mailchimp etc.), troque o corpo desta função por um fetch para ela e mude
// listaConectada para true.

export const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function enviarCadastro(email: string): Promise<void> {
  void email;
  throw new Error("Lista de e-mail ainda não conectada.");
}

const CHAVE = "zowhy-popup";

type Registro = { estado: "fechado" | "cadastrado"; em: number };

export function lerRegistroPopup(): Registro | null {
  try {
    const bruto = localStorage.getItem(CHAVE);
    return bruto ? (JSON.parse(bruto) as Registro) : null;
  } catch {
    return null;
  }
}

export function salvarRegistroPopup(estado: Registro["estado"]) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify({ estado, em: Date.now() }));
  } catch {}
}
