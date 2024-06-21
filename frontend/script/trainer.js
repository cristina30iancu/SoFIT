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

async function getSubs() {
  const res = await fetch(`http://localhost:8080/subscriptions/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': sessionStorage.getItem("token")
    }
  });

  const data = await res.json(); console.log(data)
  if (data.subscriptions && data.subscriptions.length > 0) {
    return data.subscriptions[0].type
  }
  return undefined
}

async function getRezervari() {
  try {
    let res = await fetch(`${baseUrl}/booking/userId`, {
      headers: {
        'Authorization': token
      }
    });
    let data = await res.json();
    console.log(data)

    if (data.Data && data.Data.length >= 7) {
      return 'style="display:none;"'
    }
    return ''
  } catch (error) {
    console.error('Error fetching reservations:', error);
  }
}

async function displayTrainerData(data) {
  const type = await getSubs();
  let hidden = ""
  if (type == 'Basic Plan') {
    hidden = 'style="display:none;"'
  } else {
    hidden = await getRezervari()
  }
  boxContainer.innerHTML = ""
  boxContainer.innerHTML = `
     
      ${data.map((elem) => {
    return `
        <div class="box">
            <img src=${elem.image} alt="">
            <div class="content">
                <span>${elem.specialization}</span>
                <h3>${elem.name}</h3>
                <a href="./appointment.html?id=${elem._id}" ${hidden}  class="btn" data-id=${elem._id}>Rezervă</a>
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