import config from '../config.js';
export function renderMinhaArea() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';
    mainContent.innerHTML = '<h1>Minha Área</h1><p>Seus produtos comprados:</p>';

    fetch(`${config.baseURL}src/purchased-products`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => response.json())
    .then(products => {
        if (products.length === 0) {
            mainContent.innerHTML += '<p>Você ainda não comprou nenhum produto.</p>';
        } else {
            mainContent.innerHTML = '';
            const productsContainer = document.createElement('div');
            productsContainer.classList.add('products-container');
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                
                productCard.classList.add(statusClassMap[product.status] || 'status-default');
                
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
    })
    .catch(error => console.error('Error loading purchased products:', error));
}

const statusClassMap = {
    'reserved': 'status-reserved',
    'sold': 'status-sold',
    'default': 'status-default'
};
