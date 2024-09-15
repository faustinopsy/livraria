
import { renderLivros } from '../views/livrosView.js';
import { initShop } from '../controllers/shopController.js';
import { renderLogin } from '../views/loginView.js';
import { renderRegister } from '../views/registerView.js';
import { initMinhaArea } from '../controllers/minhaAreaController.js';
import { updateActiveLink, updateNavbar } from '../navbar.js'; 
import { initAdmin } from '../controllers/adminController.js';
import { renderLogout } from '../../paginas/logout.js';
const pages = {
    livros: renderLivros,
    shop: initShop,
    login: renderLogin,
    register: renderRegister,
    minhaArea: initMinhaArea,
    admin: initAdmin,
    logout: renderLogout,
    paymentsuccess: handlePaymentSuccess,
    paymentpending: handlePaymentPending,
    paymentfailure: handlePaymentFailure,
};

export function renderContent(page) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; 
    //const hash = window.location.hash.substring(1);
    const [route, queryString] = page.split('?');
    const renderPage = pages[route] || (() => { mainContent.innerHTML = '<h1>Página não encontrada</h1>'; });
    renderPage();
    updateActiveLink(page); 
    updateNavbar();
}


function handlePaymentSuccess() {
    clearCart();
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '<h1>Pagamento realizado com sucesso!</h1>';
}

function handlePaymentFailure() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '<h1>O pagamento foi recusado. Por favor, tente novamente.</h1>';
}

function handlePaymentPending() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '<h1>O pagamento está pendente. Aguarde a confirmação.</h1>';
}