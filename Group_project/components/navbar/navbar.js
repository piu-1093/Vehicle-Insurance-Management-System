document.addEventListener("DOMContentLoaded", () => {

    /* Current Date */

    const dateElement = document.getElementById("currentDate");

    const today = new Date();

    dateElement.textContent = today.toLocaleDateString(
        "en-IN",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

    /* Logged User */

    const userData = JSON.parse(
        localStorage.getItem("loggedInUser")
    );

    const usernameDisplay =
        document.getElementById("usernameDisplay");

    const navUsername =
        document.getElementById("navUsername");

    const roleDisplay =
        document.getElementById("roleDisplay");

    if (userData) {

        const username =
            userData.name ||
            userData.username ||
            userData.id ||
            "User";

        usernameDisplay.textContent = username;
        navUsername.textContent = username;

        roleDisplay.textContent =
            userData.role || "User";
    }

    /* Dropdown */

    const profileBtn =
        document.getElementById("profileBtn");

    const dropdown =
        document.getElementById("profileDropdown");

    profileBtn.addEventListener("click", () => {

        dropdown.classList.toggle("show");

    });
    if (profileBtn && dropdown) { profileBtn.addEventListener("click", (e) => { e.stopPropagation(); dropdown.classList.toggle("show"); }); document.addEventListener("click", () => { dropdown.classList.remove("show"); }); dropdown.addEventListener("click", (e) => { e.stopPropagation(); }); }

    document.addEventListener("click", (e) => {

        if (
            !profileBtn.contains(e.target) &&
            !dropdown.contains(e.target)
        ) {
            dropdown.classList.remove("show");
        }

    });

    /* Logout */

    document
        .getElementById("logoutBtn")
        .addEventListener("click", () => {

            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("loggedInRole");
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("loggedInUnderwriter");

            window.location.href =
                "../../login/login.html";

        });

});