async function displayFoodItems(cuisine = 'All') {
    const foodList = document.getElementById('food-list');
    foodList.innerHTML = '';

    try {
        const response = await fetch('/api/foods');
        if (!response.ok) {
            throw new Error('Failed to load menu');
        }

        const foods = await response.json();
        const filteredFoods = cuisine === 'All' ? foods : foods.filter(food => food.cuisine === cuisine);

        if (filteredFoods.length === 0) {
            foodList.innerHTML = '<p>No menu items available.</p>';
            return;
        }

        filteredFoods.forEach(food => {
            const foodItem = document.createElement('div');
            foodItem.classList.add('food-item');
            foodItem.tabIndex = 0;

            const foodImage = document.createElement('img');
            foodImage.src = food.image;
            foodImage.alt = food.name;

            const foodInfo = document.createElement('div');
            foodInfo.classList.add('info');

            const foodName = document.createElement('h2');
            foodName.textContent = food.name;

            const foodPrice = document.createElement('p');
            foodPrice.classList.add('price');
            foodPrice.textContent = food.price;

            foodInfo.appendChild(foodName);
            foodInfo.appendChild(foodPrice);
            foodItem.appendChild(foodImage);
            foodItem.appendChild(foodInfo);

            // Open product detail page on click
            foodItem.addEventListener('click', () => { window.location.href = `/product.html?id=${food._id}`; });
            foodItem.addEventListener('keypress', (e) => { if (e.key === 'Enter') window.location.href = `/product.html?id=${food._id}`; });

            foodList.appendChild(foodItem);
        });
    } catch (error) {
        console.error(error);
        foodList.innerHTML = '<p>Unable to load menu. Please try again later.</p>';
    }
}

// Event listener for navbar links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const selectedCuisine = event.target.getAttribute('data-cuisine');
        displayFoodItems(selectedCuisine);
    });
});

// Call the function to display all food items on page load
displayFoodItems();

// Modal creation and cart logic
function openItemModal(item) {
        let modal = document.getElementById('item-modal');
        if (!modal) {
                modal = document.createElement('div');
                modal.id = 'item-modal';
                modal.className = 'modal-overlay';
                modal.innerHTML = `
                    <div class="modal-card">
                        <button id="modal-close" class="close-btn">×</button>
                        <div class="modal-body">
                            <img id="modal-image" src="" alt="" style="width:120px;height:120px;object-fit:cover;border-radius:8px;margin-right:16px" />
                            <div>
                                <h2 id="modal-name"></h2>
                                <p id="modal-price"></p>
                                <div style="display:flex;align-items:center;gap:8px;margin-top:8px">
                                    <button id="qty-decr">−</button>
                                    <input id="qty" value="1" style="width:40px;text-align:center" />
                                    <button id="qty-incr">+</button>
                                </div>
                            </div>
                        </div>
                        <div class="modal-actions">
                            <button id="add-to-cart">Add to Cart</button>
                            <button id="view-cart">View Cart</button>
                            <button id="buy-now">Buy Now</button>
                        </div>
                    </div>`;
                document.body.appendChild(modal);

                // handlers
                modal.querySelector('#modal-close').addEventListener('click', () => modal.remove());
                modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
        }

        // populate
        modal.querySelector('#modal-image').src = item.image;
        modal.querySelector('#modal-image').alt = item.name;
        modal.querySelector('#modal-name').textContent = item.name;
        modal.querySelector('#modal-price').textContent = item.price;
        const qtyInput = modal.querySelector('#qty');
        qtyInput.value = 1;

        modal.querySelector('#qty-incr').onclick = () => { qtyInput.value = Number(qtyInput.value || 0) + 1; };
        modal.querySelector('#qty-decr').onclick = () => { qtyInput.value = Math.max(1, Number(qtyInput.value || 1) - 1); };

        modal.querySelector('#add-to-cart').onclick = () => {
            const qty = Number(qtyInput.value || 1);
            addToCart(item, qty);
            showToast('Item added to cart');
        };

        modal.querySelector('#view-cart').onclick = () => {
                window.location.href = '/cart.html';
        };

        modal.querySelector('#buy-now').onclick = async () => {
                const qty = Number(qtyInput.value || 1);
                addToCart(item, qty);
                // go to checkout page
                window.location.href = '/checkout.html';
        };

        modal.style.display = 'flex';
}

function addToCart(item, qty = 1) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(i => i._id === item._id && i.name === item.name);
    if (existing) {
        existing.qty = (existing.qty || 1) + qty;
    } else {
        cart.push(Object.assign({}, item, { qty }));
    }
    localStorage.setItem('cart', JSON.stringify(cart));
}

// update header cart badge (create it if missing)
function updateCartBadge() {
    const nav = document.querySelector('.home-nav');
    if (!nav) return;
    let cartIcon = nav.querySelector('.cart-icon');
    if (!cartIcon) {
        cartIcon = document.createElement('div');
        cartIcon.className = 'cart-icon';
        cartIcon.innerHTML = `<a href="/cart.html"><i class="fas fa-shopping-cart"></i><span class="cart-badge">0</span></a>`;
        nav.appendChild(cartIcon);
    }
    const badge = cartIcon.querySelector('.cart-badge');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cart.reduce((s,i)=> s + (i.qty||1),0);
    badge.textContent = total;
}

// keep badge updated when script loads
updateCartBadge();

// small non-blocking toast
function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = message;
    container.appendChild(t);
    // show
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(()=>t.remove(), 220); }, 1800);
}

async function buyNow(item) {
    try {
        const res = await fetch('/api/checkout/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item })
        });
        const data = await res.json();
        if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
        } else {
            alert('Unable to start checkout');
        }
    } catch (err) {
        console.error(err);
        alert('Payment initiation failed');
    }
}
