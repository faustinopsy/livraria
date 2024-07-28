import { renderSobre } from './paginas/sobre.js';
import { renderLivros } from './paginas/livros.js';
import { renderShop } from './paginas/shop.js';
import { renderBlog } from './paginas/blog.js';
import { renderLogin } from './paginas/login.js';
import { renderRegister } from './paginas/register.js';
import { renderMinhaArea } from './paginas/minhaArea.js';
import { updateActiveLink, updateNavbar } from './componentes/navbar.js'; 

const pages = {
    sobreMim: renderSobre,
    livros: renderLivros,
    shop: renderShop,
    blog: renderBlog,
    login: renderLogin,
    register: renderRegister,
    minhaArea: renderMinhaArea
};

export function renderContent(page) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; 

    const renderPage = pages[page] || (() => { mainContent.innerHTML = '<h1>Página não encontrada</h1>'; });
    renderPage();
    updateActiveLink(page); 
    updateNavbar();
}
