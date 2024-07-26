import { renderBooks } from '../componentes/books.js';

export function renderLibrary() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <header>
            <button class="shelves active">Favoritos</button>
            <button class="all-books">Todos</button>
            <input type="search" placeholder="Procurar os livros">
        </header>
        <section class="shelf">
            <div class="prateleira" id="prateleira-1"></div>
            <h2></h2>
        </section>
        <section class="shelf">
            <div class="prateleira" id="prateleira-2"></div>
            <h2></h2>
        </section>
        <section class="shelf">
            <div class="prateleira" id="prateleira-3"></div>
            <h2></h2>
        </section>
    `;
    renderBooks();
}
