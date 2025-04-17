document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navUl = document.querySelector('nav ul');
    
    mobileMenuBtn.addEventListener('click', function() {
        navUl.classList.toggle('show');
    });

    // Smooth scrolling for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Highlight current page in navigation
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// WhatsApp Order Form Integration
document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('whatsappOrderForm');
    
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const book = document.getElementById('book').value;
            const quantity = document.getElementById('quantity').value;
            const address = document.getElementById('address').value;
            
            // Create WhatsApp message
            const message = `📚 *New Book Order/Query* 📚\n\n` +
                            `👤 *Name:* ${name}\n` +
                            `📱 *Phone:* ${phone}\n` +
                            `📧 *Email:* ${email || 'Not provided'}\n` +
                            `📖 *Book/Query:* ${book}\n` +
                            `🔢 *Quantity:* ${quantity || '1'}\n` +
                            `🏠 *Address/Message:* ${address}\n\n` +
                            `_Sent via Half Tales Website_`;
            
            // Encode message for URL
            const encodedMessage = encodeURIComponent(message);
            
            // WhatsApp API URL
            const whatsappNumber = '919376457792'; // Your WhatsApp number without '+'
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            // Open WhatsApp in a new tab
            window.open(whatsappUrl, '_blank');
            
            // Optional: Reset form after submission
            orderForm.reset();
        });
    }
});