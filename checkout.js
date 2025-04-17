document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const checkoutForm = document.getElementById('checkoutForm');
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navUl = document.querySelector('nav ul');
    
    mobileMenuBtn.addEventListener('click', function() {
        navUl.classList.toggle('show');
    });

    // Display cart items
    function displayCartItems() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="books.html" class="btn">Browse Books</a>
                </div>
            `;
            return;
        }
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="item-details">
                    <h4>${item.title}</h4>
                    <div class="item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <div class="item-actions">
                    <span class="item-price">${item.price * item.quantity}</span>
                    <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.dataset.id);
                updateQuantity(itemId, -1);
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.dataset.id);
                updateQuantity(itemId, 1);
            });
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.dataset.id);
                removeItem(itemId);
            });
        });
        
        updateOrderTotals();
    }

    // Update item quantity
    function updateQuantity(itemId, change) {
        const itemIndex = cart.findIndex(item => item.id === itemId);
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity += change;
            
            if (cart[itemIndex].quantity < 1) {
                cart.splice(itemIndex, 1);
            }
            
            saveCart();
            displayCartItems();
        }
    }

    // Remove item from cart
    function removeItem(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        saveCart();
        displayCartItems();
    }

    // Update order totals
    function updateOrderTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 0; // Flat shipping rate
        const total = subtotal + shipping;
        
        subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
        totalElement.textContent = `₹${total.toFixed(2)}`;
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count in other pages
        if (window.opener) {
            window.opener.postMessage({type: 'cartUpdate', cart: cart}, '*');
        }
    }

    // WhatsApp order submission
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        
        // Create order summary for WhatsApp
        let message = `*New Order - Half Tales*%0A%0A`;
        message += `*Customer Name:* ${name}%0A`;
        message += `*Phone:* ${phone}%0A%0A`;
        message += `*Order Summary:*%0A`;
        
        cart.forEach(item => {
            message += `📖 ${item.title} (x${item.quantity}) - ₹${item.price * item.quantity}%0A`;
        });
        
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 0;
        const total = subtotal + shipping;
        
        message += `%0A*Subtotal:* ₹${subtotal.toFixed(2)}%0A`;
        message += `*Shipping:* ₹${shipping.toFixed(2)}%0A`;
        message += `*Total:* ₹${total.toFixed(2)}%0A%0A`;
        message += `*Delivery Address:*%0A${address}%0A%0A`;
        message += `_Thank you for your order!_`;
        
        // Open WhatsApp with order details
        window.open(`https://wa.me/919376457792?text=${message}`, '_blank');
        
        // Clear cart after order
        cart = [];
        saveCart();
        displayCartItems();
        this.reset();
        
        // Show confirmation
        alert('Your order has been placed successfully! We will contact you shortly.');
    });

    // Initialize
    displayCartItems();
});