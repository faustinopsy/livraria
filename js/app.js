import { initializeNavbar } from './componentes/navbar.js';
import { renderContent } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeNavbar();
    const initialPage = window.location.hash.substring(1) || 'home';
    renderContent(initialPage);
    window.addEventListener('hashchange', () => {
        renderContent(window.location.hash.substring(1));
    });
});
