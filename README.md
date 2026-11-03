# Closet Zowhy

Site do brechó Closet Zowhy, feito com Next.js 15 (App Router), TypeScript e Tailwind CSS 4.

> **Versão de teste.** O pagamento e o frete são simulados: nenhum valor é cobrado.

## Rodar no computador

```bash
npm install
npm run dev      # abre em http://localhost:3000
npm run build    # confere se está tudo certo antes de publicar
```

## Onde editar cada coisa

| O quê | Arquivo |
|---|---|
| Peças (preço, tamanho, medidas, estado, descrição, marca, vendida…) | `src/data/produtos.ts` |
| Drops (número, nome, data) | `src/data/drops.ts` |
| Instagram, e-mail, desconto do Pix, parcelamento e tabela de frete | `src/data/config-loja.ts` |
| Cores | `src/app/globals.css` (bloco `@theme`) |
| Fonte | `src/app/layout.tsx` |
| Textos das páginas Sobre e Como comprar | `src/app/sobre/page.tsx`, `src/app/como-comprar/page.tsx` |

### Peça vendida
Em `produtos.ts`, mude `situacao: "disponivel"` para `situacao: "vendida"`. A foto fica em preto e branco, ganha o carimbo "Vendida" e a peça vai sozinha para o fim da lista.
Use `"reservada"` enquanto alguém estiver pagando.

### Fotos
1. Crie a pasta `public/images/produtos/<slug-da-peca>/` e salve as fotos nela (de preferência .jpg ou .webp, na proporção 4:5, com uns 1200 × 1500 px).
2. Liste as fotos na peça: `fotos: ["/images/produtos/<slug>/1.jpg", "/images/produtos/<slug>/2.jpg"]`. A primeira é a capa.

Enquanto `fotos` estiver vazio, o site mostra uma imagem provisória.

## Regras de pagamento (em `config-loja.ts`)
- Pix: 15,5% de desconto sobre as peças (o frete não tem desconto).
- Cartão: até 10x sem juros quando as peças somam R$ 300 ou mais. De 11x a 12x, com 1,99% de juros ao mês. Abaixo de R$ 300, o cartão de crédito é aceito, mas só em 1x.

## O que falta para a versão final
- [ ] Integrar o pagamento real (sugestão: Mercado Pago, que tem Pix, cartão e parcelamento) em `src/app/checkout/page.tsx`
- [ ] Marcar a peça como vendida automaticamente quando o pagamento é aprovado. Hoje isso é manual. Para automatizar, as peças precisam sair do arquivo e ir para um banco de dados ou CMS.
- [ ] Calcular o frete pela API dos Correios ou do Melhor Envio (hoje usa a tabela fixa em `config-loja.ts`)
- [ ] Enviar o e-mail de confirmação do pedido
- [ ] Colocar as fotos reais, o logo e os textos definitivos
- [ ] Hospedar (o plano é a Vercel: é só importar o projeto em vercel.com)
