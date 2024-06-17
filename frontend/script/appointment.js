let baseUrl = `http://localhost:8080`

let btnBook = document.getElementById("book_appointment");

btnBook.addEventListener("click", () => {
    let date = document.getElementById("inputdate").value;
    let slot = document.getElementById("slot-select").value;
    let token = sessionStorage.getItem("token");
    let name = sessionStorage.getItem("name");
    let trainerId = sessionStorage.getItem("trainerId");

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


async function bookAnAppointment(obj, token, name) {
    try {
        let res = await fetch(`${baseUrl}/booking/create`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `${token}`
            },
            body: JSON.stringify(obj)
        })
        let out = await res.json();
        if (out.msg == "Acest slot nu este disponibil.") {
            alert("Acest slot nu este disponibil.")
        } else if (out.msg == "rezervare nouă creată cu succes") {
            alert(`Hii ${name} Rezervarea dvs. este confirmată pe ${obj.bookingDate}`)
        } else {
            alert("Ceva nu a funcționat!")
        }
    } catch (error) {
        console.log("err", error)
        alert("Ceva nu a funcționat!")
    }
}