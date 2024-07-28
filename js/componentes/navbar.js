import { renderContent } from '../router.js';
import { initializeSidebar } from './sidebar.js';

export function initializeNavbar() {
    initializeSidebar();
    const sidebar = document.getElementById('sidebar');
    
    const navLinks = `
        <li><a href="#sobreMim">Sobre Mim</a></li>
        <li><a href="#livros" class="active">Minha livraria</a></li>
        <li><a href="#blog">Blog</a></li>
        <li><a href="#shop">Shop</a></li>
        ${isAuthenticated() ? '<li><a href="#minhaArea">Minha Área</a></li><li><a href="#" id="logout-btn">Logout</a></li>' : '<li><a href="#login">Login</a></li><li><a href="#register">Registrar</a></li>'}
    `;

    sidebar.innerHTML = `
        <div class="continue-reading">
            <div class="book-info">
                <p>Faustino, R.</p>
            </div>
            <div class="user">
                <img src="img/eu.jpg" alt="User" width="50px">
            </div>
        </div>
        <nav>
            <ul id="nav-links">
                ${navLinks}
            </ul>
        </nav>
        <div id="cart-content"></div>
    `;

    document.querySelectorAll('#nav-links a').forEach(link => {
        link.addEventListener('click', (event) => {
            if (event.target.id === 'logout-btn') {
                logout();
            } else {
                const hash = event.target.getAttribute('href');
                document.querySelectorAll('#nav-links a').forEach(nav => nav.classList.remove('active'));
                event.target.classList.add('active');
                renderContent(hash.substring(1));
            }
        });
    });

    updateActiveLink(window.location.hash.substring(1) || 'shop');
}

export function updateNavbar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    initializeNavbar();
}

function logout() {
    localStorage.removeItem('token');
    updateNavbar();
}

export function updateActiveLink(page) {
    const navLinks = document.querySelectorAll('#nav-links a');
    navLinks.forEach(nav => {
        if (nav.getAttribute('href').substring(1) === page) {
            nav.classList.add('active');
        } else {
            nav.classList.remove('active');
        }
    });
}

function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}
