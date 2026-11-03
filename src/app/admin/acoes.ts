"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { alterarDados } from "@/lib/armazem";
import { criarSlug } from "@/lib/catalogo";
import { rotuloCategoria, rotuloEstado, rotuloEstilo, rotuloSecao, rotuloSituacao } from "@/lib/rotulos";
import { entrarComoAdm, exigirAdm, sairDoAdm } from "@/lib/sessao";
import type { AvisoLoja, Drop, PaginaLookbook, Produto, Situacao } from "@/lib/tipos";

// Tudo o que o painel de ADM grava passa por aqui. Cada ação confere o login primeiro.

type Resultado = { erro?: string; slug?: string };

function atualizarSite() {
  revalidatePath("/", "layout");
}

const texto = (v: unknown, max = 4000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const opcional = (v: unknown, max = 400) => texto(v, max) || undefined;
const umDe = <T extends string>(v: unknown, opcoes: Record<T, string>) => (typeof v === "string" && v in opcoes ? (v as T) : null);
const caminhoFoto = (v: unknown) => typeof v === "string" && /^\/(api\/fotos|lookbook|images)\/[\w./-]+$/.test(v) && !v.includes("..");

// ── Login ──────────────────────────────────────────────────────────

export async function entrar(_anterior: Resultado | null, form: FormData): Promise<Resultado> {
  const ok = await entrarComoAdm(texto(form.get("email"), 200), typeof form.get("senha") === "string" ? (form.get("senha") as string) : "");
  if (!ok) {
    await new Promise((r) => setTimeout(r, 700)); // freia quem tenta adivinhar a senha
    return { erro: "E-mail ou senha incorretos." };
  }
  redirect("/admin");
}

export async function sair() {
  await sairDoAdm();
  redirect("/admin/entrar");
}

// ── Peças ──────────────────────────────────────────────────────────

function validarPeca(e: Partial<Produto>): Produto | string {
  const nome = texto(e.nome, 120);
  if (!nome) return "Dê um nome para a peça.";
  const marca = texto(e.marca, 80) || "Sem marca";
  const preco = Number(e.preco);
  if (!Number.isFinite(preco) || preco <= 0) return "Preço inválido.";
  const precoOriginal = e.precoOriginal ? Number(e.precoOriginal) : undefined;
  if (precoOriginal !== undefined && (!Number.isFinite(precoOriginal) || precoOriginal <= 0)) return "Preço da peça nova inválido.";
  const tamanho = texto(e.tamanho, 20);
  if (!tamanho) return "Informe o tamanho.";
  const estado = umDe(e.estado, rotuloEstado);
  const categoria = umDe(e.categoria, rotuloCategoria);
  const secao = umDe(e.secao, rotuloSecao);
  const estilo = umDe(e.estilo, rotuloEstilo);
  const situacao = umDe(e.situacao, rotuloSituacao);
  if (!estado || !categoria || !secao || !estilo || !situacao) return "Escolha estado, peça, seção, estilo e situação.";
  const drop = texto(e.drop, 60);
  if (!drop) return "Escolha o drop.";
  const medidas = (Array.isArray(e.medidas) ? e.medidas : [])
    .map((m) => ({ nome: texto(m?.nome, 40), cm: Number(m?.cm) }))
    .filter((m) => m.nome && Number.isFinite(m.cm) && m.cm > 0);
  const fotos = (Array.isArray(e.fotos) ? e.fotos : []).filter(caminhoFoto).slice(0, 12);
  return {
    slug: "",
    nome,
    marca,
    preco: Math.round(preco * 100) / 100,
    ...(precoOriginal ? { precoOriginal: Math.round(precoOriginal * 100) / 100 } : {}),
    tamanho,
    medidas,
    estado,
    observacaoEstado: opcional(e.observacaoEstado),
    descricao: texto(e.descricao) || nome,
    categoria,
    secao,
    estilo,
    drop,
    situacao,
    fotos,
    cor: opcional(e.cor, 60),
    composicao: opcional(e.composicao, 120),
  };
}

/** Cria (slugOriginal = null) ou atualiza uma peça. */
export async function salvarPeca(entrada: Partial<Produto>, slugOriginal: string | null): Promise<Resultado> {
  await exigirAdm();
  const peca = validarPeca(entrada);
  if (typeof peca === "string") return { erro: peca };

  let erro: string | undefined;
  await alterarDados((d) => {
    if (!d.drops.some((x) => x.slug === peca.drop)) {
      erro = "Esse drop não existe mais.";
      return;
    }
    if (slugOriginal) {
      const i = d.produtos.findIndex((p) => p.slug === slugOriginal);
      if (i < 0) {
        erro = "Peça não encontrada. Ela pode ter sido apagada.";
        return;
      }
      d.produtos[i] = { ...peca, slug: slugOriginal }; // o endereço da peça não muda ao editar
      peca.slug = slugOriginal;
    } else {
      // Endereço novo a partir do nome; se já existir, ganha um número no fim
      const base = criarSlug(`${peca.nome} ${peca.marca === "Sem marca" ? "" : peca.marca}`) || "peca";
      let slug = base;
      for (let n = 2; d.produtos.some((p) => p.slug === slug); n++) slug = `${base}-${n}`;
      peca.slug = slug;
      d.produtos.unshift(peca);
    }
  });
  if (erro) return { erro };
  atualizarSite();
  return { slug: peca.slug };
}

export async function apagarPeca(slug: string): Promise<Resultado> {
  await exigirAdm();
  await alterarDados((d) => {
    d.produtos = d.produtos.filter((p) => p.slug !== slug);
    for (const pagina of d.lookbook) pagina.pecas = pagina.pecas.filter((s) => s !== slug);
  });
  atualizarSite();
  return {};
}

export async function mudarSituacao(slug: string, situacao: Situacao): Promise<Resultado> {
  await exigirAdm();
  if (!umDe(situacao, rotuloSituacao)) return { erro: "Situação inválida." };
  await alterarDados((d) => {
    const p = d.produtos.find((x) => x.slug === slug);
    if (p) p.situacao = situacao;
  });
  atualizarSite();
  return {};
}

// ── Drops ──────────────────────────────────────────────────────────

export async function salvarDrop(entrada: Partial<Drop>, slugOriginal: string | null): Promise<Resultado> {
  await exigirAdm();
  const numero = Math.floor(Number(entrada.numero));
  if (!Number.isFinite(numero) || numero < 1) return { erro: "Número do drop inválido." };
  const nome = texto(entrada.nome, 80);
  if (!nome) return { erro: "Dê um nome para o drop." };
  const data = texto(entrada.data, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return { erro: "Data inválida." };
  const drop: Drop = { slug: slugOriginal ?? `drop-${String(numero).padStart(2, "0")}`, numero, nome, data, descricao: texto(entrada.descricao, 400) };

  let erro: string | undefined;
  await alterarDados((d) => {
    if (d.drops.some((x) => x.numero === numero && x.slug !== slugOriginal)) {
      erro = `Já existe um drop número ${numero}.`;
      return;
    }
    if (slugOriginal) {
      const i = d.drops.findIndex((x) => x.slug === slugOriginal);
      if (i >= 0) d.drops[i] = drop;
    } else {
      if (d.drops.some((x) => x.slug === drop.slug)) drop.slug = `${drop.slug}-${Date.now().toString(36)}`;
      d.drops.push(drop);
    }
  });
  if (erro) return { erro };
  atualizarSite();
  return { slug: drop.slug };
}

export async function apagarDrop(slug: string): Promise<Resultado> {
  await exigirAdm();
  let erro: string | undefined;
  await alterarDados((d) => {
    const qtd = d.produtos.filter((p) => p.drop === slug).length;
    if (qtd > 0) erro = `Esse drop ainda tem ${qtd} ${qtd === 1 ? "peça" : "peças"}. Mude as peças de drop ou apague-as antes.`;
    else if (d.drops.length <= 1) erro = "A loja precisa de pelo menos um drop.";
    else d.drops = d.drops.filter((x) => x.slug !== slug);
  });
  if (erro) return { erro };
  atualizarSite();
  return {};
}

// ── Loja aberta / fechada ──────────────────────────────────────────

export async function salvarAviso(entrada: AvisoLoja): Promise<Resultado> {
  await exigirAdm();
  const aviso: AvisoLoja = {
    fechada: Boolean(entrada.fechada),
    titulo: texto(entrada.titulo, 90) || "Estamos preparando o próximo drop",
    mensagem: texto(entrada.mensagem, 400),
  };
  await alterarDados((d) => {
    d.aviso = aviso;
  });
  atualizarSite();
  return {};
}

// ── Lookbook ───────────────────────────────────────────────────────

/** Grava a lista inteira de páginas do lookbook (na ordem em que vieram). */
export async function salvarLookbook(entrada: PaginaLookbook[]): Promise<Resultado> {
  await exigirAdm();
  if (!Array.isArray(entrada)) return { erro: "Lista inválida." };
  const paginas: PaginaLookbook[] = [];
  for (const p of entrada.slice(0, 60)) {
    if (!caminhoFoto(p?.foto)) return { erro: "Uma das fotos tem um caminho inválido." };
    const posicao = texto(p.posicao, 20);
    paginas.push({
      id: texto(p.id, 40) || `look-${Date.now().toString(36)}-${paginas.length}`,
      foto: p.foto,
      titulo: texto(p.titulo, 90) || "Sem título",
      texto: opcional(p.texto, 400),
      posicao: /^\d{1,3}% \d{1,3}%$/.test(posicao) ? posicao : undefined,
      pecas: (Array.isArray(p.pecas) ? p.pecas : []).filter((s): s is string => typeof s === "string").slice(0, 6),
    });
  }
  await alterarDados((d) => {
    d.lookbook = paginas;
  });
  atualizarSite();
  return {};
}
