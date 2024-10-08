export function renderShop(fetchProducts, addToCart, renderCart) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <header>
            <button class="all-books" id="all-books">Todos</button>
            <input type="search" id="search-input" placeholder="Procurar os livros">
        </header>
        <section class="shelf"><p>Tecnologia</p>
            <div class="prateleira" id="prateleira-tecnologia"></div>
            <h2></h2>
        </section>
        <section class="shelf"><p>Esporte</p>
            <div class="prateleira" id="prateleira-esporte"></div>
            <h2></h2>
        </section>
        <section class="shelf"><p>Ficção</p>
            <div class="prateleira" id="prateleira-ficcao"></div>
            <h2></h2>
        </section>
    `;

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', async () => {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm.length >= 3) {
            const products = await fetchProducts(searchTerm);
            updateProductList(products, addToCart, renderCart);
        }
    });
    
    const todos = document.getElementById('all-books');
    todos.addEventListener('click', async () => {
        searchInput.value = '';
        const products = await fetchProducts();
        updateProductList(products, addToCart, renderCart);
    });

    fetchProducts().then(products => {
        updateProductList(products, addToCart, renderCart);
    });

    renderCart();
}

function updateProductList(products, addToCart, renderCart) {
    const categorias = {
        'Tecnologia': document.getElementById('prateleira-tecnologia'),
        'Esporte': document.getElementById('prateleira-esporte'),
        'Ficção': document.getElementById('prateleira-ficcao')
    };

    for (let key in categorias) {
        categorias[key].innerHTML = '';
    }

    products.forEach(product => {
        const price = parseFloat(product.price); 
        const productCard = document.createElement('div');
        productCard.classList.add('product-card'); 
        productCard.innerHTML = `
            <img src="${product.imageSrc}" alt="${product.altText}" class="product-image">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>R$ ${price.toFixed(2)}</p>
            <button class="add-to-cart" data-id="${product.id}">Adicionar ao carrinho</button>
        `;

        if (categorias[product.category]) {
            categorias[product.category].appendChild(productCard);
        }
    });

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const product = products.find(p => p.id == productId);
            addToCart(product);
            renderCart();
        });
    });
}
