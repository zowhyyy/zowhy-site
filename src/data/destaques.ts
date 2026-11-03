// Looks do lookbook (carrossel do topo da página inicial).
// • imagem: caminho da foto em /public (ex.: "/lookbook/look-01.jpg"). Sem imagem, aparece um placeholder.
// • posicao: qual parte da foto fica no centro do corte, como no CSS object-position.
//   "30% 40%" = 30% da esquerda, 40% do topo. Ajuste se a roupa ficar cortada ou atrás do vidro.
// • pecas: slugs de produtos.ts das peças que aparecem no look (viram os cards do painel).
// • tema: "claro" (fundo cinza-claro) ou "escuro" (fundo grafite, texto branco).

export interface Destaque {
  id: string;
  apoio: string;
  titulo: string;
  texto: string;
  botao: { rotulo: string; href: string; externo?: boolean };
  imagem?: string;
  posicao?: string;
  pecas: string[];
  tema: "claro" | "escuro";
}

export const destaques: Destaque[] = [
  {
    id: "drop-03",
    apoio: "Drop 03 no ar",
    titulo: "Frio de garimpo",
    texto: "Jaquetas, moletons e jeans para as noites que começam a esfriar.",
    botao: { rotulo: "Ver o drop", href: "/loja?drop=drop-03" },
    imagem: "/lookbook/look-01.jpg",
    posicao: "35% 35%",
    pecas: ["jaqueta-jeans-levis-90s", "moletom-carhartt-cinza", "calca-cargo-bege"],
    tema: "claro",
  },
  {
    id: "grife",
    apoio: "Logo à mostra",
    titulo: "Grife por preço de brechó",
    texto: "Diesel, Lacoste, Tommy Hilfiger e outras marcas, bem abaixo do preço da loja.",
    botao: { rotulo: "Ver grifes", href: "/loja?estilo=grife" },
    imagem: "/lookbook/look-02.jpg",
    posicao: "25% 45%",
    pecas: ["jaqueta-couro-diesel", "bolsa-tiracolo-tommy", "polo-lacoste-verde"],
    tema: "escuro",
  },
  {
    id: "unicas",
    apoio: "Como funciona",
    titulo: "Uma peça de cada",
    texto: "Não tem reposição: quem paga primeiro leva. Os drops são avisados primeiro no Instagram.",
    botao: { rotulo: "Seguir @zowhyknows", href: "https://instagram.com/zowhyknows", externo: true },
    imagem: "/lookbook/look-03.jpg",
    posicao: "25% 55%",
    pecas: ["tenis-adidas-samba", "jaqueta-jeans-levis-90s", "polo-lacoste-verde"],
    tema: "claro",
  },
];
