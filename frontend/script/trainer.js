let url = `http://localhost:8080`

let boxContainer = document.querySelector("#trainers .box-container")

async function getTrainerData() {
  try {
    let res = await fetch(`${url}/trainer`)
    let data = await res.json()
    displayTrainerData(data)

  } catch (error) {
    console.log(error)
  }
}
getTrainerData()

function displayTrainerData(data) {
  boxContainer.innerHTML = ""
  boxContainer.innerHTML = `
     
      ${data.map((elem) => {
    return `
        <div class="box">
            <img src=${elem.image} alt="">
            <div class="content">
                <span>${elem.specialization}</span>
                <h3>${elem.name}</h3>
                <a href="./appointment.html?id=${elem._id}" class="btn" data-id=${elem._id}>Book Appointment</a>
                <div class="share">
                    <a href="#" class="fab fa-facebook-f"></a>
                    <a href="#" class="fab fa-twitter"></a>
                    <a href="#" class="fab fa-pinterest"></a>
                    <a href="#" class="fab fa-linkedin"></a>
                </div>
            </div>
       </div>
          `
  }).join("")}`
}

function searchEquipment() {
  var input, filter, boxes, boxContainer, h3, i, txtValue;
  input = document.getElementById("searchBox");
  filter = input.value.toUpperCase();
  boxContainer = document.getElementsByClassName("box-container");
  boxes = document.querySelectorAll(".box");

  for (i = 0; i < boxes.length; i++) {
    h3 = boxes[i].getElementsByTagName("h3")[0];
    if (h3) {
      txtValue = h3.textContent || h3.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        boxes[i].style.display = "";
      } else {
        boxes[i].style.display = "none";
      }
    }
  }
}