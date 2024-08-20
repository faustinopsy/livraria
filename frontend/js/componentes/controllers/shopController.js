import { fetchProducts } from '../models/productModel.js';
import { renderShop } from '../views/shopView.js';
import { addToCart, renderCart } from '../cart.js';

export function initShop() {
    renderShop(fetchProducts, addToCart, renderCart);
}
