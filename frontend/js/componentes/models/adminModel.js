export function isAdmin() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.data.role === 'admin';
    } catch (error) {
        console.error('Token parsing error:', error);
        return false;
    }
}
