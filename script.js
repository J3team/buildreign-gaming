// Product Database
const productData = {
    'pro-elite': {
        name: 'BuildReign Pro Elite',
        price: 399.99,
        image: 'https://via.placeholder.com/300x300/1a1a2e/00ff88?text=Pro+Elite',
        rating: '★★★★★',
        reviews: '(247 reviews)',
        description: 'The Pro Elite is our flagship gaming chair, engineered for professional gamers and content creators who demand the best. With premium materials, advanced ergonomics, and industry-leading adjustability, this chair delivers unmatched comfort during marathon gaming sessions.',
        features: ['Premium ergonomic design with lumbar support', '4D adjustable armrests', 'High-density cold-cure foam padding', 'Reclining backrest up to 180 degrees', 'Heavy-duty metal frame - 350 lbs capacity', 'Smooth-rolling PU caster wheels']
    },
    'apex-series': {
        name: 'BuildReign Apex Series',
        price: 299.99,
        image: 'https://via.placeholder.com/300x300/1a1a2e/ff0088?text=Apex+Series',
        rating: '★★★★☆',
        reviews: '(189 reviews)',
        description: 'Experience racing-inspired comfort with the Apex Series. Featuring premium PU leather upholstery and a sporty design, this chair brings motorsport aesthetics to your gaming setup without compromising on comfort or functionality.',
        features: ['Racing-style bucket seat design', 'Premium PU leather upholstery', 'Adjustable reclining backrest', 'Integrated headrest and lumbar cushions', 'Sturdy 5-star base with smooth casters', '2-year manufacturer warranty']
    },
    'titan-x': {
        name: 'BuildReign Titan X',
        price: 449.99,
        image: 'https://via.placeholder.com/300x300/1a1a2e/0088ff?text=Titan+X',
        rating: '★★★★★',
        reviews: '(312 reviews)',
        description: 'Built for serious gamers who need maximum support, the Titan X features an extra-wide seat, heavy-duty construction, and memory foam cushioning. Perfect for extended gaming marathons and all-day comfort.',
        features: ['Extra-wide seat (up to 21 inches)', 'Memory foam padding throughout', 'Heavy-duty construction - 400 lbs capacity', 'Multi-functional tilt mechanism', 'Breathable fabric with cooling technology', 'Fully adjustable height and armrests']
    },
    'command-center': {
        name: 'Command Center Pro',
        price: 599.99,
        image: 'https://via.placeholder.com/300x300/1a1a2e/00ff88?text=Command+Center',
        rating: '★★★★★',
        reviews: '(198 reviews)',
        description: 'Transform your gaming space with the Command Center Pro. This L-shaped gaming desk offers massive workspace, built-in RGB lighting, and comprehensive cable management to keep your battlestation organized and immersive.',
        features: ['L-shaped design with 60+ inch total length', 'Integrated RGB LED lighting system', 'Built-in cable management channels', 'Reinforced steel frame construction', 'Smooth carbon fiber texture surface', 'Dedicated monitor stand and cup holder']
    },
    'battlestation-v2': {
        name: 'Battlestation V2',
        price: 799.99,
        image: 'https://via.placeholder.com/300x300/1a1a2e/ff0088?text=Battlestation+V2',
        rating: '★★★★★',
        reviews: '(276 reviews)',
        description: 'Level up your ergonomics with the Battlestation V2 electric standing desk. Seamlessly switch between sitting and standing with programmable height presets, promoting better health and focus during long gaming or work sessions.',
        features: ['Electric height adjustment (28" - 48")', '4 programmable memory presets', 'Dual-motor lift system for stability', 'Anti-collision technology', 'Spacious 60" x 30" desktop', 'Premium laminate surface with beveled edges']
    },
    'compact-elite': {
        name: 'Compact Elite',
        price: 349.99,
        image: 'https://via.placeholder.com/300x300/1a1a2e/0088ff?text=Compact+Elite',
        rating: '★★★★☆',
        reviews: '(143 reviews)',
        description: 'Perfect for smaller spaces, the Compact Elite doesn\'t compromise on features. With an integrated monitor stand, cable management, and a sturdy build, this desk maximizes functionality in a space-efficient design.',
        features: ['Space-efficient 48" x 24" surface', 'Elevated monitor stand platform', 'Built-in cable management grommets', 'Integrated cup holder and headphone hook', 'Sturdy metal frame with adjustable feet', 'Easy assembly with included tools']
    }
};

// Shopping Cart and State
let cart = [];
let cartCount = 0;
let promoCode = null;
let discountPercent = 0;
const validPromoCodes = {
    'BUILDREIGN10': 10,
    'GAMER20': 20,
    'WELCOME15': 15
};
let wishlist = [];
let currentQuickViewProduct = null;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    // Initialize scroll progress
    initScrollProgress();

    // Initialize Quick View buttons
    initQuickView();

    // Initialize promo code functionality
    initPromoCode();

    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

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

    // Shopping Cart
    initCart();

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Newsletter Modal
    const newsletterModal = document.getElementById('newsletterModal');
    const newsletterOverlay = document.getElementById('newsletterOverlay');
    const closeNewsletter = document.querySelector('.close-newsletter');
    const newsletterForm = document.getElementById('newsletterForm');

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

    if (closeNewsletter) closeNewsletter.addEventListener('click', closeNewsletterModal);
    if (newsletterOverlay) newsletterOverlay.addEventListener('click', closeNewsletterModal);

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            localStorage.setItem('newsletter_subscribed', 'true');
            showToast('Success!', 'Thanks for subscribing to BuildReign Gaming!', '✓');
            closeNewsletterModal();
        });
    }

    // Product Search & Sort
    setupProductSearch('chairSearch', 'chairsGrid');
    setupProductSearch('deskSearch', 'desksGrid');
    setupProductSort('chairSort', 'chairsGrid');
    setupProductSort('deskSort', 'desksGrid');

    // Scroll Animations
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

    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    const comingSoonItems = document.querySelectorAll('.coming-soon-item');
    comingSoonItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.5s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    // Parallax hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    console.log('%c Welcome to BuildReign Gaming! ',
        'background: linear-gradient(135deg, #00ff88 0%, #0088ff 100%); color: #0a0a0f; font-size: 20px; font-weight: bold; padding: 10px;'
    );
    console.log('Premium gaming furniture for champions.');
}

// Scroll Progress Indicator
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Toast Notifications
function showToast(title, message, icon = '✓') {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toastIcon.textContent = icon;

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function hideToast() {
    document.getElementById('toast').classList.remove('show');
}

// Quick View Modal
function initQuickView() {
    const quickViewButtons = document.querySelectorAll('.btn-quick-view');
    quickViewButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = this.getAttribute('data-product');
            openQuickView(productId);
        });
    });
}

function openQuickView(productId) {
    const product = productData[productId];
    if (!product) return;

    currentQuickViewProduct = productId;

    document.getElementById('qvImage').src = product.image;
    document.getElementById('qvImage').alt = product.name;
    document.getElementById('qvName').textContent = product.name;
    document.getElementById('qvRating').textContent = product.rating;
    document.getElementById('qvReviews').textContent = product.reviews;
    document.getElementById('qvPrice').textContent = '$' + product.price.toFixed(2);
    document.getElementById('qvDescription').textContent = product.description;

    const featuresList = document.getElementById('qvFeatures');
    featuresList.innerHTML = '';
    product.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });

    document.getElementById('qvQuantity').value = 1;
    document.getElementById('quickViewModal').classList.add('active');
}

function closeQuickView() {
    document.getElementById('quickViewModal').classList.remove('active');
    currentQuickViewProduct = null;
}

function increaseQuantity() {
    const input = document.getElementById('qvQuantity');
    if (input.value < 99) {
        input.value = parseInt(input.value) + 1;
    }
}

function decreaseQuantity() {
    const input = document.getElementById('qvQuantity');
    if (input.value > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

function addToCartFromQuickView() {
    if (!currentQuickViewProduct) return;

    const product = productData[currentQuickViewProduct];
    const quantity = parseInt(document.getElementById('qvQuantity').value);

    for (let i = 0; i < quantity; i++) {
        cart.push({
            id: currentQuickViewProduct,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    updateCartUI();
    closeQuickView();
    showToast('Added to Cart!', `${quantity}x ${product.name} added to your cart`, '🛒');
}

function toggleWishlist() {
    const btn = document.querySelector('.btn-wishlist');
    if (btn.classList.contains('active')) {
        btn.classList.remove('active');
        showToast('Removed', 'Item removed from wishlist', '💔');
    } else {
        btn.classList.add('active');
        showToast('Added to Wishlist!', 'Item saved to your wishlist', '❤️');
    }
}

// Shopping Cart
function initCart() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.querySelector('.close-cart');

    if (cartIcon) cartIcon.addEventListener('click', openCart);
    if (closeCart) closeCart.addEventListener('click', closeCartSidebar);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCartSidebar);

    // Add to Cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPriceText = productCard.querySelector('.product-price').textContent;
            const productPrice = parseFloat(productPriceText.replace('$', ''));

            // Find product ID
            const quickViewBtn = productCard.querySelector('.btn-quick-view');
            const productId = quickViewBtn ? quickViewBtn.getAttribute('data-product') : null;

            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1
            });

            updateCartUI();

            // Button animation
            this.classList.add('adding');
            this.textContent = 'Adding...';

            setTimeout(() => {
                this.classList.remove('adding');
                this.classList.add('added');
                this.textContent = 'Added!';

                setTimeout(() => {
                    this.classList.remove('added');
                    this.textContent = 'Add to Cart';
                }, 1000);
            }, 500);

            // Cart icon animation
            if (cartIcon) {
                cartIcon.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    cartIcon.style.transform = 'scale(1)';
                }, 300);
            }

            showToast('Added to Cart!', `${productName} added to your cart`, '🛒');

            setTimeout(() => {
                openCart();
            }, 800);
        });
    });

    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCountElement = document.querySelector('.cart-count');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    const cartDiscount = document.getElementById('cartDiscount');
    const discountRow = document.getElementById('discountRow');

    // Merge cart items by id
    const mergedCart = {};
    cart.forEach(item => {
        if (mergedCart[item.id]) {
            mergedCart[item.id].quantity++;
        } else {
            mergedCart[item.id] = { ...item };
        }
    });

    const uniqueItems = Object.values(mergedCart);
    cartCount = uniqueItems.length;
    cartCountElement.textContent = cart.length;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        cartSubtotal.textContent = '$0.00';
        cartTotal.textContent = '$0.00';
        discountRow.style.display = 'none';
    } else {
        let subtotal = 0;
        cartItemsContainer.innerHTML = '';

        uniqueItems.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
                    <div class="cart-item-quantity">
                        <button class="cart-quantity-btn" onclick="decreaseCartQuantity('${item.id}')">-</button>
                        <span class="cart-quantity-display">${item.quantity}</span>
                        <button class="cart-quantity-btn" onclick="increaseCartQuantity('${item.id}')">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart('${item.id}')">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        const discount = subtotal * (discountPercent / 100);
        const total = subtotal - discount;

        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;

        if (discountPercent > 0) {
            cartDiscount.textContent = `-$${discount.toFixed(2)}`;
            discountRow.style.display = 'flex';
        } else {
            discountRow.style.display = 'none';
        }

        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
}

function increaseCartQuantity(productId) {
    const product = productData[productId];
    cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        quantity: 1
    });
    updateCartUI();
}

function decreaseCartQuantity(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCartUI();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    showToast('Removed', 'Item removed from cart', '🗑️');
}

function openCart() {
    document.getElementById('cartSidebar').classList.add('active');
    document.getElementById('cartOverlay').classList.add('active');
}

function closeCartSidebar() {
    document.getElementById('cartSidebar').classList.remove('active');
    document.getElementById('cartOverlay').classList.remove('active');
}

// Promo Code
function initPromoCode() {
    const promoApplyBtn = document.getElementById('promoApplyBtn');
    if (promoApplyBtn) {
        promoApplyBtn.addEventListener('click', applyPromoCode);
    }

    const promoInput = document.getElementById('promoInput');
    if (promoInput) {
        promoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                applyPromoCode();
            }
        });
    }
}

function applyPromoCode() {
    const promoInput = document.getElementById('promoInput');
    const promoMessage = document.getElementById('promoMessage');
    const code = promoInput.value.trim().toUpperCase();

    if (validPromoCodes[code]) {
        promoCode = code;
        discountPercent = validPromoCodes[code];
        promoMessage.textContent = `✓ Promo code applied! ${discountPercent}% discount`;
        promoMessage.className = 'promo-message success';
        promoMessage.style.display = 'block';
        promoInput.disabled = true;
        updateCartUI();
        showToast('Promo Applied!', `${discountPercent}% discount activated`, '🎉');
    } else {
        promoMessage.textContent = '✗ Invalid promo code';
        promoMessage.className = 'promo-message error';
        promoMessage.style.display = 'block';
    }
}

// Product Search
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

// Product Sort
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

            products.forEach(product => grid.appendChild(product));
        });
    }
}

// Run initialization
if (document.readyState === 'loading') {
    // Document is still loading
} else {
    // DOM is already ready
    initializeWebsite();
}
