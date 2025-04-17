document.addEventListener('DOMContentLoaded', function() {
    // Sample book data with prices in rupees
    const books = [
        {
            id: 1,
            title: "Gunahon Ka Devta",
            author: "Dharamvir Bharati",
            price: 100,
            category: "hindi novel",
            image: "book1.jpg"
        },
        {
            id: 2,
            title: "Godaan",
            author: "प्रेमचन्द",
            price: 100,
            category: "hindi novel",
            image: "book2.jpg"
        },
        {
            id: 3,
            title: "Maila Aanchal",
            author: "फणीश्वरनाथ 'रेणु",
            price: 100,
            category: "hindi novel",
            image: "book3.jpg"
        },
        {
            id: 4,
            title: "Nirmala",
            author: "प्रेमचन्द",
            price: 120,
            category: "hindi novel",
            image: "book4.jpg"
        },
        {
            id: 5,
            title: "Nineteen Eighty-Four",
            author: "George Orwell",
            price: 349,
            category: "English novel",
            image: "booke1.jpg"
        },
        {
            id: 6,
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            price: 439,
            category: "English novel",
            image: "booke2.jpg"
        },
        {
            id: 7,
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            price: 150,
            category: "English novel",
            image: "booke3.jpg"
        },
        {
            id: 8,
            title: "Wuthering Heights",
            author: "Emily Brontë",
            price: 250,
            category: "English novel",
            image: "booke4.jpg"
        }
    ];

    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const floatingCart = document.getElementById('floatingCart');
    const cartCount = floatingCart.querySelector('.cart-count');

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navUl = document.querySelector('nav ul');
    
    mobileMenuBtn.addEventListener('click', function() {
        navUl.classList.toggle('show');
    });

    // Display books
    const bookGrid = document.getElementById('bookGrid');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    function displayBooks(filteredBooks = books) {
        bookGrid.innerHTML = '';
        
        if (filteredBooks.length === 0) {
            bookGrid.innerHTML = '<p class="no-results">No books found matching your criteria.</p>';
            return;
        }
        
        filteredBooks.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            bookCard.dataset.category = book.category;
            
            bookCard.innerHTML = `
                <img src="${book.image}" alt="${book.title}">
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <p class="author">by ${book.author}</p>
                    <span class="price">${book.price}</span>
                    <button class="add-to-cart" data-id="${book.id}">Add to Cart</button>
                </div>
            `;
            
            bookGrid.appendChild(bookCard);
        });
        
        // Add event listeners to new cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const bookId = parseInt(this.dataset.id);
                const book = books.find(b => b.id === bookId);
                
                // Check if book already in cart
                const existingItem = cart.find(item => item.id === bookId);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        ...book,
                        quantity: 1
                    });
                }
                
                updateCart();
                
                // Animation
                this.textContent = 'Added!';
                this.style.backgroundColor = '#2ecc71';
                
                setTimeout(() => {
                    this.textContent = 'Add to Cart';
                    this.style.backgroundColor = '#3498db';
                }, 2000);
            });
        });
    }

    // Filter books by category
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            
            if (category === 'all') {
                displayBooks();
            } else {
                const filteredBooks = books.filter(book => book.category === category);
                displayBooks(filteredBooks);
            }
        });
    });

    // Search functionality
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        
        if (searchTerm.trim() === '') {
            displayBooks();
            return;
        }
        
        const filteredBooks = books.filter(book => 
            book.title.toLowerCase().includes(searchTerm) || 
            book.author.toLowerCase().includes(searchTerm)
        );
        
        displayBooks(filteredBooks);
    }

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Update cart
    function updateCart() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Initialize
    displayBooks();
    updateCart();
});