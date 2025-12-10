// Royal Residencies Website JavaScript - MOBILE OPTIMIZED

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navList = document.querySelector('.nav-list');
const navLinks = document.querySelectorAll('.nav-link');
const sliderTrack = document.querySelector('.slider-track');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const faqQuestions = document.querySelectorAll('.faq-question');
const viewDetailsBtns = document.querySelectorAll('.view-details-btn');
const roomModal = document.getElementById('roomModal');
const modalClose = document.getElementById('modalClose');
const backToTop = document.getElementById('backToTop');
const currentYear = document.getElementById('currentYear');

// Room data for modals
const roomData = {
    'guest-house': {
        title: 'Guest House Room',
        price: 'PKR 7,000',
        image: 'guest_house.jpg',
        description: 'Experience the comfort of our spacious guest house rooms, designed to provide a home-like atmosphere with complete privacy. These large rooms are perfect for travelers seeking comfort and convenience in Islamabad.',
        features: [
            'Large, home-like rooms with 100% privacy',
            'Air conditioning for year-round comfort',
            'High-speed WiFi internet access',
            'Big LED TV with cable channels',
            'Hot filtered water available 24/7',
            'Secure parking facility',
            'Optional breakfast service (additional charges apply)',
            'Daily housekeeping service',
            'Private attached bathroom',
            'Complimentary tea/coffee making facilities'
        ],
        whatsappLink: 'https://wa.me/923089747680?text=I%20want%20to%20book%20Guest%20House%20Room'
    },
    'one-bedroom': {
        title: 'One Bedroom Apartment',
        price: 'PKR 5,000',
        image: '1bed.jpg',
        description: 'Our fully furnished one-bedroom apartments offer the perfect blend of privacy and convenience. Ideal for couples or solo travelers, these apartments provide all the amenities you need for a comfortable stay.',
        features: [
            'Fully furnished private apartment',
            'Ideal for couples or solo travelers',
            'Air conditioning throughout',
            'High-speed WiFi internet',
            'Big LED TV with cable channels',
            'Hot filtered water available 24/7',
            'Secure parking facility',
            'Optional breakfast service (additional charges apply)',
            'Fully equipped kitchenette',
            'Separate living and dining area'
        ],
        whatsappLink: 'https://wa.me/923089747680?text=I%20want%20to%20book%20One%20Bedroom%20Apartment'
    },
    'two-bedroom': {
        title: 'Two Bedroom Apartment',
        price: 'PKR 10,000',
        image: '2bed.jpg',
        description: 'Perfect for families or small groups, our spacious two-bedroom apartments offer ample space and all modern amenities. Enjoy the comfort of a fully furnished apartment with separate living areas.',
        features: [
            'Spacious for families or small groups',
            'Fully furnished with modern amenities',
            'Air conditioning in all rooms',
            'High-speed WiFi internet',
            'Big LED TV with cable channels',
            'Hot filtered water available 24/7',
            'Secure parking facility',
            'Optional breakfast service (additional charges apply)',
            'Two separate bedrooms with attached bathrooms',
            'Fully equipped kitchen and dining area',
            'Separate living room area'
        ],
        whatsappLink: 'https://wa.me/923089747680?text=I%20want%20to%20book%20Two%20Bedroom%20Apartment'
    }
};

// Slider Variables
let currentSlide = 0;
const totalSlides = slides.length;
let slideInterval;
let isTouchDevice = 'ontouchstart' in window;

// Initialize the website
function init() {
    // Set current year in footer
    currentYear.textContent = new Date().getFullYear();
    
    // Set initial theme based on localStorage or user preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.body.setAttribute('data-theme', 'dark');
    }
    
    // Initialize slider
    startSlider();
    
    // Initialize event listeners
    setupEventListeners();
    
    // Initialize smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Add touch support for slider
    if (isTouchDevice) {
        setupTouchSlider();
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Slider controls
    prevBtn.addEventListener('click', showPrevSlide);
    nextBtn.addEventListener('click', showNextSlide);
    
    // Slider dots
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            goToSlide(slideIndex);
        });
    });
    
    // FAQ accordion
    faqQuestions.forEach(question => {
        question.addEventListener('click', toggleFaq);
    });
    
    // Room detail modals
    viewDetailsBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const roomType = this.getAttribute('data-room');
            openRoomModal(roomType);
        });
    });
    
    // Modal close
    modalClose.addEventListener('click', closeRoomModal);
    
    // Close modal when clicking outside
    roomModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeRoomModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && roomModal.classList.contains('active')) {
            closeRoomModal();
        }
    });
    
    // Back to top button
    backToTop.addEventListener('click', scrollToTop);
    
    // Show/hide back to top button on scroll
    window.addEventListener('scroll', toggleBackToTop);
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Prevent scrolling when modal is open
    roomModal.addEventListener('touchmove', function(e) {
        if (roomModal.classList.contains('active')) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Touch support for slider
function setupTouchSlider() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    sliderTrack.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(slideInterval); // Pause auto-slide on touch
    }, { passive: true });
    
    sliderTrack.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startSlider(); // Resume auto-slide after touch
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum swipe distance
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe right - previous slide
                showPrevSlide();
            } else {
                // Swipe left - next slide
                showNextSlide();
            }
        }
    }
}

// Theme toggle functionality
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Mobile menu functionality
function toggleMobileMenu() {
    navList.classList.toggle('active');
    menuToggle.classList.toggle('active');
    
    // Toggle body scroll when menu is open
    if (navList.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

function closeMobileMenu() {
    navList.classList.remove('active');
    menuToggle.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Slider functionality
function startSlider() {
    slideInterval = setInterval(showNextSlide, 5000);
}

function showNextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}

function showPrevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateSlider();
    resetSliderInterval();
}

function updateSlider() {
    // Update slides
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function resetSliderInterval() {
    clearInterval(slideInterval);
    startSlider();
}

// FAQ accordion functionality
function toggleFaq() {
    const faqItem = this.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    faqQuestions.forEach(otherQuestion => {
        otherQuestion.parentElement.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Room modal functionality
function openRoomModal(roomType) {
    const room = roomData[roomType];
    
    if (!room) return;
    
    // Update modal content
    document.getElementById('modalTitle').textContent = room.title;
    document.getElementById('modalPrice').innerHTML = `${room.price} <span>/day</span>`;
    document.getElementById('modalImage').style.backgroundImage = `url('${room.image}')`;
    
    // Update description
    const descriptionElement = document.getElementById('modalDescription');
    descriptionElement.textContent = room.description;
    
    // Update features
    const featuresElement = document.getElementById('modalFeatures');
    featuresElement.innerHTML = '';
    room.features.forEach(feature => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
        featuresElement.appendChild(li);
    });
    
    // Update WhatsApp link
    const bookBtn = document.getElementById('modalBookBtn');
    bookBtn.href = room.whatsappLink;
    
    // Show modal
    roomModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Focus on close button for accessibility
    setTimeout(() => {
        modalClose.focus();
    }, 100);
}

function closeRoomModal() {
    roomModal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scrolling
    
    // Return focus to the button that opened the modal
    if (document.activeElement === modalClose) {
        const activeButton = document.querySelector('.view-details-btn[data-room]:focus');
        if (activeButton) {
            activeButton.focus();
        }
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#home') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Update active nav link on scroll
function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100;
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    // Get all sections
    const sections = document.querySelectorAll('section');
    
    let currentActiveId = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentActiveId = sectionId;
        }
    });
    
    // Update nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentActiveId}`) {
            link.classList.add('active');
        }
    });
}

// Back to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function toggleBackToTop() {
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Pause slider on hover (for non-touch devices)
if (!isTouchDevice) {
    sliderTrack.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    sliderTrack.addEventListener('mouseleave', () => {
        startSlider();
    });
}

// Handle orientation change
window.addEventListener('orientationchange', function() {
    // Wait a bit for orientation to complete
    setTimeout(() => {
        // Recalculate any layout if needed
        if (roomModal.classList.contains('active')) {
            // Ensure modal is properly positioned
            roomModal.style.height = window.innerHeight + 'px';
        }
    }, 300);
});