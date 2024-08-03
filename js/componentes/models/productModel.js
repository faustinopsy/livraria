import config from '../utils/config.js';

export async function fetchProducts(searchTerm = '') {
    const response = await fetch(`${config.baseURL}/products?search=${searchTerm}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro desconhecido');
    }
    return response.json();
}
export async function fetchPurchasedProducts() {
    const response = await fetch(`${config.baseURL}/purchased-products`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro desconhecido');
    }
    return response.json();
}
export async function fetchProductsFromAPI() {
    const response = await fetch(`${config.baseURL}/products`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro desconhecido');
    }

    return response.json();
}

export async function addProductToAPI(product) {
    const response = await fetch(`${config.baseURL}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(product)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro desconhecido');
    }

    return response.json();
}

export async function updateProductInAPI(product) {
    const response = await fetch(`${config.baseURL}/products`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(product)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro desconhecido');
    }

    return response.json();
}

export async function deleteProductFromAPI(product) {
    const response = await fetch(`${config.baseURL}/products`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(product)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro desconhecido');
    }

    return response.json();
}

export function saveProductOffline(product, action) {
    let offlineProducts = JSON.parse(localStorage.getItem('offlineProducts')) || [];
    offlineProducts.push({ product, action });
    localStorage.setItem('offlineProducts', JSON.stringify(offlineProducts));
}

export function getOfflineProducts() {
    return JSON.parse(localStorage.getItem('offlineProducts')) || [];
}

export function clearOfflineProducts() {
    localStorage.removeItem('offlineProducts');
}