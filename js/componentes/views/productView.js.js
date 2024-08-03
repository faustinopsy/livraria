export function renderProductForm() {
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
}

export function renderProductList(products) {
    const productList = document.getElementById('product-list');
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
}

export function attachEventHandlers(onAddProduct, onUpdateProduct, onDeleteProduct) {
    const productFormElement = document.getElementById('productForm');
    const addProductButton = document.getElementById('add-product');
    const cancelButton = document.getElementById('btncancelar');

    addProductButton.addEventListener('click', () => {
        document.getElementById('product-form').style.display = 'block';
        document.getElementById('form-title').innerText = 'Adicionar Produto';
        productFormElement.reset();
    });

    cancelButton.addEventListener('click', () => {
        document.getElementById('product-form').style.display = 'none';
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
            onUpdateProduct(product);
        } else {
            onAddProduct(product);
        }
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
            document.getElementById('altText').value = product.altText;
            document.getElementById('category').value = product.category;
            document.getElementById('form-title').innerText = 'Editar Produto';
            document.getElementById('product-form').style.display = 'block';
        });
    });

    deleteProductButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const product = products.find(p => p.id == productId);
            onDeleteProduct(product);
        });
    });
}
