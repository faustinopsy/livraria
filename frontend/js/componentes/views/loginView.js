import { loginUser } from '../controllers/authController.js';

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
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        loginUser(email, password);
    });
}
