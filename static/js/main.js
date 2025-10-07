// Neo Doctor - Main JavaScript File

document.addEventListener('DOMContentLoaded', () => {
    // Initialize tabs
    initTabs();
    
    // Initialize methodology tabs
    initMethodologyTabs();
    
    // Initialize FAQ accordion
    initFAQ();
    
    // Initialize sticky navigation
    initStickyNav();

    // Initialize horizontal scroll navigation
    initHorizontalNav();

    // Initialize form validation
    initFormValidation();
    
    // Smooth scrolling for anchor links
    initSmoothScroll();
    
    // Add animation classes to elements as they become visible
    initScrollAnimations();
});

// Tab Navigation System
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const serverInitialTab = document.body.getAttribute('data-initial-tab');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the tab ID from the button
            const tabId = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Update URL hash for direct linking
            window.location.hash = tabId;
            
            // Scroll to top of tab content with smooth animation
            const tabContent = document.querySelector('.tab-content');
            const headerOffset = document.querySelector('.tabs-nav').offsetHeight;
            const elementPosition = tabContent.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
    
    // Check if URL has hash and activate corresponding tab
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const tabButton = document.querySelector(`.tab-button[data-tab="${hash}"]`);
        
        if (tabButton) {
            tabButton.click();
        }
    }

    // If server provided an initial tab, activate it
    if (serverInitialTab) {
        const tabButton = document.querySelector(`.tab-button[data-tab="${serverInitialTab}"]`);
        const tabPane = document.getElementById(serverInitialTab);
        if (tabButton && tabPane) {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            tabButton.classList.add('active');
            tabPane.classList.add('active');
        }
    }
}

// Horizontal Scroll Navigation
function initHorizontalNav() {
    const navbar = document.querySelector('.horizontal-navbar');
    const scrollWrapper = document.querySelector('.navbar-scroll-wrapper');
    const navMenu = document.querySelector('.navbar-menu');
    const scrollLeftBtn = document.querySelector('.scroll-left');
    const scrollRightBtn = document.querySelector('.scroll-right');
    
    if (!navbar || !scrollWrapper || !navMenu || !scrollLeftBtn || !scrollRightBtn) return;

    // Scroll amount for each click
    const scrollAmount = 200;
    
    // Update scroll indicators visibility
    function updateScrollIndicators() {
        const { scrollLeft, scrollWidth, clientWidth } = navMenu;
        const maxScroll = scrollWidth - clientWidth;
        
        // Update wrapper classes for gradient effects
        scrollWrapper.classList.toggle('can-scroll-left', scrollLeft > 0);
        scrollWrapper.classList.toggle('can-scroll-right', scrollLeft < maxScroll);
        scrollWrapper.classList.toggle('at-end', scrollLeft >= maxScroll);
        
        // Update button visibility
        scrollLeftBtn.classList.toggle('hidden', scrollLeft <= 0);
        scrollRightBtn.classList.toggle('hidden', scrollLeft >= maxScroll);
    }
    
    // Scroll left function
    function scrollLeft() {
        navMenu.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    }
    
    // Scroll right function
    function scrollRight() {
        navMenu.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
    
    // Scroll to active item
    function scrollToActiveItem() {
        const activeItem = navMenu.querySelector('.nav-item.active');
        if (activeItem) {
            const itemRect = activeItem.getBoundingClientRect();
            const menuRect = navMenu.getBoundingClientRect();
            const scrollLeft = navMenu.scrollLeft;
            
            // Calculate if item is visible
            const itemLeft = itemRect.left - menuRect.left + scrollLeft;
            const itemRight = itemLeft + itemRect.width;
            const visibleLeft = scrollLeft;
            const visibleRight = scrollLeft + menuRect.width;
            
            // Scroll if item is not fully visible
            if (itemLeft < visibleLeft) {
                navMenu.scrollTo({
                    left: itemLeft - 20,
                    behavior: 'smooth'
                });
            } else if (itemRight > visibleRight) {
                navMenu.scrollTo({
                    left: itemRight - menuRect.width + 20,
                    behavior: 'smooth'
                });
            }
        }
    }
    
    // Event listeners
    scrollLeftBtn.addEventListener('click', scrollLeft);
    scrollRightBtn.addEventListener('click', scrollRight);
    
    // Update indicators on scroll
    navMenu.addEventListener('scroll', updateScrollIndicators);
    
    // Update indicators on resize
    window.addEventListener('resize', () => {
        updateScrollIndicators();
        // Scroll to active item on resize to maintain visibility
        setTimeout(scrollToActiveItem, 100);
    });
    
    // Touch/swipe support for mobile
    let startX = 0;
    let scrollLeftStart = 0;
    let isScrolling = false;
    
    navMenu.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX;
        scrollLeftStart = navMenu.scrollLeft;
        isScrolling = true;
    }, { passive: true });
    
    navMenu.addEventListener('touchmove', (e) => {
        if (!isScrolling) return;
        
        const currentX = e.touches[0].pageX;
        const diffX = startX - currentX;
        navMenu.scrollLeft = scrollLeftStart + diffX;
    }, { passive: true });
    
    navMenu.addEventListener('touchend', () => {
        isScrolling = false;
    }, { passive: true });
    
    // Keyboard navigation
    navMenu.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            scrollLeft();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            scrollRight();
        }
    });
    
    // Add scroll effect to navbar on page scroll
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Initialize scroll indicators
    updateScrollIndicators();
    
    // Scroll to active item on load
    setTimeout(scrollToActiveItem, 100);
    
    // Auto-hide scroll indicators on large screens if content fits
    function checkContentFit() {
        if (window.innerWidth >= 1200) {
            const needsScroll = navMenu.scrollWidth > navMenu.clientWidth;
            scrollLeftBtn.style.display = needsScroll ? 'flex' : 'none';
            scrollRightBtn.style.display = needsScroll ? 'flex' : 'none';
            
            if (!needsScroll) {
                scrollWrapper.classList.remove('can-scroll-left', 'can-scroll-right', 'at-end');
            }
        } else {
            scrollLeftBtn.style.display = 'flex';
            scrollRightBtn.style.display = 'flex';
        }
    }
    
    // Check content fit on load and resize
    checkContentFit();
    window.addEventListener('resize', checkContentFit);
}

// Methodology Tabs
function initMethodologyTabs() {
    const methodologyTabs = document.querySelectorAll('.methodology-tab');
    const methodologyContents = document.querySelectorAll('.methodology-content');
    
    methodologyTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const methodologyId = tab.getAttribute('data-methodology');
            
            methodologyTabs.forEach(t => t.classList.remove('active'));
            methodologyContents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(methodologyId).classList.add('active');
        });
    });
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Toggle active class on the FAQ item
            item.classList.toggle('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });
}

// Sticky Navigation
function initStickyNav() {
    const tabsNav = document.querySelector('.tabs-nav');
    const headerHeight = document.querySelector('header').offsetHeight;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > headerHeight - 100) {
            tabsNav.classList.add('scrolled');
        } else {
            tabsNav.classList.remove('scrolled');
        }
    });
}

// Form Validation
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');
            const messageField = document.getElementById('message');
            
            // Reset error messages
            document.querySelectorAll('.error-message').forEach(el => el.remove());
            
            // Validate name
            if (!nameField.value.trim()) {
                showError(nameField, 'Por favor, informe seu nome');
                isValid = false;
            }
            
            // Validate email
            if (!validateEmail(emailField.value.trim())) {
                showError(emailField, 'Por favor, informe um email válido');
                isValid = false;
            }
            
            // Validate message
            if (!messageField.value.trim()) {
                showError(messageField, 'Por favor, escreva sua mensagem');
                isValid = false;
            }
            
            if (isValid) {
                // Show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                
                // Submit form via AJAX
                const formData = new FormData(contactForm);
                
                fetch('/submit-contact', {
                    method: 'POST',
                    body: formData,
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Show success message
                        const successAlert = document.createElement('div');
                        successAlert.className = 'alert alert-success';
                        successAlert.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
                        contactForm.insertAdjacentElement('beforebegin', successAlert);
                        
                        // Reset form
                        contactForm.reset();
                    } else {
                        // Show error message
                        const errorAlert = document.createElement('div');
                        errorAlert.className = 'alert alert-danger';
                        errorAlert.textContent = data.message || 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.';
                        contactForm.insertAdjacentElement('beforebegin', errorAlert);
                    }
                    
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    
                    // Remove alerts after 5 seconds
                    setTimeout(() => {
                        document.querySelectorAll('.alert').forEach(alert => {
                            alert.style.opacity = '0';
                            setTimeout(() => alert.remove(), 300);
                        });
                    }, 5000);
                })
                .catch(error => {
                    console.error('Error:', error);
                    
                    // Show error message
                    const errorAlert = document.createElement('div');
                    errorAlert.className = 'alert alert-danger';
                    errorAlert.textContent = 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.';
                    contactForm.insertAdjacentElement('beforebegin', errorAlert);
                    
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                });
            }
        });
    }
}

// Helper function to show form validation errors
function showError(field, message) {
    // Remove any existing error message
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.color = '#dc3545';
    errorElement.style.fontSize = '0.85rem';
    errorElement.style.marginTop = '0.3rem';
    errorElement.textContent = message;
    
    // Add red border to field
    field.style.borderColor = '#dc3545';
    
    // Insert error message after the field
    field.parentElement.appendChild(errorElement);
    
    // Add event listener to clear error on input
    field.addEventListener('input', function() {
        field.style.borderColor = '';
        const error = field.parentElement.querySelector('.error-message');
        if (error) {
            error.remove();
        }
    }, { once: true });
}

// Helper function to validate email
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = document.querySelector('.tabs-nav').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add animation classes to elements as they become visible
function initScrollAnimations() {
    // Elements to animate on scroll
    const elementsToAnimate = document.querySelectorAll('.card, .highlight-box, .case, .investment-highlight, .founder-photo, .team-photo');
    
    // IntersectionObserver to detect when elements enter viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });
    
    // Observe each element
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}
