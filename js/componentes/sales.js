import config from '../config.js';
export function renderSales(page = 1, startDate = '', endDate = '') {
    const adminContent = document.getElementById('admin-content');
    adminContent.innerHTML = '<h2>Vendas Realizadas</h2><p>Veja as vendas realizadas e seus lucros.</p>';

    const searchForm = document.createElement('form');
    searchForm.innerHTML = `
        <label for="start-date">Data de Início:</label>
        <input type="date" id="start-date" name="start-date" value="${startDate}">
        <label for="end-date">Data de Fim:</label>
        <input type="date" id="end-date" name="end-date" value="${endDate}">
        <button type="submit" id='btncancelar'>Buscar</button>
    `;
    adminContent.appendChild(searchForm);

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const startDateValue = document.getElementById('start-date').value;
        const endDateValue = document.getElementById('end-date').value;
        renderSales(1, startDateValue, endDateValue);
    });

    fetch(`${config.baseURL}src/admin/sales?page=${page}&start_date=${startDate}&end_date=${endDate}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => response.json())
    .then(data => {
        const salesContainer = document.createElement('div');
        salesContainer.classList.add('sales-container');

        data.sales.forEach(sale => {
            const saleCard = document.createElement('div');
            saleCard.classList.add('sale-card');
            saleCard.innerHTML = `
                <h3>${sale.name}</h3>
                <p>${sale.description}</p>
                <p>Preço: R$ ${parseFloat(sale.price).toFixed(2)}</p>
                <p>Data: ${formatDateToBrazilian(sale.created_at)}</p>
            `;
            salesContainer.appendChild(saleCard);
        });

        const pagination = document.createElement('div');
        pagination.classList.add('pagination');
        if (data.previousPage) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Anterior';
            prevButton.addEventListener('click', () => renderSales(data.previousPage, startDate, endDate));
            pagination.appendChild(prevButton);
        }
        if (data.nextPage) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Próximo';
            nextButton.addEventListener('click', () => renderSales(data.nextPage, startDate, endDate));
            pagination.appendChild(nextButton);
        }

        adminContent.appendChild(salesContainer);
        adminContent.appendChild(pagination);
    })
    .catch(error => console.error('Error loading sales:', error));
}

function formatDateToBrazilian(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
