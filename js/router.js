
import { renderLivros } from './paginas/livros.js';
import { renderShop } from './paginas/shop.js';
import { renderLogin } from './paginas/login.js';
import { renderRegister } from './paginas/register.js';
import { renderMinhaArea } from './paginas/minhaArea.js';
import { updateActiveLink, updateNavbar } from './componentes/navbar.js'; 
import { renderAdmin } from './paginas/admin.js';
import { renderLogout } from './paginas/logout.js';
const pages = {
    livros: renderLivros,
    shop: renderShop,
    login: renderLogin,
    register: renderRegister,
    minhaArea: renderMinhaArea,
    admin: renderAdmin,
    logout: renderLogout 
};

export function renderContent(page) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; 

    const renderPage = pages[page] || (() => { mainContent.innerHTML = '<h1>Página não encontrada</h1>'; });
    renderPage();
    updateActiveLink(page); 
    updateNavbar();
}
