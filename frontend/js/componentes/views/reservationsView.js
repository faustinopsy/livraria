export function renderReservationsView(adminContent, reservations) {
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

    return reservationsContainer;
}

export function setupReservationButtons(reservationsContainer, onConfirmSale, onRemoveReservation) {
    const confirmSaleButtons = reservationsContainer.querySelectorAll('.confirm-sale');
    confirmSaleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const reservationId = button.getAttribute('data-id');
            onConfirmSale(reservationId);
        });
    });

    const removeReservationButtons = reservationsContainer.querySelectorAll('.remove-reservation');
    removeReservationButtons.forEach(button => {
        button.addEventListener('click', () => {
            const reservationId = button.getAttribute('data-id');
            onRemoveReservation(reservationId);
        });
    });
}
