export function renderSalesView(adminContent, data, startDate, endDate) {
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
