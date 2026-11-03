// Tipos usados em todo o site. Se criar um campo novo nas peças, declare aqui primeiro.

/** Condição da peça, da melhor para a pior. */
export type Estado = "nova-com-etiqueta" | "excelente" | "muito-bom" | "bom";

/** "reservada" = alguém está pagando por ela agora; não pode ser adicionada à sacola. */
export type Situacao = "disponivel" | "reservada" | "vendida";

export type Secao = "feminino" | "masculino" | "unissex";

export type Estilo = "vintage" | "grife" | "basico" | "streetwear" | "esportivo";

export type Categoria =
  | "camiseta"
  | "camisa"
  | "moletom"
  | "jaqueta"
  | "calca"
  | "bermuda"
  | "saia"
  | "vestido"
  | "tenis"
  | "acessorio";

export interface Medida {
  /** Ex.: "Busto", "Comprimento", "Cintura" */
  nome: string;
  /** Em centímetros, com a peça esticada sobre uma superfície plana. */
  cm: number;
}

export interface Produto {
  /** Identificador usado na URL: /peca/<slug>. Sem acentos nem espaços. */
  slug: string;
  nome: string;
  marca: string;
  /** Preço em reais. Ex.: 189.9 */
  preco: number;
  /** Preço da peça nova na loja (opcional). Aparece riscado. */
  precoOriginal?: number;
  /** Ex.: "M", "38", "40", "Único" */
  tamanho: string;
  medidas: Medida[];
  estado: Estado;
  /** Detalhes ou defeitos que o cliente precisa saber (opcional). */
  observacaoEstado?: string;
  /** A "bio" da peça. Separe parágrafos com uma linha em branco. */
  descricao: string;
  categoria: Categoria;
  secao: Secao;
  estilo: Estilo;
  /** Slug do drop em src/data/drops.ts */
  drop: string;
  situacao: Situacao;
  /** Caminhos das fotos dentro de /public. A primeira é a capa. Vazio = imagem provisória. */
  fotos: string[];
  cor?: string;
  composicao?: string;
}

export interface Drop {
  slug: string;
  numero: number;
  nome: string;
  /** Data de lançamento no formato AAAA-MM-DD */
  data: string;
  descricao: string;
}

/** Uma página de foto do lookbook (/lookbook). */
export interface PaginaLookbook {
  id: string;
  /** Caminho da foto (em /public ou enviada pelo painel: /api/fotos/...) */
  foto: string;
  titulo: string;
  texto?: string;
  /** Parte da foto que fica no centro do corte, como no CSS object-position. Ex.: "30% 40%" */
  posicao?: string;
  /** Slugs das peças que aparecem na foto */
  pecas: string[];
}

/** Loja aberta ou fechada (ex.: enquanto um drop novo está sendo montado). */
export interface AvisoLoja {
  fechada: boolean;
  titulo: string;
  mensagem: string;
}

/** Tudo o que o painel de ADM edita. Fica salvo em dados/loja.json (ver src/lib/armazem.ts). */
export interface DadosLoja {
  produtos: Produto[];
  drops: Drop[];
  lookbook: PaginaLookbook[];
  aviso: AvisoLoja;
}
