let cart = [];

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCartUI();
    
    // Tiny animation on floating cart to show feedback
    const cartEl = document.getElementById('floatingCart');
    cartEl.style.transform = 'translateY(-10px)';
    setTimeout(() => {
        cartEl.style.transform = 'translateY(0)';
    }, 150);
}

function updateQuantity(name, change) {
    const item = cart.find(i => i.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.name !== name);
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const cartEl = document.getElementById('floatingCart');
    const itemsEl = document.getElementById('cartItems');
    const countEl = document.getElementById('cartCount');
    const totalEl = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartEl.classList.remove('visible');
        return;
    }

    cartEl.classList.add('visible');
    
    itemsEl.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="item-details">
                <h4>Sigma ${item.name}</h4>
                <div class="item-price">Rp ${(item.price).toLocaleString('id-ID')}</div>
            </div>
            <div class="item-quantity">
                <button class="qty-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
            </div>
        `;
        itemsEl.appendChild(div);
    });

    countEl.textContent = `${count} Box${count > 1 ? 'es' : ''}`;
    totalEl.textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

function checkoutWhatsApp() {
    if (cart.length === 0) return;

    let message = "Hello Sigma Water, I would like to place an order for delivery in Sulawesi:\n\n";
    let total = 0;

    cart.forEach(item => {
        message += `📦 ${item.quantity}x Box of ${item.name}\n`;
        message += `   (Subtotal: Rp ${(item.price * item.quantity).toLocaleString('id-ID')})\n`;
        total += item.price * item.quantity;
    });

    message += `\n*Total Estimate: Rp ${total.toLocaleString('id-ID')}*\n\n`;
    message += "Please let me know the shipping cost and payment details. Thank you!";

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/6281234567890?text=${encoded}`, '_blank');
}

function cancelOrder() {
    cart = [];
    updateCartUI();
}
