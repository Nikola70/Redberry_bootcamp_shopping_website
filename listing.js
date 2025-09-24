// makes * red in price modal

document.addEventListener('DOMContentLoaded', () => {
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');

    const inputs = [fromInput, toInput];

    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) {
                label.style.opacity = '0';
            }
        });

        input.addEventListener('blur', () => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label && input.value.trim() === '') {
                label.style.opacity = '1';
            }
        });
    });
});

// Makes sort and filter modals work

let priceModalDisplay = false;
let sortByModalDisplay = false;

document.querySelector(`.filter`)
    .addEventListener(`click`, () => {

        if (sortByModalDisplay) {
            document.querySelector(`.sort-by-modal`).style.display = `none`;
            sortByModalDisplay = false; 
        }

        if (!priceModalDisplay) {
            document.querySelector(`.price-modal`).style.display = `flex`;
            priceModalDisplay = true;
        }

        else {
            document.querySelector(`.price-modal`).style.display = `none`;
            priceModalDisplay = false; 
        }
        
    });

document.querySelector(`.sort`)
    .addEventListener(`click`, () => {

        if (priceModalDisplay) {
            document.querySelector(`.price-modal`).style.display = `none`;
            priceModalDisplay = false; 
        }

        if (!sortByModalDisplay) {
            document.querySelector(`.sort-by-modal`).style.display = `flex`;
            sortByModalDisplay = true;
        }

        else {
            document.querySelector(`.sort-by-modal`).style.display = `none`;
            sortByModalDisplay = false; 
        }
        
    });


// Sets sets header picture to defualt avatar or users picture if it exsists

const userString = localStorage.getItem("user");

let avatarSrc = "images/avatar_icon.png";

if (userString) {

    const user = JSON.parse(userString); 
    avatarSrc = user.profile_photo || avatarSrc; 
}

document.querySelector(`.right-side`).innerHTML = 
    `<button type="button" class="to-cart">
        <img src="images/cart_icon.png">
    </button>
    <img src="${avatarSrc}" class="avatar">`;


// Sort choice 

let sortChoice = `created_at`

document.querySelector(`.js-newFirst`)
    .addEventListener(`click`, () => {
        sortChoice = `created_at`;
    })

document.querySelector(`.js-lowToHigh`)
    .addEventListener(`click`, () => {
        sortChoice = `price`;
    })

document.querySelector(`.js-highToLow`)
    .addEventListener(`click`, () => {
        sortChoice = `-price`;
    })

// Filter Choice

document.querySelector(`.`)

    let priceFrom = document.querySelector(`.from`).value || 0;
    let priceTo = 9999;


