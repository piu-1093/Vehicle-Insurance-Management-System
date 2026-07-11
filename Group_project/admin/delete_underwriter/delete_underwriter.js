let searchedUnderwriter = null;
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("deleteForm");
    const underwriterInput = document.getElementById("underwriterId");

    /* NUMERIC ONLY VALIDATION */

    underwriterInput.addEventListener("input", function () {
        this.value = this.value.toUpperCase();
    });
    underwriterInput.addEventListener("paste", function () {

        setTimeout(() => {
            this.value = this.value.toUpperCase();
        }, 0);

    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const id = underwriterInput.value.trim().toUpperCase();

        // Empty Validation
        if (id === "") {
            showModal(
                "Validation Error", "Please enter an UnderWriter ID.");
            return;
        }

        // Search First Validation
        if (!searchedUnderwriter) {
            showModal(
                "Search Required", "Please search and verify an UnderWriter before deleting.");
            return;
        }

        if (
            searchedUnderwriter.underwriterId !==
            id.toUpperCase()
        ) {
            showModal(
                "ID Changed", "Please search again after modifying the UnderWriter ID."
            );
            return;
        }
        let underwriters =
            JSON.parse(localStorage.getItem("underwriters")) || [];

        let index =
            underwriters.findIndex(
                u => u.underwriterId === id.toUpperCase()
            );

        if (index === -1) {
            showModal(
                "Not Found",
                "UnderWriter ID not found."
            );
            return;
        }

        // Delete Confirmation
        showConfirmModal(
            "Delete UnderWriter",
            `Are you sure you want to delete UnderWriter ${id}?\n\nThis action cannot be undone.`,
            () => {

                underwriters.splice(index, 1);
                localStorage.setItem(
                    "underwriters",
                    JSON.stringify(underwriters)
                );
                showModal(
                    "Deleted Successfully",
                    `UnderWriter ${id} has been deleted successfully.`
                );
                form.reset();
                searchedUnderwriter = null;
                document.getElementById(
                    "underwriterDetails"
                ).style.display = "none";
            }
        );
    });
});

function searchUnderwriter() {
    
    const uwId =
        document.getElementById("underwriterId")
            .value
            .trim()
            .toUpperCase();

    // Empty Validation

    if (uwId === "") {

        showModal(
            "Validation Error",
            "Please enter an UnderWriter ID."
        );

        return;
    }

    if (!/^UW\d{4}$/.test(uwId)) {
        showModal(
            "Validation Error",
            "Format should be UW followed by 4 digits (Example: UW1001)."
        );
        return;
    }

    const underwriters =
        JSON.parse(localStorage.getItem("underwriters")) || [];

    const underwriter =
        underwriters.find(
            u => u.underwriterId === uwId
        );

    if (!underwriter) {

        searchedUnderwriter = null;

        document.getElementById(
            "underwriterDetails"
        ).style.display = "none";

        showModal(
            "Not Found",
            "No UnderWriter found with this ID."
        );

        return;
    }

    searchedUnderwriter = underwriter;

    document.getElementById("uwId").textContent =
        underwriter.underwriterId;

    document.getElementById("uwName").textContent =
        underwriter.name;

    document.getElementById("uwDob").textContent =
        formatDate(underwriter.dob);

    document.getElementById("uwJoiningDate").textContent =
        underwriter.joiningDate;

    document.getElementById(
        "underwriterDetails"
    ).style.display = "block";

    showModal(
        "Search Successful",
        `UnderWriter ${uwId} found successfully.`
    );
}

/*MESSAGE MODAL*/

function showModal(title, message) {
    document.getElementById("modalTitle").innerText =
        title;
    document.getElementById("modalMessage").innerText =
        message;
    document.getElementById("modalCancel").style.display =
        "none";
    document.getElementById("customModal").style.display =
        "flex";
}

document
    .getElementById("modalOk")
    .addEventListener("click", () => {
        document.getElementById(
            "customModal"
        ).style.display = "none";
    });

/*CONFIRM MODAL */

function showConfirmModal(title, message, callback) {
    document.getElementById("modalTitle").innerText =
        title;
    document.getElementById("modalMessage").innerText =
        message;
    const modal =
        document.getElementById("customModal");
    const okBtn =
        document.getElementById("modalOk");
    const cancelBtn =
        document.getElementById("modalCancel");
    cancelBtn.style.display = "inline-block";
    modal.style.display = "flex";
    okBtn.onclick = () => {
        modal.style.display = "none";
        callback();
    };

    cancelBtn.onclick = () => {
        modal.style.display = "none";
    };
}

function goBack() {
    window.location.href =
        "../admin_dashboard/admin_dashboard.html";
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day =
        String(date.getDate()).padStart(2, "0");
    const month =
        String(date.getMonth() + 1).padStart(2, "0");
    const year =
        date.getFullYear();
    return `${day}-${month}-${year}`;
}