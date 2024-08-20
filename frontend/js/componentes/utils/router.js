
import { renderLivros } from '../views/livrosView.js';
import { initShop } from '../controllers/shopController.js';
import { renderLogin } from '../views/loginView.js';
import { renderRegister } from '../views/registerView.js';
import { initMinhaArea } from '../controllers/minhaAreaController.js';
import { updateActiveLink, updateNavbar } from '../navbar.js'; 
import { initAdmin } from '../controllers/adminController.js';
import { renderLogout } from '../../paginas/logout.js';
const pages = {
    livros: renderLivros,
    shop: initShop,
    login: renderLogin,
    register: renderRegister,
    minhaArea: initMinhaArea,
    admin: initAdmin,
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
