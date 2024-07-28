import { updateNavbar } from '../componentes/navbar.js';

export function renderRegister() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="register-container">
            <h1>Registrar</h1>
            <form id="register-form">
                <label for="name">Nome:</label>
                <input type="text" id="name" name="name" required>
                
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
                
                <label for="password">Senha:</label>
                <input type="password" id="password" name="password" required>
                
                <button type="submit">Registrar</button>
            </form>
            <p>Já tem uma conta? <a href="#login">Login</a></p>
        </div>
    `;

    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = registerForm.name.value;
        const email = registerForm.email.value;
        const password = registerForm.password.value;
        
        fetch('http://localhost:8000/src/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'User registered successfully') {
                alert('Registro bem-sucedido');
                window.location.hash = '#login';
                updateNavbar();
            } else {
                alert('Falha no registro: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });
}
