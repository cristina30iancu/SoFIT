let menu = document.querySelector('#menu-btn');
let navbar = document.querySelector('.header .navbar');
let baseUrl = `http://localhost:8080`

if (sessionStorage.getItem("token")) {
    document.getElementById("signup").textContent = "Bună, " + sessionStorage.getItem("name");
    // Setează href la cont.html pentru redirecționare
    document.getElementById("signup").setAttribute("href", "cont.html");
} else {
    document.getElementById("logout").style.display = "none";
}

document.getElementById("logout").onclick = () => {
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("token");
    alert("Ai ieșit din cont!");
    window.location.href = "./index.html"
}

menu.onclick = () => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
    console.log("clicked")
};

window.onscroll = () => {
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
};

document.addEventListener("DOMContentLoaded", async () => {
    async function showReviews() {
        try {
            let res = await fetch(`${baseUrl}/reviews/`);
            let out = await res.json();
            populateSwiper(out.reviews);
        } catch (error) {
            console.error("Error:", error);
            alert("Ceva nu a funcționat!");
        }
    }
    await showReviews();
    const swiper = new Swiper('.my-w', {
        spaceBetween: 20,
        grabCursor: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
        loop: true,
        autoplay: {
            delay: 7500,
            disableOnInteraction: false,
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            600: {
                slidesPerView: 2,
            },
        },
    });
    swiper.on('slideChange', () => {
        console.log('Slide changed');
    });
    
    swiper.on('transitionEnd', () => {
        console.log('Transition ended');
    });
});

var swiper = new Swiper(".home-slider", {
    spaceBetween: 20,
    effect: "fade",
    grabCursor: true,
    loop: true,
    centeredSlides: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
});

function createSwiperSlide(review) {
    const reviewItem = document.createElement('div');
    reviewItem.classList.add('review-item');
    reviewItem.innerHTML = `
        <p>${review.review}</p>
        <div>
            <h3>${review.name}</h3><br></br>
            <span>${review.occupation}</span> 
            <i class="fas fa-quote-right"></i>
        </div>
    `;
    return reviewItem
}

function populateSwiper(data) {
    const swiperWrapper = document.getElementById('review-container');
    data.forEach(item => {
        const slide = createSwiperSlide(item);
        swiperWrapper.appendChild(slide);
    });
}

var swiper = new Swiper(".blogs-slider", {
    spaceBetween: 20,
    grabCursor: true,
    loop: true,
    autoplay: {
        delay: 7500,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        991: {
            slidesPerView: 3,
        },
    },
});

const allStar = document.querySelectorAll('.rating .star')
const ratingValue = document.querySelector('.rating input')

allStar.forEach((item, idx) => {
    item.addEventListener('click', function () {
        let click = 0
        ratingValue.value = idx + 1

        allStar.forEach(i => {
            i.classList.replace('bxs-star', 'bx-star')
            i.classList.remove('active')
        })
        for (let i = 0; i < allStar.length; i++) {
            if (i <= idx) {
                allStar[i].classList.replace('bx-star', 'bxs-star')
                allStar[i].classList.add('active')
            } else {
                allStar[i].style.setProperty('--i', click)
                click++
            }
        }
    })
})