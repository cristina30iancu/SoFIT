let baseUrl = `http://localhost:8080`


let loginForm = document.querySelector('.login-wrap');
let signupForm = document.querySelector('.signup-wrap');
let title = document.querySelector('title');

let signupToggleBtn = document.querySelector('#toggle-signup');
let loginToggleBtn = document.querySelector('#toggle-login');
let signupBtn = document.querySelector(".signup-btn");
let loginBtn = document.querySelector(".login-btn");

signupToggleBtn.onclick = () => {
    loginForm.classList.remove('active');
    signupForm.classList.add('active');
    title.textContent = 'Signup form';
}

loginToggleBtn.onclick = () => {
    signupForm.classList.remove('active');
    loginForm.classList.add('active');
    title.textContent = 'Login form';
}

signupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let name = document.querySelector(".signup-wrap form #name").value;
    let email = document.querySelector(".signup-wrap form #email").value;
    let password = document.querySelector(".signup-wrap form #signup-password").value;
    let address = document.querySelector(".signup-wrap form #address").value;
    let phone = document.querySelector(".signup-wrap form #telefon").value;
    if (!name || !email || !password || !address || !phone) {
        return alert("Completează toate câmpurile!")
    }
    let obj = {
        name,
        email,
        password,
        address,
        phone
    }
    registerNewUser(obj);
})

async function registerNewUser(obj) {
    try {
        let res = await fetch(`${baseUrl}/user/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        });
        let out = await res.json();
        console.log(out)
        if (out.msg === "Esti deja inregistrat!" || out.msg === "You are already registerd!") {
            alert("Esti deja inregistrat!");
        } else if (out.msg === "Înregistrare cu succes" || out.msg === "Signup Successfully") {
            // Salvează datele utilizatorului în sessionStorage pentru utilizare ulterioară
            sessionStorage.setItem("name", obj.name);
            sessionStorage.setItem("email", obj.email);
            sessionStorage.setItem("address", obj.address);
            sessionStorage.setItem("phone", obj.phone);
            alert("Te-ai înregistrat cu succes");
            window.location.href = 'index.html'; // Redirecționează utilizatorul la pagina de cont
        } else {
            alert("Ceva nu a funcționat!");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Ceva nu a funcționat!");
    }
}

loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let email = document.querySelector(".login-wrap form #email").value;
    let password = document.querySelector(".login-wrap form #password").value;
    if (email == "" || password == "") {
        return alert("Vă rugăm să completați toate compurile!")
    }
    else {
        let obj = {
            email,
            password
        }
        loginUser(obj);
    }

})

async function loginUser(obj) {
    try {
        let res = await fetch(`${baseUrl}/user/login`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
        let out = await res.json();

        if (out.msg == "Wrong Credentials") {
            alert("Wrong Credentials")
        } else if (out.msg == "login Successfull") {
            console.log(out.user)
            sessionStorage.setItem("token", out.token);
            sessionStorage.setItem("name", out.user.name);
            sessionStorage.setItem("email", out.user.email);

            sessionStorage.setItem("address", out.user.address);
            sessionStorage.setItem("phone", out.user.phone);
            alert("Te-ai înregistrat cu succes")
            window.location.href = "./index.html"
        } else {
            alert("Something went wrong!!")
        }
    } catch (error) {
        console.log("err", error)
        alert("Ceva nu a funcționat!")
    }
}
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.querySelector('.toggle-password');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordToggle.innerHTML = '<i class="bx bx-show"></i>'; // Schimbă iconița în "Vizualizare"
    } else {
        passwordInput.type = 'password';
        passwordToggle.innerHTML = '<i class="bx bx-hide"></i>'; // Schimbă iconița în "Ascundere"
    }
}
