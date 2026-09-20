# Marquesa — A Loja da Beleza (MVP visual)

Protótipo navegável de e-commerce para a Marquesa, construído a partir do brand system fornecido para validar identidade, descoberta de produtos e jornada de compra em celular e desktop.

## Executar

Requer Node.js 20 ou superior. Não há dependências para instalar.

```bash
npm run dev
```

Abra `http://localhost:4173`. Para conferir a sintaxe:

```bash
npm run check
```

O projeto também pode ser publicado como site estático. As páginas internas usam rotas com `#`, então funcionam sem configuração de redirecionamento no servidor.

## Direção visual

No desktop, o header usa a logo horizontal fornecida pela Marquesa, centralizada acima da navegação. No celular, permanece a marca textual do header original. Os títulos usam Bodoni Moda, os textos de interface usam DM Sans e a marca textual do celular conserva Cormorant Garamond. As fontes estão incluídas em `assets/fonts` com suas licenças OFL, para que a aparência não dependa do carregamento do Google Fonts.

A imagem principal da página inicial foi criada para o protótipo e fica em `assets/hero-marquesa-campanha.webp`.

## O que funciona

- Página inicial e navegação responsiva.
- Catálogo com busca, categorias e ordenação.
- Detalhe de produto.
- Favoritos e carrinho salvos no navegador.
- Checkout de demonstração e confirmação local.
- Acesso ao Instagram oficial informado pelo cliente.

## Dados e limites

Os 12 produtos, nomes, preços e imagens de produto são **exemplos fictícios** para avaliação visual. As imagens editoriais foram geradas para este protótipo. O logo foi fornecido pelo cliente. Nenhum botão cobra, envia pedido, consulta estoque real ou calcula frete. Não há backend, autenticação nem integração de WhatsApp porque o número oficial não foi fornecido.

Antes de uma operação real, substituir o catálogo e as imagens pelos materiais oficiais, definir políticas e logística, implementar pagamentos e estoque com validação no servidor e homologar a jornada ponta a ponta.

O plano inicial permanece em [PLANO_MVP_VISUAL.md](./PLANO_MVP_VISUAL.md).
