import { initializeNavbar } from './componentes/navbar.js';
import { renderContent } from './componentes/utils/router.js';
import { initializeSidebar } from './componentes/sidebar.js';
import { syncOfflineProducts } from './componentes/controllers/productController.js';
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
