# Marquesa Loja da Beleza — plano do MVP visual

**Estado:** em execução, 20/09/2026. O brand system e o logo foram fornecidos pelo cliente. Catálogo e operação ainda precisam ser confirmados. O perfil público informado não pôde ser inspecionado de forma confiável nesta análise.

## 1. Objetivo

Criar uma vitrine de beleza responsiva, rápida e fácil de comprar, com uma jornada navegável do primeiro contato à confirmação de um pedido demonstrativo. A primeira entrega é um **MVP visual interativo**: serve para validar marca, navegação, conteúdo e experiência de compra antes de integrar pagamentos, estoque e operação real.

### Posicionamento fornecido

Uma loja de beleza contemporânea, acolhedora e curada, com “beleza com um toque de realeza” e sofisticação acessível. A direção editorial deve dar protagonismo aos produtos, mostrar resultados e facilitar a escolha. Usar o roxo, rosa suave, creme e logo fornecidos, sem criar outra identidade.

## 2. O que aprendemos com o Real Mercado

O projeto vizinho `RealMercadoWebAPP` usa Next.js, React, TypeScript e Tailwind. Já organiza catálogo e categorias, busca, cards, carrinho, checkout, conta, pedidos e painel administrativo. Esses **fluxos e padrões** são uma referência útil para acelerar a Marquesa.

O modelo atual de produto contempla nome, marca, tags, preço, estoque, uma imagem principal e categoria/subcategoria. Um catálogo de beleza pode exigir campos adicionais: tom/cor, volume, variação, composição, modo de uso e restrições. É uma decisão de produto a confirmar com o catálogo real.

O Real Mercado registra status **No-Go para produção**. A Marquesa não deve herdar como prontas as integrações de pagamento, estoque, entrega ou autenticação. Para o MVP visual, usar dados de demonstração e fluxos claramente simulados.

## 3. Experiência proposta

| Tela | Conteúdo e interação essencial |
| --- | --- |
| Início | Hero com proposta da marca, atalhos de categoria, novidades, mais vendidos, kits/rotinas, conteúdo social autorizado e benefícios reais da loja. |
| Categoria e busca | Grade de produtos, busca visível, filtros adequados ao catálogo (marca, preço, tipo, necessidade, tom), ordenação e estados vazios. |
| Produto | Galeria, preço, variações quando existirem, disponibilidade demonstrativa, descrição clara, modo de uso e CTA de adicionar ao carrinho. |
| Carrinho | Edição de quantidade, remoção, resumo de valores demonstrativos e caminho direto ao checkout. |
| Checkout demonstrativo | Dados essenciais, opção de entrega/retirada conforme decisão comercial, resumo e confirmação sem cobrança real. |
| Confirmação | Resumo do pedido de demonstração e próximos passos claros. |

**Mobile primeiro:** navegação curta, busca acessível, filtros fáceis de usar, botões de compra grandes e feedback imediato após adicionar ao carrinho. No desktop, explorar espaço editorial sem prejudicar a rapidez da compra.

**Direção visual:** Cormorant Garamond nos títulos e DM Sans na interface; roxo `#59458B`, rosa `#C28FA1`, creme `#FAF5F6`; fundos claros e áreas de respiro; fotografia de produto consistente; imagens de textura/uso apenas onde ajudam a escolher. Microinterações discretas, com respeito à preferência por movimento reduzido. Evitar copiar a identidade escura e a linguagem de supermercado do Real Mercado.

## 4. Escopo e prioridades

### P0 — necessário para apresentar o MVP

- Aplicação consistente do brand system e do logo fornecidos.
- Catálogo de demonstração com cerca de 12 a 20 produtos reais ou autorizados, imagens e preços revisados.
- As seis telas acima conectadas, navegação responsiva e carrinho interativo local.
- Estados de carregamento, vazio e erro; acessibilidade básica; contraste e legibilidade.
- Aviso explícito no checkout de que o fluxo é demonstrativo, caso o protótipo seja compartilhado publicamente.

### P1 — depois da validação visual

- Filtros específicos por necessidade/rotina, combinações de produtos e avaliações reais autorizadas.
- Conteúdo editorial leve: dicas, guias de uso e kits selecionados.
- Medição de cliques, busca, visualização de produto, adição ao carrinho e início de checkout.

### Fora do MVP visual

Cobrança real, conciliação, cálculo de frete, baixa de estoque, emissão fiscal, login obrigatório e painel operacional. Esses itens pertencem a uma etapa de e-commerce transacional com regras e homologação próprias.

## 5. Sequência de execução

1. **Descoberta e insumos:** confirmar público, sortimento, diferenciais, área de atendimento, políticas e referências da marca.
2. **Arquitetura da informação:** fechar categorias, filtros e jornada principal de compra.
3. **Wireframes:** definir hierarquia das telas em mobile e desktop e revisar a navegação.
4. **Sistema visual:** fechar paleta, tipografia, cards, botões, ícones, fotografia e componentes reutilizáveis.
5. **Protótipo navegável:** implementar as seis telas com dados demonstrativos e estados de interface.
6. **Revisão:** testar em celular e desktop, conferir conteúdo/preço/imagens, corrigir atritos e obter aprovação da direção visual.

**Critério de aceite:** uma pessoa consegue sair da página inicial, encontrar um produto, entender suas informações, adicioná-lo ao carrinho e concluir um pedido de demonstração sem explicação externa. O fluxo deve funcionar em telas pequenas e grandes, sem links quebrados e sem elementos que sugiram uma compra real quando ainda não houver operação habilitada.

## 6. Decisões e materiais pedidos à Marquesa

### Para começar o visual

1. **O que vende e para quem:** maquiagem, cabelo, skincare, perfumaria, produtos profissionais ou mistura? Qual é o público principal?
2. **Marca:** o brand system e uma imagem do logo já foram recebidos. Para finalizar, seriam úteis o arquivo vetorial ou PNG em alta resolução e 3 a 5 referências de lojas cujo visual agrada.
3. **Catálogo inicial:** 12 a 20 produtos prioritários com nome, categoria, marca, preço, fotos, variações e descrição; indicar os campeões de venda.
4. **Material do Instagram:** capturas da bio, destaques e publicações representativas, ou acesso a um portfólio de imagens autorizado. Confirmar permissão de uso de fotos, vídeos, depoimentos e avaliações.

### Para desenhar a operação futura

5. **Atendimento e entrega:** cidade/região, retirada em loja, envio nacional/local, prazo, frete e canal de suporte.
6. **Compra real:** intenção de cobrar no site ou encaminhar para WhatsApp inicialmente; meios de pagamento, política de trocas e dados institucionais.
7. **Gestão:** quem atualiza produtos/preços/estoque e se existe plataforma/ERP atual a integrar.

## 7. Decisão técnica preliminar

Criar a Marquesa como projeto próprio nesta pasta. Reaproveitar ideias e, quando fizer sentido, componentes adaptados do Real Mercado com revisão de design e dependências. Manter o protótipo independente de banco, credenciais e integrações reais. Depois da validação, decidir se a operação usará uma plataforma pronta de e-commerce ou um backend próprio, conforme volume do catálogo, logística, integrações e orçamento.
