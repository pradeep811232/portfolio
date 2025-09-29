// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initNavigation();
    initStickyHeader();
    initProjectFilters();
    initContactForm();
    initScrollAnimation();
    initBackgroundAnimations();
    createParticles();
    initCustomCursor();

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
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

// Advanced Custom Cursor with Colorful Trail Effect
function initCustomCursor() {
    // Create cursor element if it doesn't exist
    let cursor = document.querySelector('.cursor');
    if (!cursor) {
        cursor = document.createElement('div');
        cursor.className = 'cursor';
        document.body.appendChild(cursor);
    }

    // Create particles container if it doesn't exist
    let particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer) {
        particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        document.body.appendChild(particlesContainer);
    }

    // Extended color palette for vibrant trails
    const colors = [
        '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeead',
        '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3',
        '#ff7675', '#74b9ff', '#0984e3', '#fdcb6e', '#e17055',
        '#00b894', '#00cec9', '#a29bfe', '#fd79a8', '#fdcb6e',
        '#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e', '#e17055',
        '#00b894', '#00cec9', '#55a3ff', '#ff6b9d', '#c44569'
    ];

    // Particle trail settings
    const maxParticles = 50; // Number of particles in trail
    const particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let currentColorIndex = 0;

    // Mouse move event for cursor and particles
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Update cursor position
        cursor.style.left = (mouseX - 10) + 'px'; // Center the cursor
        cursor.style.top = (mouseY - 10) + 'px';
        cursor.style.opacity = '1';

        // Cycle through colors for cursor
        cursor.style.backgroundColor = colors[currentColorIndex % colors.length];
        cursor.style.borderColor = colors[currentColorIndex % colors.length];

        // Create new particle
        createParticle(mouseX, mouseY);

        // Update existing particles
        updateParticles();

        // Change cursor color gradually
        currentColorIndex = (currentColorIndex + 1) % colors.length;
    });

    // Click event for cursor animation
    document.addEventListener('click', () => {
        cursor.classList.add('click');
        setTimeout(() => cursor.classList.remove('click'), 150);

        // Create burst of particles on click
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const angle = (Math.PI * 2 * i) / 10;
                const speed = 2 + Math.random() * 3;
                const newX = mouseX + Math.cos(angle) * 50;
                const newY = mouseY + Math.sin(angle) * 50;
                createParticle(newX, newY);
            }, i * 50);
        }
    });

    // Create particle function
    function createParticle(x, y) {
        if (particles.length >= maxParticles) {
            // Remove oldest particle
            const oldParticle = particles.shift();
            if (oldParticle && oldParticle.element) {
                oldParticle.element.remove();
            }
        }

        // Create new particle element
        const particle = document.createElement('div');
        particle.className = 'particle-trail';

        // Random properties
        const size = Math.random() * 10 + 5; // Size between 5-15px
        const color = colors[Math.floor(Math.random() * colors.length)];
        const life = Math.random() * 2000 + 1000; // Life span 1-3 seconds
        const velocityX = (Math.random() - 0.5) * 4; // Random horizontal drift
        const velocityY = -(Math.random() * 3 + 1); // Upward movement
        const rotation = Math.random() * 360; // Random rotation
        const rotationSpeed = (Math.random() - 0.5) * 10; // Rotation speed

        // Set initial styles
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.backgroundColor = color;
        particle.style.color = color;
        particle.style.transform = `rotate(${rotation}deg)`;
        particle.style.opacity = '0.8';

        // Append to container
        particlesContainer.appendChild(particle);

        // Store particle data
        particles.push({
            element: particle,
            x: x,
            y: y,
            vx: velocityX,
            vy: velocityY,
            rotation: rotation,
            rotationSpeed: rotationSpeed,
            life: life,
            maxLife: life,
            size: size,
            color: color
        });
    }

    // Update particles function
    function updateParticles() {
        particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.rotation += particle.rotationSpeed;
            particle.vy += 0.05; // Gravity effect

            // Update life
            particle.life -= 16; // Approximate 60fps

            // Calculate opacity based on life
            const progress = particle.life / particle.maxLife;
            particle.element.style.opacity = Math.max(0, progress * 0.8);

            // Update position and rotation
            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
            particle.element.style.transform = `rotate(${particle.rotation}deg) scale(${progress})`;
            particle.element.style.width = particle.size + 'px';
            particle.element.style.height = particle.size + 'px';

            // Remove dead particles
            if (particle.life <= 0) {
                particle.element.remove();
                particles.splice(index, 1);
            }
        });
    }

    // Hide cursor on leave
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    // Show on enter
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });

    // Prevent context menu on right click for custom cursor
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    // Add click class for animation
    cursor.addEventListener('transitionend', () => {
        if (cursor.classList.contains('click')) {
            cursor.classList.remove('click');
        }
    });
}

// Initialize cursor after DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomCursor);
} else {
    initCustomCursor();
}

// Full Background Color Animations
function initBackgroundAnimations() {
    const gradients = [
        'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(45deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(45deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(45deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(45deg, #ff9a9e 0%, #fecfef 100%)',
        'linear-gradient(45deg, #ffecd2 0%, #fcb69f 100%)'
    ];

    let currentGradient = 0;
    
    function changeBackground() {
        document.body.style.background = gradients[currentGradient];
        document.body.style.transition = 'background 2s ease';
        currentGradient = (currentGradient + 1) % gradients.length;
    }

    setInterval(changeBackground, 3000);

    document.body.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        const hue = Math.floor((x + y) * 180);
        document.body.style.filter = `hue-rotate(${hue}deg)`;
    });

    document.body.addEventListener('touchmove', (e) => {
        const x = e.touches[0].clientX / window.innerWidth;
        const y = e.touches[0].clientY / window.innerHeight;
        
        const hue = Math.floor((x + y) * 180);
        document.body.style.filter = `hue-rotate(${hue}deg)`;
    });

    document.body.addEventListener('mouseleave', () => {
        document.body.style.filter = 'hue-rotate(0deg)';
    });
}

function createParticles() {
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
        document.body.appendChild(particle);
    }
}