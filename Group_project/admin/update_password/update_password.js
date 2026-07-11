function showModal(type, title, message) {

    const modal =
        document.getElementById("messageModal");

    const header =
        document.getElementById("modalHeader");

    const modalTitle =
        document.getElementById("modalTitle");

    const modalMessage =
        document.getElementById("modalMessage");

    header.className = "modal-header " + type;

    modalTitle.textContent = title;
    modalMessage.textContent = message;

    modal.style.display = "flex";
}

function closeModal() {
    document.getElementById("messageModal").style.display = "none";
}

function searchUnderwriter() {

    const underwriterId =
        document.getElementById("underwriterId")
        .value.trim()
        .toUpperCase();

    const resultCard =
        document.getElementById("resultCard");

    const passwordSection =
        document.getElementById("passwordSection");

    resultCard.style.display = "block";

    if (underwriterId === "") {

        passwordSection.style.display = "none";

            showModal(
                "error",
                "Validation Error",
                "Please enter Underwriter ID"
            );

        return;
    }

    const uwPattern = /^UW\d{4}$/;

    if (!uwPattern.test(underwriterId)) {

        passwordSection.style.display = "none";

        showModal(
            "error",
            "Validation Error",
            "Format should be UW followed by 4 digits (Example: UW1001)"
        );

        return;
    }

    const underwriters =
        JSON.parse(localStorage.getItem("underwriters")) || [];

    const found =
        underwriters.find(
            u => u.underwriterId === underwriterId
        );

    if (found) {

        passwordSection.style.display = "block";

        document.getElementById("underwriterName").textContent =
            found.name;

        showModal(
            "success",
            "Success",
            "UnderWriter Found Successfully."
        );

    } else {

        passwordSection.style.display = "none";

        document.getElementById("underwriterName").textContent = "";

        showModal(
            "error",
            "Validation Error",
            "Invalid Underwriter ID"
        );
    }
}
function updatePassword() {

    let underwriterId =
        document.getElementById("underwriterId")
        .value.trim()
        .toUpperCase();

    let currentPassword =
        document.getElementById("currentPassword")
        .value.trim();

    let newPassword =
        document.getElementById("newPassword")
        .value.trim();

    let confirmPassword =
        document.getElementById("confirmPassword")
        .value.trim();

    let resultCard =
        document.getElementById("resultCard");

    resultCard.style.display = "block";

    // Empty Validation

    if (
        underwriterId === "" ||
        currentPassword === "" ||
        newPassword === "" ||
        confirmPassword === ""
    ) {

        showModal(
            "error",
            "Validation Error",
            "Please fill all fields"
        );

        return;
    }

    // Password Match Validation

    if (newPassword !== confirmPassword) {

        showModal(
            "error",
            "Validation Error",
            "New Password and Confirm Password do not match."
        );

        return;
    }

    // Password Format Validation

    const passwordPattern =
        /^(?=.*[A-Za-z])(?=.*\d).{10,}$/;

    if (!passwordPattern.test(newPassword)) {

        showModal(
            "error",
            "Validation Error",
            "Password must contain letters, numbers and be at least 10 characters."
        );

        return;
    }

    let underwriters =
        JSON.parse(localStorage.getItem("underwriters")) || [];

    let user =
        underwriters.find(
            u =>
                u.underwriterId === underwriterId &&
                u.password === currentPassword
        );

    if (user) {

        user.password = newPassword;

        localStorage.setItem(
            "underwriters",
            JSON.stringify(underwriters)
        );

        showModal(
            "success",
            "Success",
            `Password updated successfully for Underwriter ID : ${underwriterId}`
        );

    } else {

        showModal(
            "error",
            "Validation Error",
            "Invalid Current Password"
        );
    }
}

/* Dynamic Date & Time */

function updateDate() {
    const now = new Date();

    document.getElementById("currentDate").innerHTML = now.toLocaleDateString(
        'en-GB',
        {
            weekday: 'long',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }
    );
}

updateDate();

/* Back Button */

document.querySelector(".back-btn").addEventListener(
    "click",
    function () {
        history.back();
    }
);

function toggleSidebar() {
    document.querySelector(".sidebar")
        .classList.toggle("hide");

    document.querySelector(".main-content")
        .classList.toggle("full");

}