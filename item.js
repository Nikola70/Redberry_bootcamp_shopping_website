const productId = localStorage.getItem(`productId`);

async function loadItem(productId) {
    const response = await fetch(`https://api.redseam.redberryinternship.ge/api/products/${productId}`, {
        method: `GET`,
        headers: { "Accept": "application/json" }
    });

    const data = await response.json();

    // Sets sets header picture to defualt avatar or users picture if it exsists

    const userData = localStorage.getItem("user");

    let avatarSrc = "images/avatar_icon.png";

    if (userData) {
    const user = JSON.parse(userData); 
    avatarSrc = user.avatar || avatarSrc;
    }

    document.querySelector(`.right-side`).innerHTML = 
    `<button type="button" class="to-cart">
        <img src="images/cart_icon.png">
    </button>
    <img src="${avatarSrc}" class="avatar">`;

    const productHTML = `           
            <section class="product-images">
                <div class="image-previews">
                </div>
            </section>

            <div class="main-image-container">
                <img class="cover-image" src="${data.cover_image}">
            </div>
            
            <section class="product-info">
                <h2>${data.name}</h2>
                <h3 class="product-price">$ ${data.price}</h3>

                <div class="color-info">
                    <p class="js-color-text"></p>
                    <div class="color-buttons">
                    </div>
                </div>

                <div class="size-info">
                    <p class="js-size-text"></p>
                    <div class="size-buttons">
                    </div>
                </div>

                <div class="quantity-info">
                    <p>Quantity</p>
                    <select name="quantity">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                    </select>
                </div>
                
                <button type="submit" class="add-to-cart-button">
                    <img src="images/white_shopping-cart_icon.png">
                    Add to cart
                </button>

                <hr>

                <div class="product-description">
                    <span class="description-header">
                        <h2>Details</h2>
                        <img src="${data.brand.image}">
                    </span>
                    <h3>Brand: ${data.brand.name}</h3>
                    <p>${data.description}</p>
                </div>
            </section>
    `

    document.querySelector(`.product-details`)
        .innerHTML = productHTML;

    data.images.forEach( (image) => {
        const img = document.createElement("img");
        img.src = image;
        img.className = "item-image";
        document.querySelector(`.image-previews`)
            .append(img);
    });

    data.available_colors.forEach((color) => {
        const colorBtn = document.createElement("button");
        colorBtn.className = "color-button";
        colorBtn.type = "button";
        colorBtn.dataset.id = color;
        colorBtn.style.backgroundColor = color;
        document.querySelector(`.color-buttons`)
            .append(colorBtn);
    })

    data.available_sizes.forEach((size) => {
        const sizeBtn = document.createElement("button");
        sizeBtn.className = "size-button";
        sizeBtn.type = "button";
        sizeBtn.dataset.id = size;
        sizeBtn.innerText = size;
        document.querySelector(`.size-buttons`)
            .append(sizeBtn);
    });

    imageSelector();
    updateSelector();
    colorHighlighter();
    sizeHighlighter();
};

loadItem(productId);

const minusButton = document.getElementById('minus-button');
const plusButton = document.getElementById('plus-button');
const quantitySpan = document.getElementById('quantity');

let quantity = 1;

// Function to update the number and button states
function updateSelector() {
    quantitySpan.textContent = quantity;
    minusButton.disabled = (quantity <= 1);
}
    plusButton.addEventListener('click', () => {
        quantity++;
        updateSelector();
});

minusButton.addEventListener('click', () => {
    if (quantity > 1) {
        quantity--;
        updateSelector();
    }
});


// changes cover image, when other image is selected
function imageSelector() {
    let coverImage = document.querySelector(`.cover-image`)

    document.querySelectorAll(`.item-image`).forEach( (image) => {
        image.addEventListener(`click`, () => {
            coverImage.src = image.src;
    })
})
};

// Change color name based on which color is selected

function colorHighlighter() {
    const colorButton = document.querySelectorAll(`.color-button`);

    colorButton.forEach( (button) => {
        button.addEventListener(`click`, () => {
            //removes outline from other color buttons
            colorButton.forEach((button) => button.style.outline = `none`);

            //Adds outline to selected color
            button.style.outline = `3px solid var(--BORDER-COLOR)`;
            button.style.outlineOffset = `5px`;

            //Displays text of a selected color
            document.querySelector(`.js-color-text`)
                .innerText = button.dataset.id;
    });
});
};

// Change size text and highlight selected size

function sizeHighlighter() {
    const sizeButton = document.querySelectorAll(`.size-button`);

    sizeButton.forEach( (button) => {                
        button.addEventListener(`click`, () => {
            //Removes styles from other size button
            sizeButton.forEach((button) => button.style.border = `1px solid var(--BORDER-COLOR)`);

            //Highligh selected size button
            button.style.border = `1px solid var(--FONT-COLOR)`;
            
            //Displays text of a selecte size
            document.querySelector(`.js-size-text`)
                .innerText = `Size: ${button.innerText}`
    });
});
};