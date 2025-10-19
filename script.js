// Shopping Cart
let cart = [];
let cartCount = 0;

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Shopping Cart Sidebar Elements
const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.querySelector('.close-cart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const cartCountElement = document.querySelector('.cart-count');

// Cart Functions
function updateCartUI() {
    // Update cart count
    cartCount = cart.length;
    cartCountElement.textContent = cartCount;

    // Update cart items display
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        cartTotalElement.textContent = '$0.00';
    } else {
        let total = 0;
        cartItemsContainer.innerHTML = '';

        cart.forEach((item, index) => {
            const price = parseFloat(item.price.replace('$', ''));
            total += price;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">${item.price}</div>
                </div>
                <button class="remove-item" data-index="${index}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        cartTotalElement.textContent = `$${total.toFixed(2)}`;

        // Add remove item functionality
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCartUI();
            });
        });
    }
}

function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
}

function closeCartSidebar() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
}

// Cart Icon Click Event
cartIcon.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartSidebar);
cartOverlay.addEventListener('click', closeCartSidebar);

// Add to Cart Functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart');

addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.product-price').textContent;

        // Add to cart array
        cart.push({
            name: productName,
            price: productPrice
        });

        // Update cart UI
        updateCartUI();

        // Button feedback animation
        this.textContent = 'Added!';
        this.style.background = 'linear-gradient(135deg, #ff0088 0%, #00ff88 100%)';

        setTimeout(() => {
            this.textContent = 'Add to Cart';
            this.style.background = 'linear-gradient(135deg, #00ff88 0%, #0088ff 100%)';
        }, 1000);

        // Animate cart icon
        const cartIcon = document.querySelector('.cart-icon');
        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 300);

        console.log('Cart:', cart);

        // Show the cart sidebar briefly
        setTimeout(() => {
            openCart();
        }, 500);
    });
});

// Back to Top Button
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Newsletter Modal
const newsletterModal = document.getElementById('newsletterModal');
const newsletterOverlay = document.getElementById('newsletterOverlay');
const closeNewsletter = document.querySelector('.close-newsletter');
const newsletterForm = document.getElementById('newsletterForm');

// Show newsletter after 10 seconds or after scrolling 50%
let newsletterShown = false;

setTimeout(() => {
    if (!newsletterShown && !localStorage.getItem('newsletter_subscribed')) {
        newsletterModal.classList.add('active');
        newsletterOverlay.classList.add('active');
        newsletterShown = true;
    }
}, 10000);

window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (scrollPercent > 50 && !newsletterShown && !localStorage.getItem('newsletter_subscribed')) {
        newsletterModal.classList.add('active');
        newsletterOverlay.classList.add('active');
        newsletterShown = true;
    }
});

function closeNewsletterModal() {
    newsletterModal.classList.remove('active');
    newsletterOverlay.classList.remove('active');
}

closeNewsletter.addEventListener('click', closeNewsletterModal);
newsletterOverlay.addEventListener('click', closeNewsletterModal);

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input').value;
    console.log('Newsletter subscription:', email);
    localStorage.setItem('newsletter_subscribed', 'true');
    alert('Thank you for subscribing to BuildReign Gaming newsletter!');
    closeNewsletterModal();
});

// Product Search Functionality
function setupProductSearch(searchInputId, gridId) {
    const searchInput = document.getElementById(searchInputId);
    const grid = document.getElementById(gridId);

    if (searchInput && grid) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const products = grid.querySelectorAll('.product-card');

            products.forEach(product => {
                const productName = product.querySelector('h3').textContent.toLowerCase();
                const productDesc = product.querySelector('.product-desc').textContent.toLowerCase();

                if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
                    product.style.display = '';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }
}

// Product Sort Functionality
function setupProductSort(sortSelectId, gridId) {
    const sortSelect = document.getElementById(sortSelectId);
    const grid = document.getElementById(gridId);

    if (sortSelect && grid) {
        sortSelect.addEventListener('change', (e) => {
            const sortValue = e.target.value;
            const products = Array.from(grid.querySelectorAll('.product-card'));

            products.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
                const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));
                const ratingA = a.querySelector('.stars').textContent.match(/★/g)?.length || 0;
                const ratingB = b.querySelector('.stars').textContent.match(/★/g)?.length || 0;

                switch(sortValue) {
                    case 'price-low':
                        return priceA - priceB;
                    case 'price-high':
                        return priceB - priceA;
                    case 'rating':
                        return ratingB - ratingA;
                    default:
                        return 0;
                }
            });

            // Re-append sorted products
            products.forEach(product => grid.appendChild(product));
        });
    }
}

// Initialize search and sort for both sections
setupProductSearch('chairSearch', 'chairsGrid');
setupProductSearch('deskSearch', 'desksGrid');
setupProductSort('chairSort', 'chairsGrid');
setupProductSort('deskSort', 'desksGrid');

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe product cards for scroll animations
const productCards = document.querySelectorAll('.product-card');
productCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Observe coming soon items
const comingSoonItems = document.querySelectorAll('.coming-soon-item');
comingSoonItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `all 0.5s ease ${index * 0.1}s`;
    observer.observe(item);
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Log welcome message
console.log('%c Welcome to BuildReign Gaming! ',
    'background: linear-gradient(135deg, #00ff88 0%, #0088ff 100%); color: #0a0a0f; font-size: 20px; font-weight: bold; padding: 10px;'
);
console.log('Premium gaming furniture for champions.');
