import { renderContent } from '../router.js';

export function initializeNavbar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = `
        <div class="logo">Readowl</div>
        <nav>
            <ul id="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#library" class="active">Minha livraria</a></li>
                <li><a href="#shop">Shop</a></li>
                <li><a href="#news">News</a></li>
            </ul>
        </nav>
        <div class="continue-reading">
            <img src="img/livro1.png" alt="Current Book">
            <div class="book-info">
                <span>Continuar a leitura</span>
                <p>Web Design</p>
            </div>
            <div class="user">
                <img src="img/eu.jpg" alt="User" width="50px">
                <p>Faustino, R.</p>
            </div>
        </div>
    `;

    const navLinks = document.querySelectorAll('#nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            navLinks.forEach(nav => nav.classList.remove('active'));
            event.target.classList.add('active');
        });
    });
}
