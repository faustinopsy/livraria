import { fetchReservations, updateReservation, deleteReservation } from '../models/reservationModel.js';
import { renderReservationsView, setupReservationButtons } from '../views/reservationsView.js';

export function renderReservations() {
    const adminContent = document.getElementById('admin-content');
    adminContent.innerHTML = '<h2>Reservations</h2>';

    fetchReservations()
        .then(reservations => {
            const reservationsContainer = renderReservationsView(adminContent, reservations);
            setupReservationButtons(
                reservationsContainer,
                handleUpdateReservationStatus,
                handleRemoveReservation
            );
        })
        .catch(error => console.error('Error loading reservations:', error));
}

function handleUpdateReservationStatus(id) {
    updateReservation(id, 'sold')
        .then(() => {
            alert('Reservation status updated');
            renderReservations();
        })
        .catch(error => console.error('Error updating reservation status:', error));
}

function handleRemoveReservation(id) {
    deleteReservation(id)
        .then(() => {
            alert('Reservation removed');
            renderReservations();
        })
        .catch(error => console.error('Error removing reservation:', error));
}
