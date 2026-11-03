import type { Drop } from "@/lib/tipos";

// Cada drop é um lançamento de peças. O de maior número é o "drop atual" mostrado na página inicial.
export const drops: Drop[] = [
  {
    slug: "drop-03",
    numero: 3,
    nome: "Frio de garimpo",
    data: "2026-10-30",
    descricao: "Jaquetas, moletons e jeans para as noites que começam a esfriar.",
  },
  {
    slug: "drop-02",
    numero: 2,
    nome: "Logo à mostra",
    data: "2026-10-09",
    descricao: "Peças de grife com a marca bem à vista.",
  },
  {
    slug: "drop-01",
    numero: 1,
    nome: "Primeiro garimpo",
    data: "2026-09-18",
    descricao: "As peças que abriram o brechó.",
  },
];
