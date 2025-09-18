/**
 * Anmol Real Estate - Main JavaScript
 * Author: Cascade
 * Date: 2025-09-18
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initStickyNavbar();
    initMobileMenu();
    initPropertyCarousel();
    initScrollAnimation();
});

/**
 * Sticky Navbar Implementation
 * Changes navbar appearance on scroll
 */
function initStickyNavbar() {
    const navbar = document.querySelector('.navbar-container');
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Trigger once on page load
    if (window.scrollY > scrollThreshold) {
        navbar.classList.add('scrolled');
    }
}

/**
 * Mobile Menu Toggle
 * Handles responsive navigation
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.navbar-toggle');
    const navLinks = document.querySelector('.navbar-links');
    const navButtons = document.querySelector('.navbar-buttons');
    
    if (!menuToggle) return;
    
    menuToggle.addEventListener('click', () => {
        // Create mobile menu if it doesn't exist
        if (!document.querySelector('.mobile-menu')) {
            const mobileMenu = document.createElement('div');
            mobileMenu.className = 'mobile-menu';
            
            // Clone navigation links and buttons
            const linksClone = navLinks.cloneNode(true);
            const buttonsClone = navButtons.cloneNode(true);
            
            mobileMenu.appendChild(linksClone);
            mobileMenu.appendChild(buttonsClone);
            
            // Add close button
            const closeBtn = document.createElement('button');
            closeBtn.className = 'mobile-menu-close';
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            mobileMenu.prepend(closeBtn);
            
            document.body.appendChild(mobileMenu);
            
            // Handle close button
            closeBtn.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
            
            // Handle link clicks (close menu when a link is clicked)
            const mobileLinks = mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                });
            });
        }
        
        // Toggle mobile menu
        const mobileMenu = document.querySelector('.mobile-menu');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Add necessary styles for mobile menu
    if (!document.getElementById('mobile-menu-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'mobile-menu-styles';
        styleSheet.textContent = `
            .mobile-menu {
                position: fixed;
                top: 0;
                right: -100%;
                width: 80%;
                max-width: 350px;
                height: 100vh;
                background-color: var(--color-bg-dark);
                z-index: 1001;
                padding: 2rem;
                box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
                transition: right 0.3s ease;
                display: flex;
                flex-direction: column;
                gap: 2rem;
                overflow-y: auto;
            }
            
            .mobile-menu.active {
                right: 0;
            }
            
            .mobile-menu-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                color: var(--color-text-primary);
                font-size: 1.5rem;
                cursor: pointer;
            }
            
            .mobile-menu .navbar-links ul {
                flex-direction: column;
                gap: 1rem;
            }
            
            .mobile-menu .navbar-buttons {
                flex-direction: column;
                gap: 1rem;
            }
            
            body.menu-open {
                overflow: hidden;
            }
            
            @media (min-width: 769px) {
                .mobile-menu {
                    display: none;
                }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

/**
 * Property Carousel Implementation
 * Handles the featured properties slider
 */
function initPropertyCarousel() {
    const track = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const cards = document.querySelectorAll('.property-card');
    
    if (!track || !prevButton || !nextButton || cards.length === 0) return;
    
    let currentIndex = 0;
    let cardWidth = cards[0].offsetWidth + parseInt(window.getComputedStyle(cards[0]).marginRight);
    let cardsPerView = calculateCardsPerView();
    let maxIndex = Math.max(0, cards.length - cardsPerView);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        cardWidth = cards[0].offsetWidth + parseInt(window.getComputedStyle(cards[0]).marginRight);
        cardsPerView = calculateCardsPerView();
        maxIndex = Math.max(0, cards.length - cardsPerView);
        updateCarouselPosition();
    });
    
    // Calculate visible cards based on screen width
    function calculateCardsPerView() {
        const viewportWidth = window.innerWidth;
        if (viewportWidth < 768) return 1;
        if (viewportWidth < 1024) return 2;
        return 3;
    }
    
    // Update carousel position
    function updateCarouselPosition() {
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        // Update button states
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex >= maxIndex;
        
        // Visual feedback for disabled buttons
        prevButton.style.opacity = prevButton.disabled ? '0.5' : '1';
        nextButton.style.opacity = nextButton.disabled ? '0.5' : '1';
    }
    
    // Initialize position
    updateCarouselPosition();
    
    // Event listeners for buttons
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarouselPosition();
        }
    });
    
    nextButton.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarouselPosition();
        }
    });
    
    // Touch events for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            // Swipe left
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarouselPosition();
            }
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe right
            if (currentIndex > 0) {
                currentIndex--;
                updateCarouselPosition();
            }
        }
    }
}

/**
 * Scroll Animation
 * Adds animations to elements when they come into view
 */
function initScrollAnimation() {
    // Add necessary styles for animations
    if (!document.getElementById('scroll-animation-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'scroll-animation-styles';
        styleSheet.textContent = `
            .fade-in {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .fade-in.visible {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    // Add fade-in class to elements we want to animate
    const animateElements = [
        ...document.querySelectorAll('.section-header'),
        ...document.querySelectorAll('.property-card'),
        ...document.querySelectorAll('.about-content > *'),
        ...document.querySelectorAll('.partner-card'),
        ...document.querySelectorAll('.testimonial-card'),
        ...document.querySelectorAll('.cta-content > *')
    ];
    
    animateElements.forEach(el => {
        el.classList.add('fade-in');
    });
    
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
            rect.bottom >= 0
        );
    }
    
    // Check elements on scroll
    function checkVisibility() {
        animateElements.forEach(el => {
            if (isInViewport(el)) {
                el.classList.add('visible');
            }
        });
    }
    
    // Initial check
    checkVisibility();
    
    // Check on scroll
    window.addEventListener('scroll', checkVisibility);
}

/**
 * Form Validation
 * Validates the contact form before submission
 */
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.cta-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let isValid = true;
            const inputs = contactForm.querySelectorAll('input[required], select[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            // Email validation
            const emailInput = contactForm.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value)) {
                    isValid = false;
                    emailInput.classList.add('error');
                }
            }
            
            if (isValid) {
                // In a real application, you would send the form data to a server here
                // For this demo, we'll just show a success message
                
                // Create success message
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success-message';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <h3>Thank you for your interest!</h3>
                    <p>A member of our investment team will contact you shortly.</p>
                `;
                
                // Replace form with success message
                contactForm.innerHTML = '';
                contactForm.appendChild(successMessage);
                
                // Add success message styles
                if (!document.getElementById('form-success-styles')) {
                    const styleSheet = document.createElement('style');
                    styleSheet.id = 'form-success-styles';
                    styleSheet.textContent = `
                        .form-success-message {
                            text-align: center;
                            padding: 2rem;
                        }
                        
                        .form-success-message i {
                            font-size: 3rem;
                            color: var(--color-primary);
                            margin-bottom: 1rem;
                        }
                        
                        .form-success-message h3 {
                            margin-bottom: 1rem;
                        }
                        
                        .form-error {
                            border-color: #ff3860 !important;
                        }
                    `;
                    document.head.appendChild(styleSheet);
                }
            }
        });
    }
});