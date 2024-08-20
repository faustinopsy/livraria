import config from '../utils/config.js';
import { renderContent } from '../utils/router.js';
import { updateNavbar } from '../navbar.js';

export function loginUser(email, password) {
    fetch(`${config.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) { 
            return response.json().then(errorData => {
                throw new Error(errorData.message || 'Erro desconhecido');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            alert('Login bem-sucedido');
            renderContent('minhaArea');
        } else {
            alert('Falha no login');
        }
    })
    .catch(error => console.error('Erro durante o login:', error));
}

export function registerUser(name, email, password) {
    fetch(`${config.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    })
    .then(response => {
        if (!response.ok) { 
            return response.json().then(errorData => {
                throw new Error(errorData.message || 'Erro desconhecido');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.message === 'Registrado com sucesso') {
            alert('Registro bem-sucedido');
            window.location.hash = '#login';
            updateNavbar();
        } else {
            alert('Falha no registro: ' + data.message);
        }
    })
    .catch(error => console.error('Erro:', error));
}
