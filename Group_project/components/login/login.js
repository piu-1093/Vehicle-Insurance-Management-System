/**
 * -------------------------------------------------------------
 * VEHICLE INSURANCE MANAGEMENT SYSTEM - LOGIN CONTROLLER
 * Vanilla JavaScript Authentication & Validation Module
 * -------------------------------------------------------------
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // DOM Element References
    // ---------------------------------------------------------
    const loginForm = document.getElementById('login-form');
    const adminRoleBtn = document.getElementById('role-btn-admin');
    const underwriterRoleBtn = document.getElementById('role-btn-underwriter');

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const eyeIcon = document.getElementById('eye-icon');

    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');

    const alertBanner = document.getElementById('alert-banner');
    const alertIcon = document.getElementById('alert-icon');
    const alertMessage = document.getElementById('alert-message');

    const forgotPasswordLink = document.getElementById('forgot-password');

    const popup = document.getElementById('admin-popup');
    const closePopup = document.getElementById('close-popup');
    forgotPasswordLink.style.pointerEvents = 'auto';
    forgotPasswordLink.style.opacity = '1';
    forgotPasswordLink.style.cursor = 'pointer';
    // ---------------------------------------------------------
    // Application State Variables
    // ---------------------------------------------------------
    let selectedRole = 'Underwriter'; // Can be 'Administrator' or 'Underwriter'
    let alertTimeout;
    // ---------------------------------------------------------
    // SVG Paths for Password Visibility Toggle
    // ---------------------------------------------------------
    const eyeOpenSVG = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    `;

    const eyeClosedSVG = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
    `;


    // ---------------------------------------------------------
    // Event Handlers: Role Selection
    // ---------------------------------------------------------

    /**
     * Set the selected user role and update classes visually
     * @param {string} role - 'Administrator' or 'Underwriter'
     * @param {HTMLButtonElement} selectedBtn - The clicked button element
     */
    function setRole(role, selectedBtn) {
        selectedRole = role;

        // Remove active state from both buttons
        adminRoleBtn.classList.remove('active');
        underwriterRoleBtn.classList.remove('active');

        // Add active state to selected button
        selectedBtn.classList.add('active');
        if (role === 'Administrator') {
            forgotPasswordLink.style.pointerEvents = 'none';
            forgotPasswordLink.style.opacity = '0.5';
            forgotPasswordLink.style.cursor = 'not-allowed';
        } else {
            forgotPasswordLink.style.pointerEvents = 'auto';
            forgotPasswordLink.style.opacity = '1';
            forgotPasswordLink.style.cursor = 'pointer';
        }

        // Hide error banner if it was role-related
        if (alertBanner.classList.contains('error') && alertMessage.textContent.includes('role')) {
            hideAlert();
        }

        // Auto-focus username field for faster UX
        usernameInput.focus();
    }

    adminRoleBtn.addEventListener('click', () => setRole('Administrator', adminRoleBtn));
    underwriterRoleBtn.addEventListener('click', () => setRole('Underwriter', underwriterRoleBtn));
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();

        if (!selectedRole) {
            showAlert(
                'error',
                'Please select your role before using Forgot Password.'
            );
            return;
        }

        popup.classList.remove('hidden');
    });

    closePopup.addEventListener('click', () => {
        popup.classList.add('hidden');
    });

    // ---------------------------------------------------------
    // Event Handlers: Password Toggle Visibility
    // ---------------------------------------------------------
    togglePasswordBtn.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';

        if (isPassword) {
            passwordInput.setAttribute('type', 'text');
            eyeIcon.innerHTML = eyeClosedSVG;
            togglePasswordBtn.setAttribute('aria-label', 'Hide password');
        } else {
            passwordInput.setAttribute('type', 'password');
            eyeIcon.innerHTML = eyeOpenSVG;
            togglePasswordBtn.setAttribute('aria-label', 'Show password');
        }
    });

    // ---------------------------------------------------------
    // Feedback Alerts: Show / Hide UI Banners
    // ---------------------------------------------------------

    /**
     * Show custom alert banner with specified type and message
     * @param {string} type - 'error' or 'success'
     * @param {string} message - Text description of the alert
     */
    function showAlert(type, message) {
        clearTimeout(alertTimeout);
        // Clear old classes
        alertBanner.className = 'alert-banner';

        // Apply target classes
        alertBanner.classList.add(type);
        alertMessage.textContent = message;

        // Set dynamic SVG icon based on success or error
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

        // Trigger animation and display element
        alertBanner.style.opacity = '0';
        alertBanner.style.transform = 'translateY(-10px)';
        alertBanner.classList.remove('hidden');

        // Reflow repaint to trigger CSS transitions
        alertBanner.offsetHeight;

        alertBanner.style.opacity = '1';
        alertBanner.style.transform = 'translateY(0)';
    }

    /**
     * Smoothly hides the alert banner
     */

    // function hideAlert() {
    //     alertBanner.style.opacity = '0';
    //     alertBanner.style.transform = 'translateY(-10px)';

    //     // Wait for CSS transition to finish before hiding display
    //     setTimeout(() => {
    //         alertBanner.classList.add('hidden');
    //     }, 150);
    // }

    function hideAlert() {
        clearTimeout(alertTimeout);

        alertBanner.style.opacity = '0';
        alertBanner.style.transform = 'translateY(-10px)';

        alertTimeout = setTimeout(() => {
            alertBanner.classList.add('hidden');
        }, 150);
    }

    // ---------------------------------------------------------
    // Form Validation and Authentication Logic
    // ---------------------------------------------------------

    loginForm.addEventListener('submit', (e) => {
        // Prevent default form POST behavior
        e.preventDefault();

        // Clear previous alerts
        hideAlert();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        // 1. Role Selection Validation
        if (!selectedRole) {
            showAlert('error', 'Please select a role (Administrator or Underwriter) to continue.');
            return;
        }

        // 2. User ID Validation (Empty Check)
        if (username === '') {
            showAlert('error', 'User ID is required. Please enter your enterprise credentials.');
            usernameInput.focus();
            return;
        }

        // 3. Password Validation (Empty Check)
        if (password === '') {
            showAlert('error', 'Password is required. Please enter your password.');
            passwordInput.focus();
            return;
        }

        // 4. Authenticate Credentials based on Selected Role
        authenticateUser(selectedRole, username, password);
    });

    /**
     * Handles credential checking and handles success/error UI flows
     * @param {string} role 
     * @param {string} username 
     * @param {string} password 
     */
    function authenticateUser(role, username, password) {

        setLoading(true);

        setTimeout(() => {

            // ADMIN LOGIN
            if (role === "Administrator") {

                if (
                    username === "admin" &&
                    password === "admin123"
                ) {

                    handleLoginSuccess(
                        "../../admin/admin_dashboard/admin_dashboard.html",
                        "Administrator"
                    );

                } else {

                    handleLoginFailure(
                        "Invalid Administrator credentials. Please verify your User ID and Password."
                    );

                }

            }

            // UNDERWRITER LOGIN
            else if (role === "Underwriter") {

                const underwriters =
                    JSON.parse(
                        localStorage.getItem("underwriters")
                    ) || [];

                const underwriter =
                    underwriters.find(
                        u =>
                            u.underwriterId === username &&
                            u.password === password
                    );

                if (underwriter) {

                    // Store logged in underwriter info
                    localStorage.setItem(
                        "loggedInUnderwriter",
                        JSON.stringify(underwriter)
                    );

                    handleLoginSuccess(
                        "../../underwriter/underwriter_dashboard/underwriter_dashboard.html",
                        "Underwriter"
                    );

                } else {

                    handleLoginFailure(
                        "Invalid Underwriter ID or Password."
                    );

                }
            }

        }, 750);

    }

    /**
     * Triggers visual loading states on the Sign In button
     * @param {boolean} isLoading 
     */
    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            btnSpinner.classList.remove('hidden');
            btnText.textContent = 'Verifying...';
            usernameInput.disabled = true;
            passwordInput.disabled = true;
            adminRoleBtn.style.pointerEvents = 'none';
            underwriterRoleBtn.style.pointerEvents = 'none';
        } else {
            submitBtn.disabled = false;
            btnSpinner.classList.add('hidden');
            btnText.textContent = 'Sign In';
            usernameInput.disabled = false;
            passwordInput.disabled = false;
            adminRoleBtn.style.pointerEvents = 'auto';
            underwriterRoleBtn.style.pointerEvents = 'auto';
        }
    }

    /**
     * Handles success response, renders UI cues, and redirects user
     * @param {string} redirectUrl 
     * @param {string} roleName 
     */
    // function handleLoginSuccess(redirectUrl, roleName) {
    //     showAlert('success', `Welcome back, ${roleName}! Verification successful. Redirecting...`);

    //     // Wait 1.5 seconds for user to read success feedback, then redirect
    //     setTimeout(() => {
    //         window.location.href = redirectUrl;
    //     }, 1500);
    // }

    /**
 
 * @param {string} redirectUrl
 * @param {string} roleName
 */
    function handleLoginSuccess(redirectUrl, roleName) {

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("loggedInRole", roleName);

        if (roleName === "Underwriter") {

            const underwriters =
                JSON.parse(
                    localStorage.getItem("underwriters")
                ) || [];

            const underwriter =
                underwriters.find(
                    u => u.underwriterId === usernameInput.value.trim()
                );

            if (underwriter) {

                localStorage.setItem(
                    "loggedInUser",
                    JSON.stringify({
                        id: underwriter.underwriterId,
                        name: underwriter.name,
                        role: roleName,
                        status: underwriter.status
                    })
                );
            }

        } else {

            localStorage.setItem(
                "loggedInUser",
                JSON.stringify({
                    username: "admin",
                    role: roleName
                })
            );
        }

        showAlert(
            "success",
            `Welcome back, ${roleName}! Verification successful. Redirecting...`
        );

        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1500);
    }

    /**
     * Handles authentication failures
     * @param {string} errorMessage 
     */
    function handleLoginFailure(errorMessage) {
        setLoading(false);
        showAlert('error', errorMessage);
        passwordInput.value = '';
        passwordInput.focus();
    }
});