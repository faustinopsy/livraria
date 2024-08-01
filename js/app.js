import { initializeNavbar } from './componentes/navbar.js';
import { renderContent } from './router.js';
import { initializeSidebar } from './componentes/sidebar.js';
import { syncOfflineProducts } from './componentes/productManager.js';
document.addEventListener('DOMContentLoaded', () => {
    initializeNavbar();
    initializeSidebar()
    const initialPage = window.location.hash.substring(1) || 'shop';
    renderContent(initialPage);
    window.addEventListener('hashchange', () => {
        renderContent(window.location.hash.substring(1));
    });
    window.addEventListener('online', syncOfflineProducts);
});
