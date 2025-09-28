// Sets sets header picture to defualt avatar or users picture if it exsists
// Automatically fills out email field

const userData = localStorage.getItem("user");

let avatarSrc = "images/avatar_icon.png";

if (userData) {
  const user = JSON.parse(userData); 
  avatarSrc = user.avatar || avatarSrc;
  document.getElementById('email').value = user.email || null;
}

document.querySelector(`.right-side`).innerHTML = 
  `<button type="button" class="to-cart">
      <img src="images/cart_icon.png">
  </button>
  <img src="${avatarSrc}" class="avatar">`;

// Renders side cart

async function renderSideCart() {
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
            return;
        }

        const totalPrice = data.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const sideHTMLMain = `
            <span class="side-cart-header">
                <h1>Shopping cart (${data.length})</h1>
                <button class="side-cart-cross" onclick="document.querySelector('.side-cart').style.display = 'none';">
                    <img src="images/cross_icon.png">
                </button>
            </span>
            <section class="js-product-list"></section>
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
                <a href="checkout.html">
                    <button type="submit" class="pay-button">Go to checkout</button>
                </a>
            </section>
        `;

        document.querySelector(`.side-cart`).style.display = `flex`;
        document.querySelector(`.side-cart`).innerHTML = sideHTMLMain;

        data.forEach((item) => {
            const sideCartItemHTML = `
                <section class="product-in-cart js-clear-${item.id}">
                    <img src="${item.cover_image}">
                    <span class="product-checkout">            
                        <h2>${item.name}</h2>
                        <p class="product-checkout-color">${item.color}</p>
                        <p class="product-checkout-size">M</p>
                        <div class="quantity-selector">
                            <button class="minus-button">-</button>
                                <span class="quantity">${item.quantity}</span>
                            <button class="plus-button">+</button>
                        </div>
                    </span>
                    <span class="product-checkout-right-side">
                        <h2>$ ${item.total_price}</h2>
                        <button type="button" class="button-remove-item" data-id="${item.id}">Remove</button>
                    </span>
                </section>
            `;
            document.querySelector(`.js-product-list`).innerHTML += sideCartItemHTML;
        });
        document.querySelectorAll('.product-in-cart').forEach(product => {
            const minusButton = product.querySelector('.minus-button');
            const plusButton = product.querySelector('.plus-button');
            const quantitySpan = product.querySelector('.quantity');
            const productId = product.querySelector('.button-remove-item').dataset.id;

            let quantity = parseInt(quantitySpan.innerText);

            // Update the UI and button states
            function updateSelector() {
                quantitySpan.innerText = quantity;
                minusButton.disabled = (quantity <= 1);
            };

            // Update quantity on the server
            async function updateCartQuantity(newQuantity) {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("User not logged in");
                    return;
                }

                try {
                    const response = await fetch(
                        `https://api.redseam.redberryinternship.ge/api/cart/products/${productId}`,
                        {
                            method: 'PATCH',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ quantity: newQuantity })
                        }
                    );

                } catch (error) {
                    console.error("Error updating cart quantity:", error);
                }
            }

            plusButton.addEventListener('click', async () => {
                quantity++;
                updateSelector();
                await updateCartQuantity(quantity);
                renderSideCart();
            });

            minusButton.addEventListener('click', async () => {
                if (quantity > 1) {
                    quantity--;
                    updateSelector();
                    await updateCartQuantity(quantity);
                    renderSideCart();
                }
            });


            updateSelector();
        });

        document.querySelectorAll(`.button-remove-item`).forEach(button => {
            button.addEventListener('click', async () => {
                await removeProductFromCart(button.dataset.id);
                renderSideCart();
            });
        });

    } catch (error) {
        console.error("Error fetching cart:", error);
    }
}

//Opens side cart when cart icon is clicked
function openSideCart() {
    document.querySelector(`.to-cart`)
        .addEventListener(`click`, renderSideCart);
}


//romeves item from cart
async function removeProductFromCart(productId) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in");
        return;
    }

    try {
        const response = await fetch(`https://api.redseam.redberryinternship.ge/api/cart/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert(`Item removed from cart!`)
        } else {
            alert(response.status)
        }

    } catch (error) {
        alert(error);
    }
}

//Renders chechout cart 

async function renderCheckoutCart() {
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

        const totalPrice = data.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const chekhoutCartHTMLMain = `
        <section class="checkout-cart">
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

        <button type="submit" class="pay-button">Pay</button>

      </section>
        `;
        document.querySelector(`.checkout-final`).innerHTML = chekhoutCartHTMLMain;

        data.forEach((item) => {
            const chechoutCartItemHTML = `
            <section class="product-in-cart js-clear-${item.id}">

                <img src="${item.cover_image}">

                <span class="product-checkout">            
                    <h2>${item.name}</h2>
                    <p class="product-checkout-color">${item.color}</p>
                    <p class="product-checkout-size">L</p>
                        <div class="quantity-selector">
                        <button class="minus-button">
                            <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1H11" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="plus-button" aria-label="Increase quantity">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 1V11" stroke="#374151" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M1 6H11" stroke="#374151" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        </div>
                </span>
                
                <span class="product-checkout-right-side">

                    <h2>$ ${item.total_price}</h2>

                    <button type="button" class="button-remove-item" data-id="${item.id}">Remove</button>
                </span>
            </section>
                        `;
            document.querySelector(`.checkout-cart`).innerHTML += chechoutCartItemHTML;
        });
        document.querySelectorAll('.product-in-cart').forEach(product => {
            const minusButton = product.querySelector('.minus-button');
            const plusButton = product.querySelector('.plus-button');
            const quantitySpan = product.querySelector('.quantity');
            const productId = product.querySelector('.button-remove-item').dataset.id;

            let quantity = parseInt(quantitySpan.innerText);

            // Update the UI and button states
            function updateSelector() {
                quantitySpan.innerText = quantity;
                minusButton.disabled = (quantity <= 1);
            };

            // Update quantity on the server
            async function updateCartQuantity(newQuantity) {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("User not logged in");
                    return;
                }

                try {
                    await fetch(
                        `https://api.redseam.redberryinternship.ge/api/cart/products/${productId}`,
                        {
                            method: 'PATCH',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ quantity: newQuantity })
                        }
                    );

                } catch (error) {
                    console.error("Error updating cart quantity:", error);
                }
            }

            plusButton.addEventListener('click', async () => {
                quantity++;
                updateSelector();
                await updateCartQuantity(quantity);
                location.reload();
            });

            minusButton.addEventListener('click', async () => {
                if (quantity > 1) {
                    quantity--;
                    updateSelector();
                    await updateCartQuantity(quantity);
                    location.reload();
                }
            });


            updateSelector();
        });

        document.querySelectorAll(`.button-remove-item`).forEach(button => {
            button.addEventListener('click', async () => {
                await removeProductFromCart(button.dataset.id);
                location.reload();
            });
        });

    } catch (error) {
        console.error("Error fetching cart:", error);
    }
}

openSideCart();
renderCheckoutCart();