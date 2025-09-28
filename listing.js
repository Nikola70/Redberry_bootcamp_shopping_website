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

// Sort choice 

let sortChoice = `created_at`

document.querySelector(`.js-newFirst`)
    .addEventListener(`click`, () => {
        sortChoice = `created_at`;
        document.querySelector(`.sort-by-modal`).style.display = `none`;
        sortByModalDisplay = false;
        loadProducts();
    })

document.querySelector(`.js-lowToHigh`)
    .addEventListener(`click`, () => {
        sortChoice = `price`;
        document.querySelector(`.sort-by-modal`).style.display = `none`;
        sortByModalDisplay = false;
        loadProducts();
    })

document.querySelector(`.js-highToLow`)
    .addEventListener(`click`, () => {
        sortChoice = `-price`;
        document.querySelector(`.sort-by-modal`).style.display = `none`;
        sortByModalDisplay = false;
        loadProducts();
    })

// Filter Choice

let priceFrom = 0;
let priceTo = 9999;

document.querySelector(`.apply-filter-button`)
    .addEventListener(`click`, () => {
        priceFrom = parseFloat(document.querySelector(`#from`).value) || 0;
        priceTo = parseFloat(document.querySelector(`#to`).value) || 9999;
        document.querySelector(`.price-modal`).style.display = `none`;
        priceModalDisplay = false; 
        loadProducts();
    })

// Products

function pagination(meta, currentPage) {
  const footer = document.querySelector("footer");
  footer.innerHTML = `
    <img src="images/left_arrow_icon.png" id="prevPage">
    <p class="pageNumbers"></p>
    <img src="images/right_arrow_icon.png" id="nextPage">
  `;

  const pageNumbers = document.querySelector(".pageNumbers");

  for (let i = 1; i <= meta.last_page; i++) {
    pageNumbers.innerHTML += `<span class="${i === currentPage ? 'active' : ''}">${i} </span>`;
  }

document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) loadProducts(currentPage - 1);
});

document.getElementById("nextPage").addEventListener("click", () => {
  if (currentPage < meta.last_page) loadProducts(currentPage + 1);
});
pageNumbers.querySelectorAll("span").forEach((span, index) => {
  span.addEventListener("click", () => loadProducts(index + 1));
});
}

async function loadProducts(page = 1) {

//Removes item Id it is stored
  
  localStorage.removeItem(`productId`);
  
// loads products based on users input
  const url = new URL("https://api.redseam.redberryinternship.ge/api/products");
  url.searchParams.append("page", page);
  url.searchParams.append("filter[price_from]", priceFrom);
  url.searchParams.append("filter[price_to]", priceTo);
  url.searchParams.append("sort", sortChoice);

  const response = await fetch(url, {
    method: "GET",
    headers: { "Accept": "application/json" }
  });

  const productListings = await response.json();

  let html = '';
  productListings.data.forEach(product => {
    html += `
        <section class="product-list" data-id="${product.id}">        
            <article class="product">
                <img class="product-image" src="${product.cover_image}">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price}</p>
            </article>
        </section>
    `;
    document.querySelector(".product-listing-main").innerHTML = `
      ${html}
  `;
    document.querySelector(".result-count").innerHTML = `
    Showing ${productListings.meta.from}-${productListings.meta.to} of ${productListings.meta.total} results
  `;
  });

  document.querySelectorAll(".product-list").forEach(product => {
  product.addEventListener("click", () => {
    const productId = product.dataset.id;
    localStorage.setItem("productId", productId);

    window.location.href = "product_item.html"; 
  });
});

  pagination(productListings.meta, page);
}

loadProducts();
openSideCart();

// Open cart on the side

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
                <button type="submit" class="pay-button">Go to checkout</button>
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
                            <button id="minus-button">-</button>
                            <span id="quantity">${item.quantity}</span>
                            <button id="plus-button">+</button>
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


