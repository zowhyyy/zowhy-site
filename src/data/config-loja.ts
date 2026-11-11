// Configurações gerais da loja: contatos, regras de pagamento e tabela de frete.

export const loja = {
  /** Nome provisório até a logo definitiva. Para trocar a logo, edite o componente Logo em Cabecalho.tsx. */
  nome: "ZOWHY",
  instagram: "zowhyknows",
  instagramUrl: "https://instagram.com/zowhyknows",
  /** Abre a DM do Instagram direto na conversa com o brechó. */
  dmUrl: "https://ig.me/m/zowhyknows",
  email: "zowhybrecho@gmail.com",

  /**
   * Músicas do site, tocadas pelo player oficial do SoundCloud, na ordem da lista.
   * Só começam quando a pessoa aperta o play; quando uma acaba entra a próxima, e no fim a lista recomeça.
   * faixaId: o número da faixa no link de incorporar do SoundCloud (api.soundcloud.com/tracks/NÚMERO).
   */
  musicas: [
    { faixaId: "1733641473", titulo: "speed up", artista: "met2night", link: "https://soundcloud.com/cloudysrdy/speed-up" },
    { faixaId: "794883727", titulo: "SAD B!TCH", artista: "CLIP", link: "https://soundcloud.com/hexgrl/sad-b-tch" },
  ],

  /** Cursor do mouse: "vidro" (bolinha de vidro que envolve os botões) ou "faca" (pixel art, o original). */
  cursor: "faca" as "vidro" | "faca",

  /** Mensagens que giram na barra fina do topo do site. */
  avisos: [
    "Peças únicas: uma de cada, sem reposição",
    "Envio para todo o Brasil pelos Correios",
    "Pagando no Pix você ganha desconto",
    "Até 10x sem juros em compras a partir de R$ 300",
    "Os drops são avisados primeiro no @zowhyknows",
  ],

  /**
   * Popup de cadastro que aparece na primeira visita.
   * • ativo: false esconde o popup.
   * • reaparecerEmDias: se a pessoa fechar sem cadastrar, ele volta depois desse tempo.
   * • listaConectada: enquanto não houver um serviço de e-mail ligado (ex.: Brevo, Mailchimp),
   *   o e-mail NÃO é salvo e o popup avisa isso e manda para o Instagram.
   */
  cadastro: {
    ativo: true,
    reaparecerEmDias: 7,
    listaConectada: false,
  },

  /** As contas de cliente ainda não existem. A página /entrar é só a interface, pronta para ligar. */
  contasAtivas: false,

  pagamento: {
    /** 0.155 = 15,5% de desconto no Pix (sobre as peças, não sobre o frete). */
    descontoPix: 0.155,
    /** Valor mínimo das peças para liberar o parcelamento no cartão. */
    parcelamentoMinimo: 300,
    parcelasSemJuros: 10,
    /** Acima de parcelasSemJuros, até este número, com juros. */
    parcelasMaximas: 12,
    /** Juros ao mês aplicados nas parcelas com juros (0.0199 = 1,99% a.m.). */
    jurosMensal: 0.0199,
  },

  // FRETE SIMULADO. Na versão final, troque por uma integração com os Correios ou o Melhor Envio.
  // A chave é o primeiro dígito do CEP de destino.
  frete: {
    "0": { regiao: "São Paulo (capital e região)", pac: 19.9, sedex: 32.9, prazoPac: "4 a 6 dias úteis", prazoSedex: "1 a 2 dias úteis" },
    "1": { regiao: "Interior de São Paulo", pac: 22.9, sedex: 36.9, prazoPac: "5 a 7 dias úteis", prazoSedex: "2 a 3 dias úteis" },
    "2": { regiao: "Rio de Janeiro e Espírito Santo", pac: 26.9, sedex: 44.9, prazoPac: "6 a 8 dias úteis", prazoSedex: "2 a 4 dias úteis" },
    "3": { regiao: "Minas Gerais", pac: 26.9, sedex: 44.9, prazoPac: "6 a 8 dias úteis", prazoSedex: "2 a 4 dias úteis" },
    "4": { regiao: "Bahia e Sergipe", pac: 34.9, sedex: 59.9, prazoPac: "8 a 12 dias úteis", prazoSedex: "3 a 5 dias úteis" },
    "5": { regiao: "Pernambuco, Alagoas, Paraíba e Rio Grande do Norte", pac: 36.9, sedex: 62.9, prazoPac: "9 a 13 dias úteis", prazoSedex: "3 a 6 dias úteis" },
    "6": { regiao: "Norte, Ceará, Piauí e Maranhão", pac: 39.9, sedex: 69.9, prazoPac: "10 a 15 dias úteis", prazoSedex: "4 a 7 dias úteis" },
    "7": { regiao: "Centro-Oeste, Tocantins e Rondônia", pac: 32.9, sedex: 54.9, prazoPac: "7 a 11 dias úteis", prazoSedex: "3 a 5 dias úteis" },
    "8": { regiao: "Paraná e Santa Catarina", pac: 27.9, sedex: 46.9, prazoPac: "6 a 9 dias úteis", prazoSedex: "2 a 4 dias úteis" },
    "9": { regiao: "Rio Grande do Sul", pac: 29.9, sedex: 49.9, prazoPac: "7 a 10 dias úteis", prazoSedex: "3 a 5 dias úteis" },
  } as Record<string, { regiao: string; pac: number; sedex: number; prazoPac: string; prazoSedex: string }>,
};
