import type { Categoria, Estado, Estilo, Secao, Situacao } from "./tipos";

export const ordemEstados: Estado[] = ["nova-com-etiqueta", "excelente", "muito-bom", "bom"];

export const rotuloEstado: Record<Estado, string> = {
  "nova-com-etiqueta": "Nova com etiqueta",
  excelente: "Excelente",
  "muito-bom": "Muito bom",
  bom: "Bom",
};

export const explicacaoEstado: Record<Estado, string> = {
  "nova-com-etiqueta": "Nunca usada, ainda com a etiqueta original.",
  excelente: "Usada poucas vezes, sem sinais de uso.",
  "muito-bom": "Sinais leves de uso que não aparecem no corpo.",
  bom: "Sinais de uso visíveis, descritos abaixo.",
};

export const rotuloSecao: Record<Secao, string> = {
  feminino: "Feminino",
  masculino: "Masculino",
  unissex: "Unissex",
};

export const rotuloEstilo: Record<Estilo, string> = {
  vintage: "Vintage",
  grife: "Grife",
  basico: "Básico",
  streetwear: "Streetwear",
  esportivo: "Esportivo",
};

export const rotuloCategoria: Record<Categoria, string> = {
  camiseta: "Camisetas",
  camisa: "Camisas",
  moletom: "Moletons",
  jaqueta: "Jaquetas",
  calca: "Calças",
  bermuda: "Bermudas",
  saia: "Saias",
  vestido: "Vestidos",
  tenis: "Tênis",
  acessorio: "Acessórios",
};

export const rotuloSituacao: Record<Situacao, string> = {
  disponivel: "Disponível",
  reservada: "Reservada",
  vendida: "Vendida",
};
