import config from '../config.js';
export function renderReservations() {
    const adminContent = document.getElementById('admin-content');
    adminContent.innerHTML = '<h2>Reservations</h2>';
    fetch(`${config.baseURL}src/admin/reservations`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => response.json())
    .then(reservations => {
        const reservationsContainer = document.createElement('div');
        reservationsContainer.classList.add('reservations-container');
        reservations.forEach(reservation => {
            const reservationCard = document.createElement('div');
            reservationCard.classList.add('reservation-card');
            reservationCard.innerHTML = `
                <img src="${reservation.imageSrc}" alt="${reservation.altText}" class="reservation-image">
                <h3>${reservation.name}</h3>
                <p>${reservation.description}</p>
                <p>Price: R$ ${parseFloat(reservation.price).toFixed(2)}</p>
                <p>Status: ${reservation.status}</p>
                <button class="confirm-sale" data-id="${reservation.id}">Confirm Sale</button>
                <button class="remove-reservation" data-id="${reservation.id}">Remove Reservation</button>
            `;
            reservationsContainer.appendChild(reservationCard);
        });

        adminContent.appendChild(reservationsContainer);

        const confirmSaleButtons = document.querySelectorAll('.confirm-sale');
        confirmSaleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const reservationId = button.getAttribute('data-id');
                updateReservationStatus(reservationId, 'sold');
            });
        });

        const removeReservationButtons = document.querySelectorAll('.remove-reservation');
        removeReservationButtons.forEach(button => {
            button.addEventListener('click', () => {
                const reservationId = button.getAttribute('data-id');
                removeReservation(reservationId);
            });
        });
    })
    .catch(error => console.error('Error loading reservations:', error));
}

function updateReservationStatus(id, status) {
    fetch(`${config.baseURL}src/admin/update-status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ id, status })
    })
    .then(response => response.json())
    .then(data => {
        alert('Reservation status updated');
        renderReservations(); 
    })
    .catch(error => console.error('Error updating reservation status:', error));
}

function removeReservation(id) {
    fetch(`${config.baseURL}src/admin/remove-reservation`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ id })
    })
    .then(response => response.json())
    .then(data => {
        alert('Reservation removed');
        renderReservations();
    })
    .catch(error => console.error('Error removing reservation:', error));
}
