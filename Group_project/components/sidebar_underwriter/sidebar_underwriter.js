document.addEventListener("DOMContentLoaded", () => {

    // Highlight active menu
    const currentPage = window.location.pathname.split("/").pop();

    const menuLinks = document.querySelectorAll(".menu-item a");

    menuLinks.forEach(link => {

        const href = link.getAttribute("href");

        if (!href || href === "#") return;

        const linkPage = href.split("/").pop();

        if (currentPage === linkPage) {
            link.parentElement.classList.add("active");
        } else {
            link.parentElement.classList.remove("active");
        }

    });

    // Logout functionality
    const logoutLink = document.querySelector(".logout a");

    if (logoutLink) {

        logoutLink.addEventListener("click", (event) => {

            event.preventDefault();

            const confirmLogout = confirm(
                "Are you sure you want to logout?"
            );

            if (confirmLogout) {
                window.top.location.href = "../../index.html";
            }

        });

    }

});