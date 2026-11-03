// Pedido simulado: guardado no navegador só para mostrar a página de confirmação.
// Na versão final, o pedido é criado no servidor junto com o pagamento.

export interface Pedido {
  numero: string;
  criadoEm: string;
  cliente: { nome: string; email: string };
  itens: { slug: string; nome: string; marca: string; tamanho: string; preco: number }[];
  subtotal: number;
  frete: { tipo: string; valor: number; prazo: string };
  pagamento: { metodo: "pix" | "cartao"; parcelas: number; valorParcela: number; comJuros: boolean };
  total: number;
}

export const CHAVE_PEDIDO = "closet-zowhy-pedido";
