import config from './utils/config.js';
let cart = JSON.parse(localStorage.getItem('cart')) || [];

export function addToCart(product) {
    const productInCart = cart.find(item => item.id === product.id);
    if (productInCart) {
        productInCart.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    renderCart();
}

export function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== parseInt(productId, 10));
    saveCart();
    renderCart();
}

export function clearCart() {
    cart = [];
    saveCart();
    renderCart();
}

export function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function renderCart() {
    const cartContent = document.getElementById('cart-content');
    cartContent.innerHTML = '';

    if (cart.length === 0) {
        cartContent.innerHTML = '<p>O carrinho está vazio.</p>';
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <h4>${item.name}</h4>
            <p>Quantidade: ${item.quantity}</p>
            <p>Preço: R$ ${(item.price * item.quantity).toFixed(2)}</p>
            <button class="remove-from-cart" data-id="${item.id}">Remover</button>
        `;
        cartContent.appendChild(cartItem);
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalElement = document.createElement('p');
    totalElement.classList.add('cart-total');
    totalElement.innerHTML = `Total: R$ ${total.toFixed(2)}`;
    cartContent.appendChild(totalElement);

    const checkoutButton = document.createElement('button');
    checkoutButton.textContent = 'Checkout';
    checkoutButton.classList.add('checkout-button');
    checkoutButton.addEventListener('click', () => {
        fetch(`${config.baseURL}/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(cart)
        })
        .then(response => {
            if (!response.ok) { 
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Erro desconhecido');
                });
            }
            return response.json();
        }).then(data => {
            if (data.init_point) {
                // Redireciona o usuário para a página de pagamento do Mercado Pago
                window.location.href = data.init_point;
            } else {
                alert('Erro ao iniciar o checkout.');
            }
        })
        .then(data => {
            if (data.status) {
                window.location.href = location.hash = '#minhaArea';
                clearCart()
            } else {
                alert('Erro ao iniciar o checkout.');
            }
        })
        .catch(error => console.error('Error during checkout:', error));
    });
    
    cartContent.appendChild(checkoutButton);

    const clearCartButton = document.createElement('button');
    clearCartButton.textContent = 'Limpar Carrinho';
    clearCartButton.classList.add('clear-cart-button');
    clearCartButton.addEventListener('click', clearCart);
    cartContent.appendChild(clearCartButton);

    const removeFromCartButtons = document.querySelectorAll('.remove-from-cart');
    removeFromCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            removeFromCart(productId);
        });
    });
}
