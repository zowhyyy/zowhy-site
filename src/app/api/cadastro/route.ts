import { NextResponse } from "next/server";
import { EMAIL_VALIDO } from "@/lib/cadastro";

// Cadastro na lista de drops pela Brevo (https://www.brevo.com).
// Precisa de duas variáveis de ambiente (em .env.local no computador e no painel da hospedagem):
//   BREVO_API_KEY  → Brevo › Configurações › SMTP e API › Chaves de API
//   BREVO_LISTA_ID → número da lista em Brevo › Contatos › Listas
// Sem elas, a rota responde 503 e o popup avisa que o cadastro ainda não está ativo.

export async function POST(req: Request) {
  const chave = process.env.BREVO_API_KEY;
  const lista = Number(process.env.BREVO_LISTA_ID);
  if (!chave || !lista) {
    return NextResponse.json({ erro: "nao-configurado" }, { status: 503 });
  }

  let corpo: { email?: unknown; site?: unknown };
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ erro: "pedido-invalido" }, { status: 400 });
  }

  // Campo escondido do formulário: gente de verdade não preenche, robôs sim.
  if (corpo.site) return NextResponse.json({ ok: true });

  const email = typeof corpo.email === "string" ? corpo.email.trim().toLowerCase() : "";
  if (!EMAIL_VALIDO.test(email) || email.length > 254) {
    return NextResponse.json({ erro: "email-invalido" }, { status: 400 });
  }

  const resposta = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: { "api-key": chave, "content-type": "application/json", accept: "application/json" },
    // updateEnabled: se o e-mail já existir, só coloca na lista em vez de dar erro
    body: JSON.stringify({ email, listIds: [lista], updateEnabled: true }),
    cache: "no-store",
  });

  if (!resposta.ok) {
    console.error("Brevo recusou o cadastro:", resposta.status, await resposta.text());
    return NextResponse.json({ erro: "servico-indisponivel" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
