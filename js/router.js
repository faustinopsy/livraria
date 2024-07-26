import { renderHome } from './paginas/home.js';
import { renderLibrary } from './paginas/library.js';
import { renderShop } from './paginas/shop.js';
import { renderNews } from './paginas/news.js';

const pages = {
    home: renderHome,
    library: renderLibrary,
    shop: renderShop,
    news: renderNews
};

export function renderContent(page) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; 

    const renderPage = pages[page] || (() => { mainContent.innerHTML = '<h1>Página não encontrada</h1>'; });
    renderPage();
}
