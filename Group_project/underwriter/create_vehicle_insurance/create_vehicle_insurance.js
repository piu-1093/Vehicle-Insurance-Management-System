function convertToDDMMYYYY(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("-"); // [YYYY, MM, DD]
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
}

const form = document.getElementById("insuranceForm");

const policyNo = document.getElementById("policyNo");
const vehicleNo = document.getElementById("vehicleNo");
const vehicleType = document.getElementById("vehicleType");
const customerName = document.getElementById("customerName");
const engineNo = document.getElementById("engineNo");
const chassisNo = document.getElementById("chassisNo");
const phoneNo = document.getElementById("phoneNo");
const insuranceType = document.getElementById("insuranceType");
const premium = document.getElementById("premium");
const fromDate = document.getElementById("fromDate");
const toDate = document.getElementById("toDate");
const underwriterIdInput = document.getElementById("underwriterId");


const policyRegex = /^[A-Za-z0-9-]{10,20}$/;
const vehicleRegex = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/;
const nameRegex = /^[A-Za-z ]{3,50}$/;
const engineRegex = /^[A-Za-z0-9]{8,17}$/;
const chassisRegex = /^[A-Za-z0-9]{17}$/;
const phoneRegex = /^[6-9]\d{9}$/;


document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser =
        JSON.parse(
            localStorage.getItem("loggedInUser")
        );
    if (
        loggedInUser &&
        loggedInUser.role === "Underwriter"
    ) {
        underwriterIdInput.value =
            loggedInUser.id;
    } else {
        underwriterIdInput.value =
            "Not Available";
    }
    const now = new Date();
    const todayLocal = now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, "0") + "-" +
        String(now.getDate()).padStart(2, "0");
    fromDate.min = todayLocal;
    fromDate.value = todayLocal;
    let expiryDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 365);
    let day = String(expiryDate.getDate()).padStart(2, "0");
    let month = String(expiryDate.getMonth() + 1).padStart(2, "0");
    let year = expiryDate.getFullYear();
    toDate.value = `${day}-${month}-${year}`;

});

function showError(input, message) {

    const formGroup =
        input.parentElement;

    const error =
        formGroup.querySelector(".error");

    if (error) {
        error.innerText = message;
        error.style.display = "block";
    }

    input.style.borderColor = "#EF4444";
}

function showSuccess(input) {

    const formGroup =
        input.parentElement;

    const error =
        formGroup.querySelector(".error");

    if (error) {
        error.innerText = "";
        error.style.display = "none";
    }

    input.style.borderColor = "#22C55E";
}



function calculatePremium() {
    if (vehicleType.value === "2 Wheeler") {
        premium.value = "2500";
    } else if (vehicleType.value === "4 Wheeler") {
        premium.value = "6500";
    } else {
        premium.value = "";
    }
}

vehicleType.addEventListener(
    "change",
    calculatePremium
);

insuranceType.addEventListener(
    "change",
    calculatePremium
);



fromDate.addEventListener(
    "change",
    function () {

        if (fromDate.value !== "") {

            let date =
                new Date(
                    fromDate.value
                );

            date.setDate(
                date.getDate() + 365
            );

            let day =
                String(
                    date.getDate()
                ).padStart(2, "0");

            let month =
                String(
                    date.getMonth() + 1
                ).padStart(2, "0");

            let year =
                date.getFullYear();

            toDate.value =
                `${day}-${month}-${year}`;
        }
        else {
            toDate.value = "";
        }
    }
);



function validatePolicy() {

    const value =
        policyNo.value.trim();

    if (!policyRegex.test(value)) {

        showError(
            policyNo,
            "Policy Number must be 10-20 alphanumeric characters."
        );

        return false;
    }

    showSuccess(policyNo);

    return true;
}

function validateVehicle() {

    const value =
        vehicleNo.value
            .trim()
            .toUpperCase();

    vehicleNo.value = value;

    if (!vehicleRegex.test(value)) {

        showError(
            vehicleNo,
            "Vehicle Number should be like KL07AB1234."
        );

        return false;
    }

    showSuccess(vehicleNo);

    return true;
}

function validateCustomerName() {

    const value =
        customerName.value.trim();

    if (!nameRegex.test(value)) {

        showError(
            customerName,
            "Only alphabets and spaces are allowed."
        );

        return false;
    }

    showSuccess(customerName);

    return true;
}

function validateEngine() {

    const value =
        engineNo.value
            .trim()
            .toUpperCase();

    engineNo.value = value;

    if (!engineRegex.test(value)) {

        showError(
            engineNo,
            "Engine Number must be 8-17 alphanumeric characters."
        );

        return false;
    }

    showSuccess(engineNo);

    return true;
}

function validateChassis() {

    const value =
        chassisNo.value
            .trim()
            .toUpperCase();

    if (!chassisRegex.test(value)) {

        showError(
            chassisNo,
            "Chassis Number (VIN) must contain exactly 17 valid characters."
        );

        return false;
    }

    showSuccess(chassisNo);

    return true;
}

function validatePhone() {

    const value =
        phoneNo.value.trim();

    if (!phoneRegex.test(value)) {

        showError(
            phoneNo,
            "Enter a valid 10 digit phone number."
        );

        return false;
    }

    showSuccess(phoneNo);

    return true;
}


policyNo.addEventListener(
    "input",
    validatePolicy
);
vehicleNo.addEventListener(
    "input",
    validateVehicle
);
customerName.addEventListener(
    "input",
    validateCustomerName
);
engineNo.addEventListener(
    "input",
    validateEngine
);
phoneNo.addEventListener(
    "input",
    validatePhone
);
chassisNo.addEventListener(
    "input",
    function () {
        this.value =
            this.value
                .toUpperCase()
                .replace(/[IOQ]/g, "");
        validateChassis();
    }
);

form.addEventListener(
    "submit",
    function (event) {
        event.preventDefault();
        let isValid = true;
        if (!validatePolicy()) {
            isValid = false;
        }
        if (!validateVehicle()) {
            isValid = false;
        }
        if (vehicleType.value === "") {
            showError(
                vehicleType,
                "Please select Vehicle Type"
            );
            isValid = false;
        } else {
            showSuccess(vehicleType);
        }
        if (!validateCustomerName()) {
            isValid = false;
        }
        if (!validateEngine()) {
            isValid = false;
        }
        if (!validateChassis()) {
            isValid = false;
        }
        if (!validatePhone()) {
            isValid = false;
        }
        if (insuranceType.value === "") {
            showError(
                insuranceType,
                "Please select Insurance Type"
            );
            isValid = false;
        } else {
            showSuccess(insuranceType);
        }
        const _now = new Date();
        const todayLocal = _now.getFullYear() + "-" +
            String(_now.getMonth() + 1).padStart(2, "0") + "-" +
            String(_now.getDate()).padStart(2, "0");
        if (fromDate.value === "") {
            showError(fromDate, "From Date is required.");
            isValid = false;
        } else if (fromDate.value < todayLocal) {
            showError(fromDate, "From Date must be today or a future date.");
            isValid = false;
        } else {
            showSuccess(fromDate);
        }
        if (!isValid) {
            return;
        }
        const policy = {
            policyNo:
                policyNo.value.trim(),
            vehicleNo:
                vehicleNo.value
                    .trim()
                    .toUpperCase(),
            vehicleType:
                vehicleType.value,
            customerName:
                customerName.value.trim(),
            engineNo:
                engineNo.value
                    .trim()
                    .toUpperCase(),
            chassisNo:
                chassisNo.value
                    .trim()
                    .toUpperCase(),
            phoneNo:
                phoneNo.value.trim(),
            insuranceType:
                insuranceType.value,
            premium:
                premium.value,
            fromDate:
                convertToDDMMYYYY(fromDate.value),
            toDate:
                toDate.value,
            underwriterId:
                underwriterIdInput.value,

            createdOn:
                new Date().toISOString()
        };
        let policies =
            JSON.parse(
                localStorage.getItem("policies")
            ) || [];
        const exists =
            policies.some(
                p =>
                    p.policyNo ===
                    policy.policyNo
            );
        if (exists) {
            alert(
                "Policy Number already exists."
            );
            return;
        }
        policies.push(policy);

        localStorage.setItem(
            "policies",
            JSON.stringify(policies)
        );

        alert(
            "Vehicle Insurance Created Successfully"
        );

        
        window.location.href =
            "/Group_project/underwriter/view_policy/view_policy.html";
        const inputs =
            document.querySelectorAll(
                "input, select"
            );
        inputs.forEach(input => {
            input.style.borderColor =
                "#E5E7EB";
        });
    }
);

form.addEventListener(
    "reset",
    function () {
        setTimeout(function () {
            premium.value = "";
            const _resetNow = new Date();
            const todayLocalReset = _resetNow.getFullYear() + "-" +
                String(_resetNow.getMonth() + 1).padStart(2, "0") + "-" +
                String(_resetNow.getDate()).padStart(2, "0");
            fromDate.value = todayLocalReset;
            fromDate.min = todayLocalReset;

            let expiryDate = new Date(_resetNow.getFullYear(), _resetNow.getMonth(), _resetNow.getDate() + 365);
            let expiryDay = String(expiryDate.getDate()).padStart(2, "0");
            let expiryMonth = String(expiryDate.getMonth() + 1).padStart(2, "0");
            let expiryYear = expiryDate.getFullYear();

            toDate.value = `${expiryDay}-${expiryMonth}-${expiryYear}`;

            const errors =
                document.querySelectorAll(
                    ".error"
                );
            errors.forEach(function (error) {

                error.style.display = "none";
                error.innerText = "";
            });
            const inputs =
                document.querySelectorAll(
                    "input, select"
                );
            inputs.forEach(function (input) {
                input.style.borderColor =
                    "#E5E7EB";
            });
        }, 10);
    }
);