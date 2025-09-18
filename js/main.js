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
    
    // Remove any existing mobile menu to avoid duplicates
    const existingMenu = document.querySelector('.mobile-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    // Create mobile menu immediately
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    
    // Clone navigation links and buttons
    const linksClone = navLinks.cloneNode(true);
    const buttonsClone = navButtons.cloneNode(true);
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'mobile-menu-close';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    
    // Append elements in the correct order
    mobileMenu.appendChild(closeBtn);
    mobileMenu.appendChild(linksClone);
    mobileMenu.appendChild(buttonsClone);
    
    document.body.appendChild(mobileMenu);
    
    // Handle menu toggle click
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
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
    
    // Add necessary styles for mobile menu
    if (!document.getElementById('mobile-menu-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'mobile-menu-styles';
        styleSheet.textContent = `
            .mobile-menu {
                position: fixed;
                top: 0;
                right: -100%;
                width: 90%;
                max-width: 320px;
                height: 100vh;
                background-color: #121212;
                z-index: 2000;
                padding: 4rem 1.5rem 1.5rem;
                box-shadow: -5px 0 15px rgba(0, 0, 0, 0.5);
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
                color: #ffffff;
                font-size: 1.5rem;
                cursor: pointer;
                width: 44px;
                height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                z-index: 2001;
            }
            
            .mobile-menu .navbar-links {
                display: block !important;
                width: 100%;
            }
            
            .mobile-menu .navbar-links ul {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                width: 100%;
            }
            
            .mobile-menu .navbar-links a {
                font-size: 1.2rem;
                padding: 0.8rem 0;
                display: block;
                color: #ffffff;
            }
            
            .mobile-menu .navbar-buttons {
                display: flex !important;
                flex-direction: column;
                gap: 1rem;
                width: 100%;
            }
            
            .mobile-menu .btn {
                width: 100%;
                text-align: center;
                padding: 0.8rem 1rem;
                font-size: 1rem;
            }
            
            body.menu-open {
                overflow: hidden;
            }
            
            /* Add overlay when menu is open */
            body.menu-open::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1999;
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
    
    if (!track || cards.length === 0) return;
    
    let currentIndex = 0;
    const isMobile = window.innerWidth < 768;
    // For mobile, include the left and right margins
    let cardWidth = isMobile ? 
        cards[0].offsetWidth + 2 * parseInt(window.getComputedStyle(cards[0]).marginLeft) : 
        cards[0].offsetWidth + parseInt(window.getComputedStyle(cards[0]).marginRight);
    let cardsPerView = calculateCardsPerView();
    let maxIndex = Math.max(0, cards.length - cardsPerView);
    let autoScrollInterval = null;
    let isHovering = false;
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const isMobile = window.innerWidth < 768;
        // For mobile, include the left and right margins
        cardWidth = isMobile ? 
            cards[0].offsetWidth + 2 * parseInt(window.getComputedStyle(cards[0]).marginLeft) : 
            cards[0].offsetWidth + parseInt(window.getComputedStyle(cards[0]).marginRight);
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
        // For mobile view, we need to handle the gap differently
        const isMobile = window.innerWidth < 768;
        
        // Calculate the full width of each card including margins
        const cardFullWidth = isMobile ? 
            cards[0].offsetWidth + 2 * parseInt(window.getComputedStyle(cards[0]).marginLeft) : 
            cardWidth;
            
        const offset = currentIndex * cardFullWidth;
        track.style.transform = `translateX(-${offset}px)`;
        
        // Update button states if buttons exist
        if (prevButton && nextButton) {
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex >= maxIndex;
            
            // Visual feedback for disabled buttons
            prevButton.style.opacity = prevButton.disabled ? '0.5' : '1';
            nextButton.style.opacity = nextButton.disabled ? '0.5' : '1';
        }
        
        // Update indicators
        updateIndicators();
    }
    
    // Create indicator dots
    function createIndicators() {
        const indicatorsContainer = document.querySelector('.carousel-indicators');
        if (!indicatorsContainer) return;
        
        // Clear existing indicators
        indicatorsContainer.innerHTML = '';
        
        // Calculate how many indicators we need
        const totalIndicators = maxIndex + 1;
        
        // Create indicator dots
        for (let i = 0; i < totalIndicators; i++) {
            const indicator = document.createElement('span');
            indicator.classList.add('carousel-indicator');
            indicator.dataset.index = i;
            
            // Add click event to each indicator
            indicator.addEventListener('click', () => {
                stopAutoScroll();
                currentIndex = i;
                updateCarouselPosition();
                setTimeout(startAutoScroll, 5000);
            });
            
            indicatorsContainer.appendChild(indicator);
        }
    }
    
    // Update active indicator
    function updateIndicators() {
        const indicators = document.querySelectorAll('.carousel-indicator');
        if (!indicators.length) return;
        
        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // Create indicators
    createIndicators();
    
    // Initialize position
    updateCarouselPosition();
    
    // Start auto-scrolling
    startAutoScroll();
    
    // Event listeners for buttons (if they exist)
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            stopAutoScroll();
            if (currentIndex > 0) {
                currentIndex--;
                updateCarouselPosition();
            }
            // Restart auto-scroll after a delay
            setTimeout(startAutoScroll, 5000);
        });
        
        nextButton.addEventListener('click', () => {
            stopAutoScroll();
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarouselPosition();
            }
            // Restart auto-scroll after a delay
            setTimeout(startAutoScroll, 5000);
        });
    }
    
    // Pause auto-scroll on hover
    track.addEventListener('mouseenter', () => {
        isHovering = true;
        stopAutoScroll();
    });
    
    track.addEventListener('mouseleave', () => {
        isHovering = false;
        startAutoScroll();
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
            stopAutoScroll();
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarouselPosition();
            }
            // Restart auto-scroll after a delay
            setTimeout(startAutoScroll, 5000);
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe right
            stopAutoScroll();
            if (currentIndex > 0) {
                currentIndex--;
                updateCarouselPosition();
            }
            // Restart auto-scroll after a delay
            setTimeout(startAutoScroll, 5000);
        }
    }
    
    // Auto-scroll functions
    function startAutoScroll() {
        if (autoScrollInterval || isHovering) return;
        
        autoScrollInterval = setInterval(() => {
            if (currentIndex >= maxIndex) {
                // Reset to beginning when reaching the end
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            updateCarouselPosition();
        }, 4000); // Change slide every 4 seconds
    }
    
    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
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