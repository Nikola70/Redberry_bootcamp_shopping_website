const productId = localStorage.getItem(`productId`);
let color = 0;
let size = 0;

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
                    <select name="quantity" class = "js-quantity-selector">
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
    addItemToCart();
    openSideCart();


};

loadItem(productId);

const minusButton = document.getElementById('minus-button');
const plusButton = document.getElementById('plus-button');
const quantitySpan = document.getElementById('quantity');

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

// Changes and saves color name based on which color is selected

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

            //save users color choice
            color = button.dataset.id;
    });
});
};

// Changes and saves size choice and highlightes selected size

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
            
            //Save users size choice
            size = button.innerText;
    });
});
};

// Adds item to cart, if user is signed in

function addItemToCart() {
    document.querySelector(`.add-to-cart-button`)
        .addEventListener(`click`, async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You need to be signed in to add items to cart");
                return;
            }

            // makes sure color os selected
            if (color === 0) {
                alert("Please select a color");
                return;
            }

            // makes sure color os selected
            if (size === 0) {
                alert("Please select a size");
                return;
            }

            let quantity = document.querySelector(`.js-quantity-selector`).value;

            try {                
                const response = await fetch(`https://api.redseam.redberryinternship.ge/api/cart/products/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        color: color,
                        size: size,
                        quantity: quantity
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    alert("Item added to cart successfully!");
                    console.log("Added to cart:", data);
                } 
            } catch (error) {
                console.error("Error adding item to cart:", error);
                alert("Network error. Please check your connection and try again.");
            }
            
        })
};

// Open cart on the side

function openSideCart() {
    document.querySelector(`.to-cart`)
        .addEventListener(`click`, async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please log in first.");
                return;
            }

            try {
                const response = await fetch(`https://api.redseam.redberryinternship.ge/api/cart`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                console.log(data);

                if (data.length === 0) {
                    document.querySelector(`.empty-side-cart`).style.display = `flex`;
                } else {
                    const totalPrice = data.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    const sideHTMLMain = `
                    <span class="side-cart-header">
                        <h1>Shopping cart (${data.length})</h1>
                        <button class="side-cart-cross" onclick="document.querySelector('.side-cart').style.display = 'none';">
                            <img src="images/cross_icon.png">
                        </button>
                    </span>
                    <section class="js-product-list">
                    </section>
                    <section class="price-calculation">

                    <span class="item-subtotal">
                        <h3>Item Subtotal</h3>
                        <h3>$ ${totalPrice}</h3>
                    </span>

                    <span class="delivery-fee">
                        <h3>Delivery</h3>
                        <h3>$5</h3>
                    </span>

                    <span class="total-price">
                    <h2>Total</h2>
                    <h2>$ ${totalPrice + 5}</h2>
                    </span>

                    <button type="submit" class="pay-button">Go to checkout</button>

                </section>
                    `
                    document.querySelector(`.side-cart`).style.display = `flex`;
                    document.querySelector(`.side-cart`).innerHTML = sideHTMLMain;         
                              
                    let sideCartItemHTML = ``

                    data.forEach((item) => {
                        document.createElement(`section`);
                        sideCartItemHTML = `
                        <section class="product-in-cart ">

                            <img src="${item.cover_image}">

                            <span class="product-checkout">            
                                <h2>${item.name}</h2>
                                <p class="product-checkout-color">${item.color}</p>
                                <p class="product-checkout-size">M</p>
                                <div class="quantity-selector">
                                    <button id="minus-button">
                                        <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1H11" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </button>
                                    <span id="quantity">${item.quantity}</span>
                                    <button id="plus-button" aria-label="Increase quantity">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 1V11" stroke="#374151" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M1 6H11" stroke="#374151" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                            </span>
                            
                            <span class="product-checkout-right-side">

                                <h2>$ ${item.total_price}</h2>

                                <button type="button" class="button-remove-item">Remove</button>
                            </span>
                        </section>
                        `;
                        document.querySelector(`.js-product-list`).innerHTML += sideCartItemHTML;
                    });                        
                };

            } catch (error) {
                console.error("Error fetching cart:", error);
            };
            document.querySelector(`.js-start-shopping`)
                        .addEventListener(`click`, () => {
                            window.location.href = "product_listing.html";
            })
        });
};

