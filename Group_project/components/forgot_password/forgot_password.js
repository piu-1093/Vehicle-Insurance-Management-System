'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('reset-form');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    
    const alertBanner = document.getElementById('alert-banner');
    const alertIcon = document.getElementById('alert-icon');
    const alertMessage = document.getElementById('alert-message');

    let alertTimeout;

    function showAlert(type, message) {
        clearTimeout(alertTimeout);
        alertBanner.className = 'alert-banner';
        alertBanner.classList.add(type);
        alertMessage.textContent = message;
        
        if (type === 'error') {
            alertIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
            `;
        } else if (type === 'success') {
            alertIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
            `;
        }

        alertBanner.style.opacity = '0';
        alertBanner.style.transform = 'translateY(-10px)';
        alertBanner.classList.remove('hidden');

        alertBanner.offsetHeight; // reflow
        
        alertBanner.style.opacity = '1';
        alertBanner.style.transform = 'translateY(0)';
    }

    function hideAlert() {
        clearTimeout(alertTimeout);
        alertBanner.style.opacity = '0';
        alertBanner.style.transform = 'translateY(-10px)';
        alertTimeout = setTimeout(() => {
            alertBanner.classList.add('hidden');
        }, 150);
    }

    resetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideAlert();

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();

        if (username === '') {
            showAlert('error', 'User ID is required. Please enter your enterprise credentials.');
            usernameInput.focus();
            return;
        }

        if (email === '') {
            showAlert('error', 'Registered Email is required. Please enter your email address.');
            emailInput.focus();
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert('error', 'Please enter a valid registered email address.');
            emailInput.focus();
            return;
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            showAlert('success', 'Reset instructions have been sent to your registered email address!');
            usernameInput.value = '';
            emailInput.value = '';
        }, 750);
    });

    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            btnSpinner.classList.remove('hidden');
            btnText.textContent = 'Sending...';
            usernameInput.disabled = true;
            emailInput.disabled = true;
        } else {
            submitBtn.disabled = false;
            btnSpinner.classList.add('hidden');
            btnText.textContent = 'Send Reset Instructions';
            usernameInput.disabled = false;
            emailInput.disabled = false;
        }
    }
});