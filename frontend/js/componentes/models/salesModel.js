import config from '../utils/config.js';

export async function fetchSales(page = 1, startDate = '', endDate = '') {
    try {
        const response = await fetch(`${config.baseURL}/admin/sales?page=${page}&start_date=${startDate}&end_date=${endDate}`, {
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
        console.error('Error fetching sales:', error);
        throw error;
    }
}
