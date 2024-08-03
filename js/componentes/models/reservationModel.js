import config from '../utils/config.js';

export async function fetchReservations() {
    try {
        const response = await fetch(`${config.baseURL}/admin/reservations`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro desconhecido');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching reservations:', error);
        throw error;
    }
}

export async function updateReservation(id, status) {
    try {
        const response = await fetch(`${config.baseURL}/admin/update-status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ id, status })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro desconhecido');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating reservation status:', error);
        throw error;
    }
}

export async function deleteReservation(id) {
    try {
        const response = await fetch(`${config.baseURL}/admin/remove-reservation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ id })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro desconhecido');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting reservation:', error);
        throw error;
    }
}
