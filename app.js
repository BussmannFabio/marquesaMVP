const INSTAGRAM_URL = 'https://www.instagram.com/marquesalojadabeleza/';
const STORAGE_CART = 'marquesa-demo-cart-v1';
const STORAGE_FAVORITES = 'marquesa-demo-favorites-v1';
const app = document.querySelector('#app');

// Catálogo criado para demonstrar a experiência. Não representa estoque ou preços da loja.
const products = [
  { id: 'serum-luminoso', name: 'Sérum Facial Luminoso', category: 'Skincare', price: 59.9, oldPrice: 74.9, badge: 'Um mimo no preço', sprite: 1, cell: 0, description: 'Uma textura leve para transformar alguns minutos de cuidado em um ritual só seu.' },
  { id: 'batom-rosa-antigo', name: 'Batom Rosa Antigo', category: 'Maquiagem', price: 39.9, badge: 'Mais querido', sprite: 1, cell: 1, description: 'Um toque de cor delicado para acompanhar todos os seus momentos.' },
  { id: 'shampoo-lavanda', name: 'Shampoo Ritual Lavanda', category: 'Cabelos', price: 48.9, sprite: 1, cell: 2, description: 'Um convite para tornar a hora de cuidar dos cabelos ainda mais especial.' },
  { id: 'perfume-floral', name: 'Perfume Floral Delicado', category: 'Perfumaria', price: 119.9, badge: 'Destaque', sprite: 1, cell: 3, description: 'Uma inspiração floral suave para deixar sua marca por onde passar.' },
  { id: 'creme-facial', name: 'Creme Facial Conforto', category: 'Skincare', price: 69.9, sprite: 2, cell: 0, description: 'Cuidado de textura macia para uma pausa de autocuidado na rotina.' },
  { id: 'mascara-cilios', name: 'Máscara de Cílios Essencial', category: 'Maquiagem', price: 44.9, oldPrice: 54.9, sprite: 2, cell: 1, description: 'O toque final que valoriza o olhar com praticidade.' },
  { id: 'sabonete-facial', name: 'Gel de Limpeza Facial', category: 'Skincare', price: 42.9, sprite: 2, cell: 2, description: 'Um começo leve e agradável para o seu ritual de cuidado.' },
  { id: 'hidratante-corporal', name: 'Loção Corporal Rosé', category: 'Corpo', price: 52.9, sprite: 2, cell: 3, description: 'Um momento de carinho para a pele, todos os dias.' },
  { id: 'paleta-olhos', name: 'Paleta de Sombras Essencial', category: 'Maquiagem', price: 89.9, badge: 'Destaque', sprite: 3, cell: 0, description: 'Tons suaves e versáteis para criar looks do seu jeito.' },
  { id: 'creme-maos', name: 'Creme para Mãos Suave', category: 'Corpo', price: 29.9, sprite: 3, cell: 1, description: 'Um pequeno gesto de cuidado para levar com você.' },
  { id: 'bruma-facial', name: 'Bruma Facial de Lavanda', category: 'Skincare', price: 49.9, sprite: 3, cell: 2, description: 'Uma pausa refrescante para sentir a beleza da sua rotina.' },
  { id: 'body-splash', name: 'Body Splash Floral', category: 'Perfumaria', price: 64.9, sprite: 3, cell: 3, description: 'Uma inspiração delicada para perfumar os seus dias.' },
];

const categories = ['Todos', 'Skincare', 'Maquiagem', 'Cabelos', 'Perfumaria', 'Corpo'];
const productById = new Map(products.map((product) => [product.id, product]));
const state = {
  cart: readStore(STORAGE_CART, {}),
  favorites: readStore(STORAGE_FAVORITES, []),
  cartOpen: false,
  menuOpen: false,
  searchOpen: false,
  demoComplete: false,
  toastTimer: null,
};

function readStore(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value && typeof value === 'object' ? value : fallback;
  } catch {
    return fallback;
  }
}

function saveStore(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* O protótipo segue funcional sem armazenamento. */ }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function currency(amount) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
}

function icon(name, className = '') {
  return `<svg class="icon ${className}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
}

function route() {
  const raw = location.hash.slice(1) || '/';
  const [path, query = ''] = raw.split('?');
  return { path: path.startsWith('/') ? path : '/', params: new URLSearchParams(query) };
}

function go(hash) {
  if (location.hash === hash) render(true);
  else location.hash = hash;
}

function cartEntries() {
  return Object.entries(state.cart)
    .map(([id, quantity]) => ({ product: productById.get(id), quantity: Number(quantity) }))
    .filter(({ product, quantity }) => product && Number.isInteger(quantity) && quantity > 0);
}

function cartCount() { return cartEntries().reduce((sum, item) => sum + item.quantity, 0); }
function cartTotal() { return cartEntries().reduce((sum, item) => sum + item.product.price * item.quantity, 0); }
function favoriteIds() { return Array.isArray(state.favorites) ? state.favorites.filter((id) => productById.has(id)) : []; }

function art(product, extraClass = '') {
  const positions = ['0% 0%', '100% 0%', '0% 100%', '100% 100%'];
  return `<div class="product-art ${extraClass}" role="img" aria-label="Imagem ilustrativa de ${escapeHtml(product.name)}" style="--sprite:url('./assets/produtos-${product.sprite}.webp');--sprite-position:${positions[product.cell]};background-image:url('./assets/produtos-${product.sprite}.webp');background-size:200% 200%;background-position:${positions[product.cell]}"></div>`;
}

function header() {
  const { path, params } = route();
  const category = params.get('categoria') || 'Todos';
  const showShortcuts = path === '/' || path === '/catalogo';
  const shortcuts = ['Todos', 'Maquiagem', 'Skincare', 'Cabelos', 'Perfumaria'];
  return `<div class="announcement"><span class="announcement-desktop">Sua rotina de beleza começa aqui <span aria-hidden="true">✦</span> Catálogo demonstrativo</span><span class="announcement-mobile">Marquesa · catálogo demonstrativo</span></div>
    <header class="site-header">
      <div class="container header-inner">
        <button class="icon-button mobile-menu-button" type="button" data-action="toggle-menu" aria-label="${state.menuOpen ? 'Fechar menu' : 'Abrir menu'}" aria-expanded="${state.menuOpen}" ${state.menuOpen ? 'aria-controls="mobile-navigation"' : ''}>${icon(state.menuOpen ? 'close' : 'menu')}</button>
        <a class="brand" href="#/" aria-label="Marquesa, voltar ao início"><img src="./assets/marquesa-logo-desktop.webp" alt="Marquesa — A Loja da Beleza" width="1057" height="636" /><span class="brand-wordmark" aria-hidden="true"><strong>Marquesa</strong><small>A Loja da Beleza</small></span></a>
        <nav class="site-nav" aria-label="Navegação principal">
          <a href="#/">Início</a><a href="#/catalogo">Todos os produtos</a><a href="#/catalogo?categoria=Maquiagem">Maquiagem</a><a href="#/catalogo?categoria=Skincare">Skincare</a><a href="#/catalogo?categoria=Perfumaria">Perfumaria</a>
        </nav>
        <div class="header-actions">
          <button class="icon-button desktop-search-button" type="button" data-action="toggle-search" aria-label="Abrir busca" aria-expanded="${state.searchOpen}">${icon('search')}</button>
          <a class="icon-button favorites-link" href="#/favoritos" aria-label="Favoritos${favoriteIds().length ? `, ${favoriteIds().length} produtos` : ''}">${icon('heart')}<span class="action-label">Favoritos</span></a>
          <button class="icon-button bag-button" type="button" data-action="open-cart" aria-label="Abrir carrinho com ${cartCount()} ${cartCount() === 1 ? 'produto' : 'produtos'}">${icon('bag')}<span class="action-label">Carrinho</span>${cartCount() ? `<span class="cart-count">${cartCount()}</span>` : ''}</button>
        </div>
      </div>
      <form class="mobile-search container" data-form="search" role="search"><label class="sr-only" for="mobile-search-input">Buscar produtos</label><div class="mobile-search-field">${icon('search')}<input id="mobile-search-input" name="q" type="search" placeholder="Busque seus favoritos" autocomplete="off" required /><button type="submit" aria-label="Buscar produtos">${icon('arrow')}</button></div></form>
      ${state.searchOpen ? `<form class="header-search container" data-form="search" role="search"><label for="header-search-input">O que você está procurando?</label><div class="search-row"><input id="header-search-input" name="q" type="search" placeholder="Buscar produtos de beleza" autocomplete="off" required /><button class="button button-primary" type="submit">Buscar</button></div></form>` : ''}
      ${state.menuOpen ? `<nav class="mobile-nav" id="mobile-navigation" aria-label="Menu mobile"><div class="mobile-nav-intro"><span class="eyebrow">Explore a Marquesa</span><strong>Beleza para cada momento</strong></div><a class="mobile-nav-feature" href="#/catalogo">Ver todos os produtos ${icon('arrow')}</a><span class="mobile-nav-label">Categorias</span><div class="mobile-nav-grid">${categories.slice(1).map((item) => `<a href="#/catalogo?categoria=${encodeURIComponent(item)}">${item} ${icon('arrow')}</a>`).join('')}</div><div class="mobile-nav-utility"><a href="#/favoritos">${icon('heart')} Favoritos</a><a href="#/carrinho">${icon('bag')} Meu carrinho</a></div></nav>` : ''}
    </header>
    ${state.menuOpen ? '<button class="nav-backdrop" type="button" tabindex="-1" data-action="close-menu" aria-label="Fechar menu"></button>' : ''}
    ${showShortcuts ? `<nav class="mobile-shortcuts" aria-label="Categorias rápidas"><div class="container mobile-shortcuts-inner">${shortcuts.map((item) => `<a href="#/catalogo${item === 'Todos' ? '' : `?categoria=${encodeURIComponent(item)}`}" ${path === '/catalogo' && category === item ? 'aria-current="page"' : ''}>${item === 'Todos' ? 'Ver tudo' : item}</a>`).join('')}</div></nav>` : ''}`;
}

function footer() {
  return `<footer class="site-footer"><div class="container footer-main">
    <div class="footer-brand"><img src="./assets/marquesa-logo.png" alt="Marquesa — A Loja da Beleza" /><p>Beleza com um toque de realeza. Um espaço para descobrir o que faz sentido para você.</p></div>
    <div><h2>Explore</h2><a href="#/catalogo">Todos os produtos</a><a href="#/catalogo?categoria=Maquiagem">Maquiagem</a><a href="#/catalogo?categoria=Skincare">Skincare</a><a href="#/favoritos">Seus favoritos</a><a href="#/carrinho">Meu carrinho</a></div>
    <div><h2>Conecte-se</h2><a href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer">${icon('instagram')} Instagram oficial</a><p>As novidades da Marquesa estão nas redes.</p></div>
    </div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} Marquesa — A Loja da Beleza</span><span>Protótipo visual com catálogo e valores ilustrativos.</span></div></footer>`;
}

function productCard(product) {
  const saved = favoriteIds().includes(product.id);
  return `<article class="product-card">
    <div class="product-card-media"><a href="#/produto/${product.id}" aria-label="Ver ${escapeHtml(product.name)}">${art(product)}</a>
      ${product.badge ? `<span class="badge">${escapeHtml(product.badge)}</span>` : ''}
      <button class="favorite-button ${saved ? 'is-active' : ''}" type="button" data-action="favorite" data-id="${product.id}" aria-label="${saved ? 'Remover dos' : 'Adicionar aos'} favoritos: ${escapeHtml(product.name)}" aria-pressed="${saved}">${icon('heart')}</button>
    </div>
    <div class="product-info"><span class="product-category">${escapeHtml(product.category)}</span><h3><a href="#/produto/${product.id}">${escapeHtml(product.name)}</a></h3><div class="product-pricing"><strong class="price">${currency(product.price)}</strong>${product.oldPrice ? `<del class="old-price">${currency(product.oldPrice)}</del>` : ''}</div>
      <button class="button button-secondary product-add" type="button" data-action="add-cart" data-id="${product.id}">Adicionar ao carrinho ${icon('plus')}</button></div>
  </article>`;
}

function productGrid(items) { return `<div class="product-grid">${items.map(productCard).join('')}</div>`; }

function sectionHeading(eyebrow, title, description, link = '') {
  return `<div class="section-heading"><div><span class="eyebrow">${eyebrow}</span><h2>${title}</h2>${description ? `<p>${description}</p>` : ''}</div>${link ? `<a class="text-link" href="${link}">Ver todos ${icon('arrow')}</a>` : ''}</div>`;
}

function home() {
  const featured = [products[0], products[1], products[3], products[8]];
  const categoryArt = [products[0], products[1], products[2], products[3], products[7]];
  return `<main id="main-content" data-view="home">
    <section class="hero"><div class="hero-media"><img src="./assets/hero-marquesa-campanha.webp" alt="Retrato editorial de mulher com maquiagem suave em tons de rosa e roxo" width="1672" height="941" fetchpriority="high" /></div><div class="container hero-inner"><div class="hero-content"><span class="eyebrow">Beleza com um toque de realeza</span><h1>Seu brilho<br /><em>é só seu.</em></h1><p>Da rotina ao toque final, encontre produtos para viver a beleza do seu jeito.</p><div class="hero-actions"><a class="button button-primary" href="#/catalogo">Explorar produtos ${icon('arrow')}</a><a class="hero-secondary" href="#/catalogo?categoria=Maquiagem">Descobrir maquiagem ${icon('arrow')}</a></div></div></div></section>
    <section class="section categories-section"><div class="container">${sectionHeading('Encontre o seu ritual', 'Beleza em cada detalhe', 'Escolha por onde começar e descubra seus novos favoritos.')}
      <div class="category-grid">${categories.slice(1).map((category, index) => `<a class="category-card" href="#/catalogo?categoria=${encodeURIComponent(category)}">${art(categoryArt[index], 'category-art')}<span class="category-card-content"><strong>${category}</strong><span>Explorar ${icon('arrow')}</span></span></a>`).join('')}</div></div></section>
    <section class="section featured-section"><div class="container">${sectionHeading('Curadoria Marquesa', 'Achadinhos para você', 'Inspirações para uma rotina cheia de pequenos momentos especiais.', '#/catalogo')}${productGrid(featured)}</div></section>
    <section class="section story-section"><div class="container story-layout"><div class="story-image"><img src="./assets/ritual-beleza.webp" alt="Cena editorial ilustrativa de autocuidado e beleza" /></div><div class="story-content"><span class="eyebrow">O prazer de se cuidar</span><h2>Um ritual que é só seu.</h2><p>Da primeira escolha ao toque final, a beleza também vive nos detalhes. Encontre produtos que acompanham o seu jeito de ser.</p><a class="button button-primary" href="#/catalogo?categoria=Skincare">Descobrir cuidados ${icon('arrow')}</a></div></div></section>
    <section class="section favorites-section"><div class="container">${sectionHeading('Para se inspirar', 'Favoritos da sua nécessaire', 'Uma seleção de produtos que combina com diferentes momentos.', '#/catalogo')}${productGrid([products[4], products[5], products[9], products[11]])}</div></section>
    <section class="social-section"><div class="container social-inner"><div><span class="eyebrow">Siga a Marquesa</span><h2>Inspire-se todos os dias.</h2><p>Veja novidades e ideias de beleza no perfil oficial da loja.</p></div><a class="button button-light" href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer">${icon('instagram')} Ver Instagram</a></div></section>
    <div class="container demo-note">As imagens, descrições e os preços exibidos neste protótipo são ilustrativos.</div>
  </main>`;
}

function catalog() {
  const { params } = route();
  const requestedCategory = params.get('categoria') || 'Todos';
  const category = categories.includes(requestedCategory) ? requestedCategory : 'Todos';
  const query = (params.get('q') || '').trim().slice(0, 100);
  const sort = ['relevancia', 'menor-preco', 'maior-preco', 'nome'].includes(params.get('ordem')) ? params.get('ordem') : 'relevancia';
  const normalizedQuery = query.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  let items = products.filter((product) => (category === 'Todos' || product.category === category) && (!normalizedQuery || `${product.name} ${product.category}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(normalizedQuery)));
  if (sort === 'menor-preco') items.sort((a, b) => a.price - b.price);
  if (sort === 'maior-preco') items.sort((a, b) => b.price - a.price);
  if (sort === 'nome') items.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  return `<main id="main-content" data-view="catalog"><div class="container page-intro"><div class="breadcrumbs"><a href="#/">Início</a><span>/</span><span>Produtos</span></div><span class="eyebrow">Universo Marquesa</span><h1>${category === 'Todos' ? 'Explore a beleza' : escapeHtml(category)}</h1><p>Seus próximos favoritos de beleza podem estar aqui.</p></div>
    <section class="section catalog-section"><div class="container catalog-layout"><aside class="filters" aria-label="Categorias"><h2>Explore por categoria</h2><div class="filter-list">${categories.map((item) => `<a class="filter-chip ${item === category ? 'is-active' : ''}" href="#/catalogo?categoria=${encodeURIComponent(item)}${query ? `&q=${encodeURIComponent(query)}` : ''}" ${item === category ? 'aria-current="page"' : ''}>${item}</a>`).join('')}</div><p class="filter-hint">Uma seleção ilustrativa para apresentar a experiência Marquesa.</p></aside>
      <div class="catalog-main"><form class="catalog-toolbar" data-form="catalog" role="search"><div class="catalog-search"><label for="catalog-query">Buscar produtos</label><div class="input-icon">${icon('search')}<input id="catalog-query" name="q" type="search" value="${escapeHtml(query)}" placeholder="O que você está procurando?" /></div></div><div class="catalog-sort"><label for="catalog-sort">Ordenar por</label><select id="catalog-sort" name="ordem"><option value="relevancia" ${sort === 'relevancia' ? 'selected' : ''}>Relevância</option><option value="menor-preco" ${sort === 'menor-preco' ? 'selected' : ''}>Menor preço</option><option value="maior-preco" ${sort === 'maior-preco' ? 'selected' : ''}>Maior preço</option><option value="nome" ${sort === 'nome' ? 'selected' : ''}>Nome</option></select></div><input type="hidden" name="categoria" value="${escapeHtml(category)}" /><button class="button button-primary catalog-submit" type="submit">Aplicar</button></form>
      <div class="catalog-results"><p>${items.length} ${items.length === 1 ? 'produto encontrado' : 'produtos encontrados'}${query ? ` para “${escapeHtml(query)}”` : ''}</p><span>Catálogo demonstrativo</span></div>
      ${items.length ? productGrid(items) : `<div class="empty-state">${icon('search')}<h2>Não encontramos esse produto</h2><p>Tente outro termo ou explore todas as categorias.</p><a class="button button-primary" href="#/catalogo">Ver todos os produtos</a></div>`}</div></div></section></main>`;
}

function detail(product) {
  const saved = favoriteIds().includes(product.id);
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  return `<main id="main-content" data-view="detail"><div class="container"><div class="breadcrumbs"><a href="#/">Início</a><span>/</span><a href="#/catalogo?categoria=${encodeURIComponent(product.category)}">${escapeHtml(product.category)}</a><span>/</span><span>${escapeHtml(product.name)}</span></div>
    <section class="product-detail"><div class="detail-gallery">${art(product, 'detail-art')}<p>Imagem ilustrativa do produto</p></div><div class="detail-content"><span class="eyebrow">${escapeHtml(product.category)} · Seleção Marquesa</span><h1>${escapeHtml(product.name)}</h1><p class="detail-lead">${escapeHtml(product.description)}</p><div class="detail-price"><strong>${currency(product.price)}</strong>${product.oldPrice ? `<del>${currency(product.oldPrice)}</del>` : ''}</div><p class="detail-demo">Produto e preço apresentados para demonstração. Disponibilidade e condições reais devem ser confirmadas com a loja.</p>
      <div class="detail-actions"><button class="button button-primary" type="button" data-action="add-cart" data-id="${product.id}">Adicionar ao carrinho ${icon('bag')}</button><button class="favorite-button detail-favorite ${saved ? 'is-active' : ''}" type="button" data-action="favorite" data-id="${product.id}" aria-label="${saved ? 'Remover dos' : 'Adicionar aos'} favoritos: ${escapeHtml(product.name)}" aria-pressed="${saved}">${icon('heart')}</button></div>
      <div class="detail-perks"><div>${icon('sparkle')}<span>Uma escolha para o seu momento de cuidado</span></div><div>${icon('check')}<span>Navegação simples e compra demonstrativa</span></div></div></div></section></div>
    ${related.length ? `<section class="section related-section"><div class="container">${sectionHeading('Continue descobrindo', 'Você também pode gostar', '', '#/catalogo?categoria=' + encodeURIComponent(product.category))}${productGrid(related)}</div></section>` : ''}</main>`;
}

function favorites() {
  const items = favoriteIds().map((id) => productById.get(id));
  return `<main id="main-content" data-view="favorites"><div class="container page-intro"><div class="breadcrumbs"><a href="#/">Início</a><span>/</span><span>Favoritos</span></div><span class="eyebrow">Sua seleção</span><h1>Seus favoritos</h1><p>Guarde os produtos que combinam com você.</p></div><section class="section"><div class="container">${items.length ? productGrid(items) : `<div class="empty-state">${icon('heart')}<h2>Sua lista está esperando seus favoritos</h2><p>Toque no coração dos produtos para guardá-los aqui.</p><a class="button button-primary" href="#/catalogo">Explorar produtos</a></div>`}</div></section></main>`;
}

function cartItem({ product, quantity }) {
  return `<article class="cart-item">${art(product, 'cart-art')}<div class="cart-item-info"><a href="#/produto/${product.id}">${escapeHtml(product.name)}</a><span>${escapeHtml(product.category)}</span><strong>${currency(product.price * quantity)}</strong><div class="cart-item-controls"><div class="quantity-control" aria-label="Quantidade de ${escapeHtml(product.name)}"><button type="button" data-action="decrease" data-id="${product.id}" aria-label="Diminuir quantidade de ${escapeHtml(product.name)}">${icon('minus')}</button><span aria-live="polite">${quantity}</span><button type="button" data-action="increase" data-id="${product.id}" aria-label="Aumentar quantidade de ${escapeHtml(product.name)}">${icon('plus')}</button></div><button class="remove-button" type="button" data-action="remove-cart" data-id="${product.id}" aria-label="Remover ${escapeHtml(product.name)}">${icon('trash')}</button></div></div></article>`;
}

function cartPage() {
  const items = cartEntries();
  return `<main id="main-content" data-view="cart" class="cart-page"><div class="container page-intro"><div class="breadcrumbs"><a href="#/">Início</a><span>/</span><span>Meu carrinho</span></div><span class="eyebrow">Sua seleção</span><h1>Meu carrinho</h1><p>${items.length ? `${cartCount()} ${cartCount() === 1 ? 'item escolhido' : 'itens escolhidos'} para o seu ritual de beleza.` : 'Seu carrinho está esperando seus favoritos.'}</p></div>
    <section class="section"><div class="container">${items.length ? `<div class="cart-page-layout"><div class="cart-page-items"><div class="cart-page-heading"><h2>Produtos selecionados</h2><a class="text-link" href="#/catalogo">Continuar explorando ${icon('arrow')}</a></div>${items.map(cartItem).join('')}</div><aside class="summary-card cart-page-summary"><h2>Resumo da seleção</h2><div class="summary-items"><div><span>Produtos (${cartCount()})</span><strong>${currency(cartTotal())}</strong></div></div><div class="summary-total"><span>Subtotal ilustrativo</span><strong>${currency(cartTotal())}</strong></div><p>Frete e pagamento não são calculados neste protótipo.</p><a class="button button-primary" href="#/checkout">Ir para checkout ${icon('arrow')}</a><span class="summary-note">A próxima etapa é apenas uma simulação; nenhum pedido será enviado.</span></aside></div>` : `<div class="empty-state">${icon('bag')}<h2>Seu carrinho está esperando seus favoritos</h2><p>Explore produtos e escolha os que combinam com você.</p><a class="button button-primary" href="#/catalogo">Explorar produtos</a></div>`}</div></section></main>`;
}

function cartDrawer() {
  if (!state.cartOpen) return '';
  const items = cartEntries();
  return `<div class="drawer-backdrop" data-action="close-cart"></div><aside class="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title"><div class="drawer-header"><div><span class="eyebrow">Sua seleção</span><h2 id="cart-title">Meu carrinho <small>(${cartCount()})</small></h2></div><button class="icon-button" type="button" data-action="close-cart" aria-label="Fechar carrinho">${icon('close')}</button></div>
    ${items.length ? `<div class="drawer-items">${items.map(cartItem).join('')}</div><div class="drawer-footer"><div class="drawer-subtotal"><span>Subtotal</span><strong>${currency(cartTotal())}</strong></div><p>Valores demonstrativos. Entrega e pagamento não são calculados neste protótipo.</p><a class="button button-primary" href="#/carrinho">Ver carrinho ${icon('arrow')}</a><button class="text-button" type="button" data-action="close-cart">Continuar explorando</button></div>` : `<div class="empty-state drawer-empty">${icon('bag')}<h3>Seu carrinho está esperando seus favoritos</h3><p>Explore produtos e escolha os que combinam com você.</p><button class="button button-primary" type="button" data-action="close-cart">Explorar produtos</button></div>`}</aside>`;
}

function checkout() {
  const items = cartEntries();
  if (!items.length) return `<main id="main-content" data-view="checkout"><div class="container page-intro"><span class="eyebrow">Checkout demonstrativo</span><h1>Seu carrinho está vazio</h1><p>Encontre algo especial para começar.</p><a class="button button-primary" href="#/catalogo">Explorar produtos</a></div></main>`;
  return `<main id="main-content" data-view="checkout"><div class="container page-intro"><div class="breadcrumbs"><a href="#/">Início</a><span>/</span><span>Checkout</span></div><span class="eyebrow">Última etapa · Simulação</span><h1>Finalize sua experiência</h1><p>Confira seus itens e experimente o fluxo de compra. Nenhum pedido será enviado.</p></div><div class="container checkout-layout"><form id="checkout-form" class="checkout-form" data-form="checkout"><div class="form-section"><h2>Seus dados</h2><p>Usados apenas nesta simulação; não serão enviados à loja.</p><div class="form-grid"><div class="field"><label for="customer-name">Nome completo *</label><input id="customer-name" name="name" autocomplete="name" maxlength="80" required /></div><div class="field"><label for="customer-email">E-mail *</label><input id="customer-email" name="email" type="email" autocomplete="email" maxlength="120" required /></div><div class="field"><label for="customer-phone">Telefone *</label><input id="customer-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="20" minlength="8" required /></div><div class="field"><label for="customer-city">Cidade *</label><input id="customer-city" name="city" autocomplete="address-level2" maxlength="80" required /></div></div></div><div class="form-section"><h2>Entrega e pagamento</h2><div class="checkout-notice">${icon('lock')}<div><strong>Esta é uma demonstração visual.</strong><p>Não há cálculo de frete, pagamento ou envio de pedido. A loja definirá essas etapas na versão comercial.</p></div></div></div><button class="button button-primary checkout-submit" type="submit">Concluir simulação ${icon('arrow')}</button></form>
    <aside class="summary-card"><h2>Resumo da seleção</h2><div class="summary-items">${items.map(({ product, quantity }) => `<div><span>${quantity}× ${escapeHtml(product.name)}</span><strong>${currency(product.price * quantity)}</strong></div>`).join('')}</div><div class="summary-total"><span>Subtotal ilustrativo</span><strong>${currency(cartTotal())}</strong></div><p>Frete e pagamento indisponíveis no protótipo.</p></aside></div></main>`;
}

function success() {
  let completed = state.demoComplete;
  try { completed = completed || sessionStorage.getItem('marquesa-demo-complete') === 'yes'; } catch { /* Navegação privada. */ }
  return `<main id="main-content" data-view="success"><div class="container success-content">${icon('check')}<span class="eyebrow">Experiência concluída</span><h1>${completed ? 'Sua simulação foi concluída' : 'Conheça a Marquesa'}</h1><p>${completed ? 'Você percorreu o checkout demonstrativo. Nenhum pedido foi enviado e nenhum pagamento foi realizado.' : 'Este é um protótipo visual da experiência de compra.'}</p><a class="button button-primary" href="#/catalogo">Voltar aos produtos ${icon('arrow')}</a></div></main>`;
}

function render(scroll = false) {
  const { path } = route();
  let page;
  if (path === '/') page = home();
  else if (path === '/catalogo') page = catalog();
  else if (path.startsWith('/produto/')) page = productById.has(path.slice(9)) ? detail(productById.get(path.slice(9))) : `<main id="main-content"><div class="container empty-state"><h1>Produto não encontrado</h1><a class="button button-primary" href="#/catalogo">Ver produtos</a></div></main>`;
  else if (path === '/favoritos') page = favorites();
  else if (path === '/carrinho') page = cartPage();
  else if (path === '/checkout') page = checkout();
  else if (path === '/sucesso') page = success();
  else page = `<main id="main-content"><div class="container empty-state"><h1>Esta página não foi encontrada</h1><a class="button button-primary" href="#/">Voltar ao início</a></div></main>`;
  app.innerHTML = `<button class="skip-link" type="button" data-action="skip-content">Pular para o conteúdo</button>${header()}${page}${footer()}${cartDrawer()}<div class="toast" id="app-toast" role="status" aria-live="polite" hidden></div>`;
  app.querySelector('main')?.setAttribute('tabindex', '-1');
  document.body.classList.toggle('has-drawer', state.cartOpen);
  document.body.classList.toggle('has-menu', state.menuOpen);
  document.title = `${path === '/' ? 'Sua rotina de beleza começa aqui' : path === '/catalogo' ? 'Produtos' : path === '/carrinho' ? 'Meu carrinho' : path === '/checkout' ? 'Checkout demonstrativo' : path === '/favoritos' ? 'Favoritos' : path === '/sucesso' ? 'Simulação concluída' : path.startsWith('/produto/') ? productById.get(path.slice(9))?.name || 'Produto' : 'Página'} | Marquesa`;
  for (const element of app.querySelectorAll('.site-header, main, .site-footer, .skip-link, .mobile-shortcuts')) {
    element.inert = state.cartOpen || (state.menuOpen && !element.matches('.site-header'));
  }
  if (scroll) window.scrollTo({ top: 0, behavior: 'auto' });
  if (state.cartOpen) app.querySelector('.cart-drawer [data-action="close-cart"]')?.focus();
}

function toast(message) {
  const element = document.querySelector('#app-toast');
  if (!element) return;
  clearTimeout(state.toastTimer);
  element.textContent = message;
  element.hidden = false;
  state.toastTimer = setTimeout(() => { element.hidden = true; }, 2800);
}

function updateCart(id, delta) {
  if (!productById.has(id)) return;
  const next = Math.max(0, Math.min(99, (Number(state.cart[id]) || 0) + delta));
  if (next) state.cart[id] = next;
  else delete state.cart[id];
  saveStore(STORAGE_CART, state.cart);
  render();
}

app.addEventListener('click', (event) => {
  const action = event.target.closest('[data-action]');
  if (!action) return;
  const { id } = action.dataset;
  switch (action.dataset.action) {
    case 'skip-content': {
      const main = app.querySelector('main');
      main?.setAttribute('tabindex', '-1');
      main?.focus();
      break;
    }
    case 'toggle-menu': {
      state.menuOpen = !state.menuOpen;
      state.searchOpen = false;
      render();
      app.querySelector(state.menuOpen ? '.mobile-nav-feature' : '.mobile-menu-button')?.focus();
      break;
    }
    case 'close-menu': state.menuOpen = false; render(); app.querySelector('.mobile-menu-button')?.focus(); break;
    case 'toggle-search': state.searchOpen = !state.searchOpen; state.menuOpen = false; render(); app.querySelector('#header-search-input')?.focus(); break;
    case 'open-cart': state.cartOpen = true; state.menuOpen = false; render(); break;
    case 'close-cart': state.cartOpen = false; render(); app.querySelector('[data-action="open-cart"]')?.focus(); break;
    case 'add-cart': updateCart(id, 1); toast('Adicionado ao carrinho'); break;
    case 'increase': updateCart(id, 1); break;
    case 'decrease': updateCart(id, -1); break;
    case 'remove-cart': if (productById.has(id)) { delete state.cart[id]; saveStore(STORAGE_CART, state.cart); render(); } break;
    case 'favorite': {
      if (!productById.has(id)) return;
      const favorites = favoriteIds();
      state.favorites = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
      saveStore(STORAGE_FAVORITES, state.favorites);
      render(); toast(favorites.includes(id) ? 'Removido dos favoritos' : 'Salvo nos favoritos');
      break;
    }
  }
});

app.addEventListener('submit', (event) => {
  const form = event.target;
  const type = form.dataset.form;
  if (!type) return;
  event.preventDefault();
  if (!form.reportValidity()) return;
  if (type === 'search') {
    state.searchOpen = false;
    go(`#/catalogo?q=${encodeURIComponent(new FormData(form).get('q').toString().trim().slice(0, 100))}`);
  } else if (type === 'catalog') {
    const data = new FormData(form);
    const params = new URLSearchParams();
    const category = data.get('categoria');
    const query = data.get('q').toString().trim().slice(0, 100);
    const order = data.get('ordem');
    if (categories.includes(category) && category !== 'Todos') params.set('categoria', category);
    if (query) params.set('q', query);
    if (['menor-preco', 'maior-preco', 'nome'].includes(order)) params.set('ordem', order);
    go(`#/catalogo${params.size ? '?' + params.toString() : ''}`);
  } else if (type === 'checkout') {
    // Os campos são validados pelo navegador e não persistidos nem enviados.
    if (!cartEntries().length) return;
    state.cart = {};
    saveStore(STORAGE_CART, state.cart);
    state.demoComplete = true;
    try { sessionStorage.setItem('marquesa-demo-complete', 'yes'); } catch { /* A simulação continua sem sessão persistida. */ }
    go('#/sucesso');
  }
});

app.addEventListener('change', (event) => {
  if (event.target.matches('#catalog-sort')) event.target.form?.requestSubmit();
});

app.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#/"]');
  if (link) {
    state.menuOpen = false;
    state.searchOpen = false;
    if (state.cartOpen) state.cartOpen = false;
    if (link.getAttribute('href') === location.hash) queueMicrotask(() => render(true));
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Tab' && state.cartOpen) {
    const drawer = app.querySelector('.cart-drawer');
    const focusable = [...drawer.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  if (event.key === 'Escape') {
    if (state.cartOpen) { state.cartOpen = false; render(); app.querySelector('[data-action="open-cart"]')?.focus(); }
    else if (state.menuOpen || state.searchOpen) { const wasMenuOpen = state.menuOpen; state.menuOpen = false; state.searchOpen = false; render(); app.querySelector(wasMenuOpen ? '.mobile-menu-button' : '.desktop-search-button')?.focus(); }
  }
});

window.addEventListener('hashchange', () => { state.cartOpen = false; state.menuOpen = false; state.searchOpen = false; render(true); });
window.addEventListener('resize', () => { if (window.innerWidth >= 900 && state.menuOpen) { state.menuOpen = false; render(); } });
render();
