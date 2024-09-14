import { fetchProductsFromAPI, addProductToAPI, updateProductInAPI, deleteProductFromAPI, saveProductOffline, getOfflineProducts, clearOfflineProducts } from '../models/productModel.js';
import { renderProductForm, renderProductList, attachEventHandlers } from '../views/productView.js.js';

export function renderProductManager() {
    renderProductForm();
    loadProducts();
}

function loadProducts() {
    fetchProductsFromAPI()
        .then(products => {
            renderProductList(products);
            attachEventHandlers(addProduct, updateProduct, deleteProduct, products);
        })
        .catch(error => console.error('Error loading products:', error));
}
async function addProduct(product) {
    const fileInput = document.getElementById('imageFile');
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        product.imageSrcBase64 = await toBase64(file);
    }
    
    if (navigator.onLine) {
        try {
            await addProductToAPI(product);
            alert('Produto adicionado com sucesso!');
            loadProducts();
        } catch (error) {
            console.error('Error adding product:', error);
        }
    } else {
        saveProductOffline(product, 'add');
        alert('Sem conexão com a internet. Produto salvo localmente e será enviado quando a conexão for restabelecida.');
    }
}

async function updateProduct(product) {
    const fileInput = document.getElementById('imageFile');
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        product.imageSrcBase64 = await toBase64(file);
    }

    if (navigator.onLine) {
        try {
            await updateProductInAPI(product);
            alert('Produto atualizado com sucesso!');
            loadProducts();
        } catch (error) {
            console.error('Error updating product:', error);
        }
    } else {
        saveProductOffline(product, 'update');
        alert('Sem conexão com a internet. Produto salvo localmente e será atualizado quando a conexão for restabelecida.');
    }
}

function deleteProduct(product) {
    if (navigator.onLine) {
        deleteProductFromAPI(product)
            .then(() => {
                alert('Produto excluído com sucesso!');
                loadProducts();
            })
            .catch(error => console.error('Error deleting product:', error));
    } else {
        saveProductOffline(product, 'delete');
        alert('Sem conexão com a internet. Produto excluído localmente e será removido do servidor quando a conexão for restabelecida.');
    }
}

export function syncOfflineProducts() {
    if (navigator.onLine) {
        const offlineProducts = getOfflineProducts();
        offlineProducts.forEach(async ({ product, action }) => {
            try {
                if (action === 'add') {
                    await addProductToAPI(product);
                } else if (action === 'update') {
                    await updateProductInAPI(product);
                } else if (action === 'delete') {
                    await deleteProductFromAPI(product);
                }
                console.log(`Produto ${action} sincronizado:`, product);
            } catch (error) {
                console.error(`Error syncing product ${action}:`, error);
            }
        });
        clearOfflineProducts(); 
    }
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}
