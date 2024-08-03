export function renderMinhaArea(products) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '<h1>Minha Área</h1><p>Seus produtos comprados:</p>';

    if (products.length === 0) {
        mainContent.innerHTML += '<p>Você ainda não comprou nenhum produto.</p>';
    } else {
        const productsContainer = document.createElement('div');
        productsContainer.classList.add('products-container');

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card', statusClassMap[product.status] || 'status-default');
            productCard.innerHTML = `
                <p>${product.status}</p>
                <img src="${product.imageSrc}" alt="${product.altText}" class="product-image">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>R$ ${product.price}</p>
            `;
            productsContainer.appendChild(productCard);
        });

        mainContent.appendChild(productsContainer);
    }
}

const statusClassMap = {
    'reserved': 'status-reserved',
    'sold': 'status-sold',
    'default': 'status-default',
};
