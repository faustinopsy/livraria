import { renderContent } from './utils/router.js';
import { initializeSidebar } from './sidebar.js';
import { renderCart } from '../componentes/cart.js';
export function initializeNavbar() {
    initializeSidebar();
    const sidebar = document.getElementById('sidebar');
    const token = localStorage.getItem('token')
    let isAdmin;
    let email = 'Visitante';
    if(token){
        const payload = JSON.parse(atob(token.split('.')[1]));
        isAdmin = payload.data.role === 'admin';
        email = payload.data.email;
    }
    
    const navLinks = `
        <li><a href="#livros" class="active">Amazon</a></li>
        <li><a href="#shop">Livros</a></li>
        ${isAdmin ? '<li><a href="#admin">Admin</a></li>' : ''}
        ${isAuthenticated() ? '<li><a href="#minhaArea">Minha Área</a></li><li><a href="#" id="logout-btn">Logout</a></li>' : '<li><a href="#login">Login</a></li><li><a href="#register">Registrar</a></li>'}
    `;

    sidebar.innerHTML = `
        <div class="continue-reading">
            <div class="book-info">
                <p>${email}</p>
            </div>
            <div class="user">
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
    renderCart()
}

export function updateNavbar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    initializeNavbar();
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('mail');
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
