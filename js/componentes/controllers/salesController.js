import { fetchSales } from '../models/salesModel.js';
import { renderSalesView } from '../views/salesView.js';

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

    fetchSales(page, startDate, endDate)
        .then(data => renderSalesView(adminContent, data, startDate, endDate))
        .catch(error => console.error('Error loading sales:', error));
}
