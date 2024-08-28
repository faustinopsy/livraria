import { logout } from '../componentes/navbar.js'; 
export function renderLogout() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <header>
           <h2>O sistema fez logout</h2>
        </header>
        
    `;
    logout();
}
