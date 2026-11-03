import { loja } from "@/data/config-loja";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatarPreco(valor: number) {
  return brl.format(valor);
}

const arredondar = (v: number) => Math.round(v * 100) / 100;

/** Preço das peças com o desconto do Pix. */
export function precoNoPix(valor: number) {
  return arredondar(valor * (1 - loja.pagamento.descontoPix));
}

/** "15,5%" */
export const textoDescontoPix = `${(loja.pagamento.descontoPix * 100).toLocaleString("pt-BR")}%`;

export interface OpcaoParcela {
  parcelas: number;
  valorParcela: number;
  total: number;
  comJuros: boolean;
}

/**
 * Opções de parcelamento no cartão.
 * @param totalCartao valor cobrado no cartão (peças + frete)
 * @param subtotalPecas valor só das peças, usado para checar o mínimo de parcelamento
 */
export function opcoesParcelamento(totalCartao: number, subtotalPecas: number): OpcaoParcela[] {
  const { parcelamentoMinimo, parcelasSemJuros, parcelasMaximas, jurosMensal } = loja.pagamento;
  if (subtotalPecas < parcelamentoMinimo) {
    return [{ parcelas: 1, valorParcela: totalCartao, total: totalCartao, comJuros: false }];
  }
  const opcoes: OpcaoParcela[] = [];
  for (let n = 1; n <= parcelasMaximas; n++) {
    if (n <= parcelasSemJuros) {
      opcoes.push({ parcelas: n, valorParcela: arredondar(totalCartao / n), total: totalCartao, comJuros: false });
    } else {
      // Tabela Price
      const parcela = (totalCartao * jurosMensal) / (1 - Math.pow(1 + jurosMensal, -n));
      opcoes.push({ parcelas: n, valorParcela: arredondar(parcela), total: arredondar(parcela * n), comJuros: true });
    }
  }
  return opcoes;
}

/** Texto curto de parcelamento para mostrar junto do preço de uma peça. */
export function resumoParcelamento(preco: number): string | null {
  const { parcelamentoMinimo, parcelasSemJuros } = loja.pagamento;
  if (preco < parcelamentoMinimo) return null;
  return `ou ${parcelasSemJuros}x de ${formatarPreco(preco / parcelasSemJuros)} sem juros`;
}

export interface OpcaoFrete {
  tipo: "PAC" | "SEDEX";
  valor: number;
  prazo: string;
}

/** Frete simulado pela tabela em config-loja.ts. Retorna null se o CEP for inválido. */
export function calcularFrete(cep: string): { regiao: string; opcoes: OpcaoFrete[] } | null {
  const digitos = cep.replace(/\D/g, "");
  if (digitos.length !== 8) return null;
  const linha = loja.frete[digitos[0]];
  if (!linha) return null;
  return {
    regiao: linha.regiao,
    opcoes: [
      { tipo: "PAC", valor: linha.pac, prazo: linha.prazoPac },
      { tipo: "SEDEX", valor: linha.sedex, prazo: linha.prazoSedex },
    ],
  };
}
