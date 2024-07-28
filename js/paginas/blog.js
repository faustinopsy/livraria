export function renderBlog() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <header>
            <button class="shelves active">Favoritos</button>
            <button class="all-books">Todos</button>
            <input type="search" placeholder="Procurar os livros">
        </header>
        <section class="shelf"><p>Tecnologia</p>
            <div class="prateleira" id="prateleira-1"></div>
            <h2></h2>
        </section>
        <section class="shelf"><p>Esporte</p>
            <div class="prateleira" id="prateleira-2"></div>
            <h2></h2>
        </section>
        <section class="shelf"><p>Ficção</p>
            <div class="prateleira" id="prateleira-3"></div>
            <h2></h2>
        </section>
    `;
}
