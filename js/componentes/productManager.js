import config from '../config.js';
export function renderProductManager() {
    const adminContent = document.getElementById('admin-content');
    adminContent.innerHTML = `
        <h2>Gerenciamento de Produtos</h2>
        <button id="add-product" class="btn">Adicionar Produto</button>
        <div id="product-form" style="display: none;">
            <h3 id="form-title">Adicionar Produto</h3>
            <form id="productForm">
                <input type="hidden" id="productId">
                <label for="name">Nome:</label>
                <input type="text" id="name" required>
                <label for="description">Descrição:</label>
                <textarea id="description" required></textarea>
                <label for="price">Preço:</label>
                <input type="number" id="price" step="0.01" required>
                <label for="imageFile">Arquivo da Imagem:</label>
                <input type="file" id="imageFile" accept="image/*">
                <label for="altText">Texto Alternativo:</label>
                <input type="text" id="altText" required>
                <label for="category">Categoria:</label>
                <input list="categorias" id="category" required>
                <button type="submit" class="btn" id="btnsalvar">Salvar</button>
                <button type="button" id="btncancelar" class="btn">Cancelar</button>
            </form>
        </div>
        <div id="product-list"></div>

        <datalist id="categorias">
            <option value="Tecnologia">
            <option value="Esporte">
            <option value="Ficção">
        </datalist>
    `;

    const productForm = document.getElementById('product-form');
    const productList = document.getElementById('product-list');
    const productFormElement = document.getElementById('productForm');
    const addProductButton = document.getElementById('add-product');
    const cancelButton = document.getElementById('btncancelar');

    addProductButton.addEventListener('click', () => {
        productForm.style.display = 'block';
        document.getElementById('form-title').innerText = 'Adicionar Produto';
        productFormElement.reset();
    });

    cancelButton.addEventListener('click', () => {
        productForm.style.display = 'none';
    });

    productFormElement.addEventListener('submit', (event) => {
        event.preventDefault();
        const productId = document.getElementById('productId').value;
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;
        const imageSrc = document.getElementById('imageFile');
        const altText = document.getElementById('altText').value;
        const category = document.getElementById('category').value;
        
        const product = {
            id: productId,
            name,
            description,
            price,
            imageSrc,
            altText,
            category
        };
        if (productId) {
            updateProduct(product);
        } else {
            addProduct(product);
        }
    });

    fetchProducts();

    function fetchProducts() {
        fetch(`${config.baseURL}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(response => response.json())
        .then(products => {
            productList.innerHTML = '';
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.innerHTML = `
                    <img src="${product.imageSrc}" alt="${product.altText}" class="product-image">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>R$ ${parseFloat(product.price).toFixed(2)}</p>
                    <button class="edit-product" data-id="${product.id}">Editar</button>
                    <button class="delete-product" data-id="${product.id}">Excluir</button>
                `;
                productList.appendChild(productCard);
            });

            const editProductButtons = document.querySelectorAll('.edit-product');
            const deleteProductButtons = document.querySelectorAll('.delete-product');

            editProductButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const productId = button.getAttribute('data-id');
                    const product = products.find(p => p.id == productId);
                    document.getElementById('productId').value = product.id;
                    document.getElementById('name').value = product.name;
                    document.getElementById('description').value = product.description;
                    document.getElementById('price').value = product.price;
                    //document.getElementById('imageFile').files = product.imageSrc;
                    document.getElementById('altText').value = product.altText;
                    document.getElementById('category').value = product.category;
                    document.getElementById('form-title').innerText = 'Editar Produto';
                    productForm.style.display = 'block';
                });
            });

            deleteProductButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const productId = button.getAttribute('data-id');
                    const product = products.find(p => p.id == productId);
                    deleteProduct(product);
                });
            });
        })
        .catch(error => console.error('Error loading products:', error));
    }

    async function addProduct(product) {
        const fileInput = document.getElementById('imageFile');
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        product.imageSrcBase64 = await toBase64(file);
    }
        fetch(`${config.baseURL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(product)
        })
        .then(response => response.json())
        .then(data => {
            alert('Produto adicionado com sucesso!');
            productForm.style.display = 'none';
            fetchProducts();
        })
        .catch(error => console.error('Error adding product:', error));
    }
    async function updateProduct(product) {
        const fileInput = document.getElementById('imageFile');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            product.imageSrcBase64 = await toBase64(file);
        }
            fetch(`${config.baseURL}/products`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(product)
            })
        .then(response => response.json())
        .then(data => {
            alert('Produto atualizado com sucesso!');
            productForm.style.display = 'none';
            fetchProducts();
        })
        .catch(error => console.error('Error updating product:', error));
    }

    function deleteProduct(product) {
        fetch(`${config.baseURL}/products`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(product)
        })
        .then(response => response.json())
        .then(data => {
            alert('Produto excluído com sucesso!');
            fetchProducts();
        })
        .catch(error => console.error('Error deleting product:', error));
    }

    function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);            reader.onerror = error => reject(error);
        });
    }
}
