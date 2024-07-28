import { initializeNavbar } from './componentes/navbar.js';
import { renderContent } from './router.js';
import { initializeSidebar } from './componentes/sidebar.js';
document.addEventListener('DOMContentLoaded', () => {
    initializeNavbar();
    initializeSidebar()
    const initialPage = window.location.hash.substring(1) || 'blog';
    renderContent(initialPage);
    window.addEventListener('hashchange', () => {
        renderContent(window.location.hash.substring(1));
    });
});
