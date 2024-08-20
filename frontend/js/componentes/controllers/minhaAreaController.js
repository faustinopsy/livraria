import { fetchPurchasedProducts } from '../models/productModel.js';
import { renderMinhaArea } from '../views/minhaAreaView.js';

export function initMinhaArea() {
    fetchPurchasedProducts()
        .then(products => {
            renderMinhaArea(products);
        })
        .catch(error => console.error('Error loading purchased products:', error));
}
