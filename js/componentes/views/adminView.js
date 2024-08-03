import { renderReservations } from '../controllers/reservationController.js';
import { renderSales } from '../controllers/salesController.js';
import { renderProductManager } from '../controllers/productController.js';
export function renderAdminView() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h1>Admin Area</h1>
        <p>Vendas e reservas.</p>
        <div class="tabs">
            <button id="tab-reservations" class="tab active">Reservas</button>
            <button id="tab-sales" class="tab">Vendas</button>
            <button id="tab-products" class="tab">Gerenciar Produtos</button>
        </div>
        <div id="admin-content"></div>
    `;

    document.getElementById('tab-reservations').addEventListener('click', () => {
        setActiveTab('tab-reservations');
        renderReservations();
    });

    document.getElementById('tab-sales').addEventListener('click', () => {
        setActiveTab('tab-sales');
        renderSales();
    });

    document.getElementById('tab-products').addEventListener('click', () => {
        setActiveTab('tab-products');
        renderProductManager();
    });

    renderReservations(); 
}

function setActiveTab(activeTabId) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        if (tab.id === activeTabId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}
