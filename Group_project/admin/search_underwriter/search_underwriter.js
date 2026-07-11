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

document.addEventListener("DOMContentLoaded", () => {

    const backBtn = document.querySelector(".back-btn");

    // Search Button Function
    window.searchUnderWriter = function () {

        const underwriterId =
            document.getElementById("underwriterId").value.trim();

        const resultCard =
            document.getElementById("resultCard");

        resultCard.style.display = "block";

        // Clear previous result
        resultCard.innerHTML = "";

        // Empty validation
        if (underwriterId === "") {
            
            showModal(
            "error",
            "Not Found",
            "Please enter Underwriter ID"
        );

            return;
        }
        
        const formattedId = underwriterId.toUpperCase();

     
        const uwPattern = /^UW\d{4}$/;

        if (!uwPattern.test(formattedId)) {
            showModal(
                "error",
                "Not Found",
                "Format should be UW followed by 4 digits (Example: UW1001)"
            );

            return;
        }

        // Read Local Storage
        const underwriters =
            JSON.parse(localStorage.getItem("underwriters")) || [];

        // Search Underwriter
        const found = underwriters.find(
            u => u.underwriterId === formattedId
        );

        if (found) {

            showModal(
                "success",
                "Success",
                "UnderWriter Found Successfully."
            );

            resultCard.innerHTML = `
                <div class="success-card">

                    <h3>Underwriter Details</h3>

                    <p>
                        <strong>Underwriter ID:</strong>
                        ${found.underwriterId}
                    </p>
                    <hr>

                    <p>
                        <strong>Name:</strong>
                        ${found.name}
                    </p>
                    <hr>

                    <p>
                        <strong>Date of Birth:</strong>
                        ${found.dob}
                    </p>
                    <hr>

                    <p>
                        <strong>Joining Date:</strong>
                        ${found.joiningDate}
                    </p>
                    <hr>

                    <p>
                        <strong>Status:</strong>
                        ${found.status}
                    </p>

                </div>
            `;

        } else {

            showModal(
                "error",
                "Not Found",
                "No UnderWriter found with this ID"
            );
        }
    };

    // Current Date
    function updateDate() {

        const now = new Date();

        document.getElementById("currentDate").textContent =
            now.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
    }

    updateDate();

    // Back Button
    backBtn.addEventListener("click", () => {
        window.location.href =
            "../admin_dashboard/admin_dashboard.html";
    });

});