let baseUrl = `http://localhost:8080`

document.addEventListener("DOMContentLoaded", function() {
    var inputDate = document.getElementById("inputdate");
    inputDate.addEventListener("change", updateAvailableSlots);

    var btnBook = document.getElementById("book_appointment");
    btnBook.addEventListener("click", function() {
        var date = document.getElementById('inputdate').value;
        var slot = document.getElementById('slot-select').value;
        var trainerId = getUrlParameter('id');
        var token = sessionStorage.getItem("token");
        var name = sessionStorage.getItem("name");

        console.log("Date:", date, "Slot:", slot, "Token:", token, "Name:", name, "Trainer ID:", trainerId);

        if (!token) {
            alert("Vă rugăm să vă conectați mai întâi pentru a rezerva o întâlnire!!");
        } else if (date == "" || slot == "") {
            alert("Vă rugăm să completați toate câmpurile");
        } else {
            let obj = {
                trainerId: trainerId,
                bookingDate: date,
                bookingSlot: slot
            };
            bookAnAppointment(obj, token, name);
        }
    });
});

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

async function updateAvailableSlots() {
    var date = document.getElementById('inputdate').value;
    var trainerId = getUrlParameter('id');
    console.log("Selected Date:", date, "Trainer ID:", trainerId); // Log date and trainerId
    if (date && trainerId) {
        try {
            let res = await fetch(`${baseUrl}/trainer/${trainerId}/availability?date=${date}`,  {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem("token")
                }
            });
            let data = await res.json();
            console.log("API Response Data:", data); // Log the data received from API
            var slotSelect = document.getElementById('slot-select');
            slotSelect.innerHTML = '<option value="">--Te rog alege o oră--</option>';

            var startHour = 8;
            var endHour = 18; // Changed to 18 to include the 18:00 - 19:00 slot
            for (var hour = startHour; hour < endHour; hour++) {
                var slot = `${hour}:00 - ${hour + 1}:00`;
                if (!data.trainerBookedSlots.includes(slot) && !data.userBookedSlots.includes(slot)) {
                    var option = document.createElement('option');
                    option.value = slot;
                    option.text = slot;
                    slotSelect.appendChild(option);
                }
            }
        } catch (error) {
            console.error('Error fetching availability:', error);
        }
    }
}


async function bookAnAppointment(obj, token, name) {
    try {
        console.log('obj is', obj)
        let res = await fetch(`${baseUrl}/booking/create`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `${token}`
            },
            body: JSON.stringify(obj)
        });
        let out = await res.json();
        if (out.msg == "Acest slot nu este disponibil.") {
            alert("Acest slot nu este disponibil.");
        } else if (out.msg == "rezervare nouă creată cu succes") {
            alert(`${name}, Rezervarea dvs. este confirmată pe ${obj.bookingDate}`);
            updateAvailableSlots()
        } else if(out.msg == "Deja ți-ai atins limita!"){
            alert(out.msg);
        }
        else {
            alert("Ceva nu a funcționat!");
        }
    } catch (error) {
        console.log("err", error);
        alert("Ceva nu a funcționat!");
    }
}
