import { renderSobre } from './paginas/sobre.js';
import { renderLivros } from './paginas/livros.js';
import { renderShop } from './paginas/shop.js';
import { renderNews } from './paginas/news.js';
import { updateActiveLink } from './componentes/navbar.js'; 

const pages = {
    sobreMim: renderSobre,
    livros: renderLivros,
    shop: renderShop,
    news: renderNews
};

export function renderContent(page) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; 

    const renderPage = pages[page] || (() => { mainContent.innerHTML = '<h1>Página não encontrada</h1>'; });
    renderPage();
    updateActiveLink(page); 
}
