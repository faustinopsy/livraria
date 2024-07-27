import { addToCart, renderCart } from '../componentes/cart.js';

export function renderShop() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h1>Shop</h1>
        <p>Confira nossos produtos.</p>
        <div id="cart-content"></div>
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

    fetch('json/products.json')
        .then(response => response.json())
        .then(products => {
            const categorias = {
                'Tecnologia': document.getElementById('prateleira-tecnologia'),
                'Esporte': document.getElementById('prateleira-esporte'),
                'Ficção': document.getElementById('prateleira-ficcao')
            };

            // Limpa o conteúdo das prateleiras
            for (let key in categorias) {
                categorias[key].innerHTML = '';
            }

            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card'); // Adiciona a classe product-card
                productCard.innerHTML = `
                    <img src="${product.imageSrc}" alt="${product.altText}" class="product-image">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>R$ ${product.price.toFixed(2)}</p>
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
        })
        .catch(error => console.error('Error loading products:', error));

    renderCart();
}
