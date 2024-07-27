import { renderContent } from '../router.js';
import { initializeSidebar } from './sidebar.js';
export function initializeNavbar() {
    initializeSidebar()
    const sidebar = document.getElementById('sidebar');
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
                <li><a href="#sobreMim">Sobre Mim</a></li>
                <li><a href="#livros" class="active">Minha livraria</a></li>
                <li><a href="#shop">Shop</a></li>
                <li><a href="#news">News</a></li>
            </ul>
        </nav>
    `;

    const navLinks = document.querySelectorAll('#nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            navLinks.forEach(nav => nav.classList.remove('active'));
            event.target.classList.add('active');
            renderContent(event.target.getAttribute('href').substring(1));
        });
    });

    updateActiveLink(window.location.hash.substring(1) || 'home');
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
