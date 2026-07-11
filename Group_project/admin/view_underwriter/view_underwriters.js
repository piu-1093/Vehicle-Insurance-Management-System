document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("searchInput");
    const filterBtn = document.getElementById("filterBtn");
    const filterMenu = document.getElementById("filterMenu");

    loadUnderwriters();

    // Open/Close filter menu
    filterBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        filterMenu.classList.toggle("hidden");
    });

    // Close menu when clicking outside
    document.addEventListener("click", () => {
        filterMenu.classList.add("hidden");
    });

    filterMenu.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    // Search while typing
    searchInput.addEventListener("keyup", filterTable);

    // Search again when filter changes
    document.querySelectorAll('input[name="filterType"]').forEach(radio => {
        radio.addEventListener("change", filterTable);
    });

});


/* Load Underwriters */

function loadUnderwriters() {

    const tableBody = document.getElementById("underwriterTableBody");

    const underwriters =
        JSON.parse(localStorage.getItem("underwriters")) || [];

    tableBody.innerHTML = "";

    if (underwriters.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No Underwriters Found
                </td>
            </tr>
        `;

        updateFooterCount(0);
        return;
    }

    underwriters.forEach((uw, index) => {

        tableBody.innerHTML += `
            <tr>

                <td>${index + 1}</td>

                <td class="id">${uw.underwriterId}</td>

                <td class="name">${uw.name}</td>

                <td>${formatDate(uw.dob)}</td>

                <td>${formatDate(uw.joiningDate)}</td>

                <td>
                    <span class="status ${
                        uw.status === "Active"
                            ? "active-status"
                            : "inactive-status"
                    }">
                        ${uw.status}
                    </span>
                </td>

            </tr>
        `;
    });

    updateFooterCount(underwriters.length);

}


/* Search + Filter */

function filterTable() {

    const value =
        document.getElementById("searchInput").value.trim().toLowerCase();

    const filterType =
        document.querySelector('input[name="filterType"]:checked').value;

    const rows =
        document.querySelectorAll("#underwriterTableBody tr");

    rows.forEach(row => {

        const id =
            row.querySelector(".id").textContent.toLowerCase();

        const name =
            row.querySelector(".name").textContent.toLowerCase();

        let match = false;

        if (filterType === "name") {

            match = name.includes(value);

        } else {

            match = id.includes(value);

        }

        row.style.display = match ? "" : "none";

    });

}


/* Date Formatter */

function formatDate(dateString) {

    if (!dateString) return "-";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}


/* Footer Count */

function updateFooterCount(total) {

    const footerText = document.querySelector(".bottom p");

    if (footerText) {

        footerText.textContent =
            `Showing ${total} of ${total} entries`;

    }

}