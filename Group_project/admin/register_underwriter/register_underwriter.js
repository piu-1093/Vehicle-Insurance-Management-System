document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");
    const backBtn = document.getElementById("backBtn");

    function clearErrors() {

        document.querySelectorAll(".error-text")
            .forEach(error => {
                error.textContent = "";
            });

        document.querySelectorAll("input")
            .forEach(input => {
                input.classList.remove("input-error");
            });

    }

    function showFieldError(inputId, errorId, message) {

        document.getElementById(errorId)
            .textContent = message;
    
        document.getElementById(inputId)
            .classList.add("input-error");
    }
    // =========================
// REAL TIME VALIDATION
// =========================

        document.getElementById("uwid").addEventListener("input", () => {

            const input =
                document.getElementById("uwid");
        
            const value =
                input.value.trim().toUpperCase();
        
            input.value = value;
        
            const error =
                document.getElementById("uwidError");
        
            const underwriters =
                JSON.parse(
                    localStorage.getItem("underwriters")
                ) || [];
        
            const uwPattern = /^UW\d{4}$/;
        
            // Empty
        
            if (value === "") {
        
                error.textContent =
                    "Underwriter ID is required.";
        
                input.classList.add("input-error");
        
                return;
            }
        
            // Invalid format
        
            if (!uwPattern.test(value)) {
        
                error.textContent =
                    "Format should be UW followed by 4 digits (Example: UW1001).";
        
                input.classList.add("input-error");
        
                return;
            }
        
            // Duplicate
        
            const exists = underwriters.some(
                u => u.underwriterId === value
            );
        
            if (exists) {
        
                error.textContent =
                    "Underwriter ID already exists.";
        
                input.classList.add("input-error");
        
                return;
            }
        
            // Valid
        
            error.textContent = "";
        
            input.classList.remove("input-error");
        
        });
document.getElementById("name").addEventListener("input", () => {

    const value =
        document.getElementById("name").value.trim();

    if (value === "") {

        document.getElementById("nameError").textContent =
            "Name is required.";

        return;
    }

    if (!/^[A-Za-z ]+$/.test(value)) {

        showFieldError(
            "name",
            "nameError",
            "Name must contain only alphabets and spaces."
        );

    } else {

        document.getElementById("nameError").textContent = "";

        document.getElementById("name")
            .classList.remove("input-error");
    }

});

document.getElementById("dob").addEventListener("change", () => {

    const dob =
        document.getElementById("dob").value;

    if (!dob) return;

    const birthDate =
        new Date(dob);

    const today =
        new Date();

    let age =
        today.getFullYear() -
        birthDate.getFullYear();

    const monthDiff =
        today.getMonth() -
        birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (
            monthDiff === 0 &&
            today.getDate() <
            birthDate.getDate()
        )
    ) {
        age--;
    }

    if (age < 18) {

        showFieldError(
            "dob",
            "dobError",
            "Underwriter must be at least 18 years old."
        );

    } else {

        document.getElementById("dobError").textContent = "";

        document.getElementById("dob")
            .classList.remove("input-error");
    }

});

document.getElementById("joiningDate")
.addEventListener("change", () => {

    const value =
        document.getElementById("joiningDate").value;

    if (!value) return;

    const joining =
        new Date(value);

    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 7);

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);

    if (
        joining < minDate ||
        joining > maxDate
    ) {

        showFieldError(
            "joiningDate",
            "joiningDateError",
            "Date must be within 7 days before or after today."
        );

    } else {

        document.getElementById(
            "joiningDateError"
        ).textContent = "";

        document.getElementById(
            "joiningDate"
        ).classList.remove("input-error");
    }

});

document.getElementById("password")
.addEventListener("input", () => {

    const value =
        document.getElementById("password").value;

    const pattern =
        /^(?=.*[A-Za-z])(?=.*\d).{10,}$/;

    if (!pattern.test(value)) {

        showFieldError(
            "password",
            "passwordError",
            "Minimum 10 characters with letters and numbers."
        );

    } else {

        document.getElementById(
            "passwordError"
        ).textContent = "";

        document.getElementById("password")
            .classList.remove("input-error");
    }

});

document.getElementById("confirmPassword")
.addEventListener("input", () => {

    const password =
        document.getElementById("password").value;

    const confirm =
        document.getElementById("confirmPassword").value;

    if (password !== confirm) {

        showFieldError(
            "confirmPassword",
            "confirmPasswordError",
            "Passwords do not match."
        );

    } else {

        document.getElementById(
            "confirmPasswordError"
        ).textContent = "";

        document.getElementById(
            "confirmPassword"
        ).classList.remove("input-error");
    }

});
    form.addEventListener("submit", (event) => {

        event.preventDefault();
    
        clearErrors();
    
        const underwriterId =
            document.getElementById("uwid").value.trim();
    
        const name =
            document.getElementById("name").value.trim();
    
        const dob =
            document.getElementById("dob").value;
    
        const joiningDate =
            document.getElementById("joiningDate").value;
    
        const password =
            document.getElementById("password").value;
    
        const confirmPassword =
            document.getElementById("confirmPassword").value;
    
        let isValid = true;
    
        let underwriters =
            JSON.parse(
                localStorage.getItem("underwriters")
            ) || [];
    
        // Underwriter ID
    
        if (!/^UW\d{4}$/.test(underwriterId)){
    
            showFieldError(
                "uwid",
                "uwidError",
                "Format should be UW followed by 4 digits."
            );
    
            isValid = false;
        }
    
        const alreadyExists = underwriters.some(
            u => u.underwriterId === underwriterId
        );
    
        if (alreadyExists) {
    
            showFieldError(
                "uwid",
                "uwidError",
                "Underwriter ID already exists."
            );
    
            isValid = false;
        }
    
        // Name Validation
    
        if (!/^[A-Za-z ]+$/.test(name)) {
    
            showFieldError(
                "name",
                "nameError",
                "Name must contain only alphabets and spaces."
            );
    
            isValid = false;
        }
    
        // Age Validation (18)
    
        const birthDate = new Date(dob);
        const today = new Date();
    
        let age =
            today.getFullYear() -
            birthDate.getFullYear();
    
        const monthDiff =
            today.getMonth() -
            birthDate.getMonth();
    
        if (
            monthDiff < 0 ||
            (
                monthDiff === 0 &&
                today.getDate() < birthDate.getDate()
            )
        ) {
            age--;
        }
    
        if (age < 18) {
    
            showFieldError(
                "dob",
                "dobError",
                "Underwriter must be at least 18 years old."
            );
    
            isValid = false;
        }
    
        // Joining Date Validation
    
        const joining =
            new Date(joiningDate);
    
        const minDate = new Date();
        minDate.setDate(minDate.getDate() - 7);
    
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 7);
    
        if (
            joining < minDate ||
            joining > maxDate
        ) {
    
            showFieldError(
                "joiningDate",
                "joiningDateError",
                "Joining date must be within 7 days before or after today."
            );
    
            isValid = false;
        }
    
        // Password
    
        const passwordPattern =
            /^(?=.*[A-Za-z])(?=.*\d).{10,}$/;
    
        if (!passwordPattern.test(password)) {
    
            showFieldError(
                "password",
                "passwordError",
                "Password must contain letters, numbers and be at least 10 characters."
            );
    
            isValid = false;
        }
    
        // Confirm Password
    
        if (password !== confirmPassword) {
    
            showFieldError(
                "confirmPassword",
                "confirmPasswordError",
                "Passwords do not match."
            );
    
            isValid = false;
        }
    
        if (!isValid) {
            return;
        }
    
        // Create Object
    
        const formattedJoiningDate =
            new Date(joiningDate)
            .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
    
            const underwriter = {
                underwriterId,
                name,
                dob,
                joiningDate: formattedJoiningDate,
            
                registeredOn: new Date().toLocaleString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                ),
            
                password,
                status: "Active"
            };
            
    
        underwriters.push(underwriter);
    
        localStorage.setItem(
            "underwriters",
            JSON.stringify(underwriters)
        );
    
        // Success Modal
    
        const modal =
            document.getElementById(
                "successModal"
            );
    
        modal.classList.add("active");
    
        form.reset();
    
    });
    const modalOkBtn =
    document.getElementById("modalOkBtn");

    if (modalOkBtn) {

        modalOkBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    "../view_underwriter/view_underwriters.html";

            }
        );
    }
    backBtn.addEventListener("click", () => {

        window.location.href =
            "../dashboard/dashboard.html";

    });

});