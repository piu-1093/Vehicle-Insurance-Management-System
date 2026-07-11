/**
 * -------------------------------------------------------------
 * VEHICLE INSURANCE MANAGEMENT SYSTEM - LANDING PAGE CONTROLLER
 * Interactive UI Elements, Accordions, Contact form and Scroll Behaviors
 * -------------------------------------------------------------
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // DOM Element References
    // ---------------------------------------------------------
    const header = document.querySelector('.header');
    const backToTopBtn = document.getElementById('backToTop');
    const faqItems = document.querySelectorAll('.faq-item');
    const contactForm = document.querySelector('#contact form');

    // ---------------------------------------------------------
    // 1. Header Scroll Shadow Effect
    // ---------------------------------------------------------
    const handleHeaderScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleHeaderScroll);
    // Trigger once on load in case of page refresh
    handleHeaderScroll();

    // ---------------------------------------------------------
    // 2. Back To Top Button Behavior
    // ---------------------------------------------------------
    const handleBackToTopVisibility = () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
            // Ensure style is set in case class isn't fully defined in CSS
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
            backToTopBtn.style.transform = 'translateY(0)';
        } else {
            backToTopBtn.classList.remove('show');
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
            backToTopBtn.style.transform = 'translateY(10px)';
        }
    };
    window.addEventListener('scroll', handleBackToTopVisibility);
    // Trigger on load
    handleBackToTopVisibility();

    // Smooth scroll to top when clicked
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Style the back-to-top button dynamically if not styled
    backToTopBtn.style.position = 'fixed';
    backToTopBtn.style.bottom = '30px';
    backToTopBtn.style.right = '30px';
    backToTopBtn.style.zIndex = '999';
    backToTopBtn.style.transition = 'all 0.3s ease';
    backToTopBtn.style.cursor = 'pointer';

    // ---------------------------------------------------------
    // 3. FAQ Accordion (Single-Active Expand)
    // ---------------------------------------------------------
    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        questionButton.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items first
            if(isActive){
                item.classList.remove('active');
                const icon = item.querySelector('.faq-question i');
                if (icon) {
                    icon.className = 'fa-solid fa-chevron-down';
                }
            }

            // Toggle active state of clicked FAQ
            if (!isActive) {
                item.classList.add('active');
                const icon = item.querySelector('.faq-question i');
                if (icon) {
                    icon.className = 'fa-solid fa-chevron-down';
                }
            }
        });
    });

    // ---------------------------------------------------------
    // 4. Contact Form Submission dummy handler
    // ---------------------------------------------------------
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Fetch input values
            const nameInput = contactForm.querySelector('input[placeholder="Full Name"]');
            const emailInput = contactForm.querySelector('input[placeholder="Email Address"]');
            const phoneInput = contactForm.querySelector('input[placeholder="Phone Number"]');
            const messageInput = contactForm.querySelector('textarea');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';

            // Simple validation
            if (name === '' || email === '') {
                alert('Please fill in all required fields.');
                return;
            }

            // Show a custom mock success notification
            const successMessage = `Thank you, ${name}! Your inquiry has been submitted successfully.\n\nOur support team will contact you at ${email} within 24 hours.`;
            alert(successMessage);

            // Reset form fields
            contactForm.reset();
        });
    }

    // ---------------------------------------------------------
    // 5. Plan click event dummy handler
    // ---------------------------------------------------------
    const planButtons = document.querySelectorAll('.plan-btn');
    planButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const planTitle = btn.parentElement.querySelector('h3').textContent.trim();
            console.log(`User selected plan: ${planTitle}`);
            // Let native scroll proceed, but log state
        });
    });
});