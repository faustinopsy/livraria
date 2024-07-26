import { initializeNavbar } from './componentes/navbar.js';
import { initializeSidebar } from './componentes/sidebar.js';
import { renderContent } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeNavbar();
    initializeSidebar();
    renderContent(window.location.hash ? window.location.hash.substring(1) : 'home');
    window.addEventListener('hashchange', () => {
        renderContent(window.location.hash.substring(1));
    });
});
