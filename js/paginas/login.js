import { updateNavbar } from '../componentes/navbar.js';

export function renderLogin() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="login-container">
            <h1>Login</h1>
            <form id="login-form">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
                
                <label for="password">Senha:</label>
                <input type="password" id="password" name="password" required>
                
                <button type="submit">Login</button>
            </form>
            <p>Não tem uma conta? <a href="#register">Registre-se</a></p>
        </div>
    `;

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        
        fetch('http://localhost:8000/src/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                alert('Login bem-sucedido');
                window.location.hash = '#minhaArea';
                updateNavbar();
            } else {
                alert('Falha no login: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });
}
