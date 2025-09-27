const productId = localStorage.getItem(`productId`);

async function loadItem(productId) {
    const response = await fetch(`https://api.redseam.redberryinternship.ge/api/products/${productId}`, {
        method: `GET`,
        headers: { "Accept": "application/json" }
    });

    const data = await response.json();

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
                    <p>Color: Baby pink</p>
                    <div class="color-buttons">
                    </div>
                </div>

                <div class="size-info">
                    <p>Size: L</p>
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
        colorBtn.style.backgroundColor = color;
        document.querySelector(`.color-buttons`)
            .append(colorBtn);
    })

    data.available_sizes.forEach((size) => {
        const sizeBtn = document.createElement("button");
        sizeBtn.className = "size-button";
        sizeBtn.type = "button";
        sizeBtn.innerText = size;
        document.querySelector(`.size-buttons`)
            .append(sizeBtn);
    });

    imageSelector();
    updateSelector();
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
}

