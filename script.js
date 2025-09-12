// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initNavigation();
    initStickyHeader();
    initProjectFilters();
    initContactForm();
    initScrollAnimation();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav ul li a');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // Active link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Sticky header on scroll
function initStickyHeader() {
    const header = document.querySelector('header');
    const heroSection = document.querySelector('.hero');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });
}

// Project filtering functionality
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            projectItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 200);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 500);
                }
            });
        });
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Add client-side validation before form submission
        contactForm.addEventListener('submit', function(e) {
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Basic form validation
            if (name.trim() === '' || email.trim() === '' || subject.trim() === '' || message.trim() === '') {
                e.preventDefault();
                showFormMessage('Please fill in all fields', 'error');
                return false;
            }
            
            // Email validation
            if (!isValidEmail(email)) {
                e.preventDefault();
                showFormMessage('Please enter a valid email address', 'error');
                return false;
            }
            
            // Add loading state to button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Form will be submitted to the action URL
            return true;
        });
        
        // Add input validation on blur
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
        });
    }
}

// Validate individual form inputs
function validateInput(input) {
    const value = input.value.trim();
    
    // Check if empty
    if (value === '' && input.required) {
        setInputError(input, 'This field is required');
        return false;
    }
    
    // Validate email format
    if (input.type === 'email' && !isValidEmail(value)) {
        setInputError(input, 'Please enter a valid email address');
        return false;
    }
    
    // Clear error if validation passes
    clearInputError(input);
    return true;
}

// Set error state for input
function setInputError(input, message) {
    // Remove any existing error
    clearInputError(input);
    
    // Add error class to input
    input.classList.add('input-error');
    
    // Create and append error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // Insert error after input
    input.parentNode.appendChild(errorElement);
}

// Clear error state for input
function clearInputError(input) {
    input.classList.remove('input-error');
    
    // Remove any existing error message
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// Helper function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Helper function to show form submission messages
function showFormMessage(message, type) {
    // Check if a message element already exists
    let messageElement = document.querySelector('.form-message');
    
    // If not, create one
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.className = 'form-message';
        const contactForm = document.getElementById('contactForm');
        contactForm.parentNode.insertBefore(messageElement, contactForm.nextSibling);
    }
    
    // Set message content and style
    messageElement.textContent = message;
    messageElement.className = `form-message ${type}`;
    
    // Add styles based on message type
    if (type === 'success') {
        messageElement.style.backgroundColor = '#d4edda';
        messageElement.style.color = '#155724';
        messageElement.style.border = '1px solid #c3e6cb';
    } else if (type === 'error') {
        messageElement.style.backgroundColor = '#f8d7da';
        messageElement.style.color = '#721c24';
        messageElement.style.border = '1px solid #f5c6cb';
    }
    
    messageElement.style.padding = '10px';
    messageElement.style.borderRadius = '5px';
    messageElement.style.marginTop = '20px';
    
    // Remove the message after 5 seconds
    setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            messageElement.remove();
        }, 500);
    }, 5000);
}

// Scroll animations
function initScrollAnimation() {
    // Animate elements when they come into view
    const animateElements = document.querySelectorAll('.skill-item, .project-item, .contact-item');
    
    // Initial check for elements in viewport
    checkElementsInViewport();
    
    // Check elements on scroll
    window.addEventListener('scroll', checkElementsInViewport);
    
    function checkElementsInViewport() {
        animateElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // If element is in viewport
            if (elementPosition.top < windowHeight * 0.9) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial styles for animation
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
}

// Typing animation for hero section
function initTypingAnimation() {
    const textElement = document.querySelector('.hero-content h2');
    const textToType = textElement.textContent;
    textElement.textContent = '';
    
    let i = 0;
    const typingInterval = setInterval(() => {
        if (i < textToType.length) {
            textElement.textContent += textToType.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
        }
    }, 100);
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Adjust for header height
                behavior: 'smooth'
            });
        }
    });
});