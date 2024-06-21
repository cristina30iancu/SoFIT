document.addEventListener("DOMContentLoaded", async function() {
    const baseUrl = `http://localhost:8080`;
    const token = sessionStorage.getItem("token");

    if (!token) {
        alert("Vă rugăm să vă conectați pentru a vedea rezervările.");
        return;
    }

    try {
        let res = await fetch(`${baseUrl}/booking/userId`, {
            headers: {
                'Authorization': token
            }
        });
        let data = await res.json();
        console.log(data)
        const reservationsContainer = document.getElementById('reservations-container');

        if (data.Data && data.Data.length > 0) {
            console.log('are')
            data.Data.forEach(booking => {
                const trainer  = booking.trainer[0].name
                booking = booking._doc
                const bookingElement = document.createElement('div');
                bookingElement.className = 'box';

                bookingElement.innerHTML = `
                    <h3>Data: ${booking.bookingDate}</h3>
                    <p>Interval orar: ${booking.bookingSlot}</p>
                    <p>Antrenor: ${trainer}</p>
                    <button class="btn delete-btn" data-id="${booking._id}">Șterge</button>
                `;

                reservationsContainer.appendChild(bookingElement);
            });

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', async function() {
                    const bookingId = this.getAttribute('data-id');
                    try {
                        let res = await fetch(`${baseUrl}/booking/remove/${bookingId}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': token
                            }
                        });
                        let result = await res.json();
                        if (result.msg.includes('deleted successfully')) {
                            alert('Rezervarea a fost ștearsă cu succes.');
                            this.parentElement.remove();
                        } else {
                            alert('Eroare la ștergerea rezervării.');
                        }
                    } catch (error) {
                        console.error('Error deleting booking:', error);
                        alert('Eroare la ștergerea rezervării.');
                    }
                });
            });

        } else {
            reservationsContainer.innerHTML = '<p>Nu aveți nicio rezervare.</p>';
        }
    } catch (error) {
        console.error('Error fetching reservations:', error);
    }
});
