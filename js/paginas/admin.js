import { renderReservations } from '../componentes/reservations.js';
import { renderSales } from '../componentes/sales.js';
import { renderProductManager } from '../componentes/productManager.js';

export function renderAdmin() {
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const isAdmin = payload.data.role === 'admin';
            if (!isAdmin) {
                location.hash = '#shop';
            }
        } catch (error) {
            console.error('Token parsing error:', error);
        }
    } else {
        location.hash = '#login';
    }
   
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
