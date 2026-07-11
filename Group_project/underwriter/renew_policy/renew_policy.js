const policyId = document.getElementById("policyId");
const searchBtn = document.getElementById("searchBtn");
const renewBtn = document.getElementById("renewBtn");
const resetBtn = document.getElementById("resetBtn");
const backBtn = document.getElementById("backBtn");

const policySection = document.getElementById("policySection");
const successMessage = document.getElementById("successMessage");

const policyIdError = document.getElementById("policyIdError");
const premiumError = document.getElementById("premiumError");

const newPremium = document.getElementById("newPremium");

const policyRegex = /^[A-Za-z0-9-]{10,20}$/;



function showError(element, errorElement, message) {
    element.classList.add("invalid");
    errorElement.textContent = message;
}

function clearError(element, errorElement) {
    element.classList.remove("invalid");
    errorElement.textContent = "";
}



function formatDate(date) {

    const day =
        String(date.getDate()).padStart(2, "0");

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const year =
        date.getFullYear();

    return `${day}-${month}-${year}`;
}



function setRenewalPremium(
    vehicleType,
    insuranceType
) {

    if (
        vehicleType === "2 Wheeler" &&
        insuranceType === "Third Party"
    ) {
        newPremium.value = "2500";
    }

    else if (
        vehicleType === "2 Wheeler" &&
        insuranceType === "Full Insurance"
    ) {
        newPremium.value = "4500";
    }

    else if (
        vehicleType === "4 Wheeler" &&
        insuranceType === "Third Party"
    ) {
        newPremium.value = "6000";
    }

    else if (
        vehicleType === "4 Wheeler" &&
        insuranceType === "Full Insurance"
    ) {
        newPremium.value = "10000";
    }

    else {
        newPremium.value = "";
    }
}



searchBtn.addEventListener(
    "click",
    function () {

        const policyValue =
            policyId.value.trim();

        if (!policyRegex.test(policyValue)) {

            showError(
                policyId,
                policyIdError,
                "Policy Number must be 10-20 alphanumeric characters."
            );

            policySection.classList.add("hidden");
            return;
        }

        clearError(
            policyId,
            policyIdError
        );

        const policies =
            JSON.parse(
                localStorage.getItem("policies")
            ) || [];

        const policy =
            policies.find(
                p =>
                    p.policyNo === policyValue
            );

        if (!policy) {

            showError(
                policyId,
                policyIdError,
                "Policy not found."
            );

            policySection.classList.add("hidden");
            return;
        }

        document.getElementById(
            "policyNumber"
        ).value =
            policy.policyNo;

        document.getElementById(
            "customerName"
        ).value =
            policy.customerName;

        document.getElementById(
            "vehicleType"
        ).value =
            policy.vehicleType;

        document.getElementById(
            "insuranceType"
        ).value =
            policy.insuranceType;

        document.getElementById(
            "currentPremium"
        ).value =
            policy.premium;

        document.getElementById(
            "currentFromDate"
        ).value =
            policy.fromDate;

        document.getElementById(
            "currentToDate"
        ).value =
            policy.toDate;

        setRenewalPremium(
            policy.vehicleType,
            policy.insuranceType
        );

        policySection.classList.remove(
            "hidden"
        );

        const today = new Date();

        const expiryParts =
            policy.toDate.split("-");

        const expiryDate =
            new Date(
                expiryParts[2],
                expiryParts[1] - 1,
                expiryParts[0]
            );

        if (expiryDate >= today) {

            renewBtn.disabled = true;
            renewBtn.style.opacity = "0.6";
            renewBtn.style.cursor = "not-allowed";

            successMessage.textContent =
                "⚠ Policy is still active and cannot be renewed until expiry.";

            successMessage.style.color =
                "#F59E0B";
        }
        else {

            renewBtn.disabled = false;
            renewBtn.style.opacity = "1";
            renewBtn.style.cursor = "pointer";

            successMessage.textContent =
                "✅ Policy has expired and is eligible for renewal.";

            successMessage.style.color =
                "#22C55E";
        }
    }
);


renewBtn.addEventListener(
    "click",
    function () {

        const premiumValue =
            newPremium.value;

        if (premiumValue === "") {

            showError(
                newPremium,
                premiumError,
                "Premium amount not available."
            );

            return;
        }

        clearError(
            newPremium,
            premiumError
        );

        const policies =
            JSON.parse(
                localStorage.getItem("policies")
            ) || [];

        const policyNo =
            document.getElementById(
                "policyNumber"
            ).value;

        const policy =
            policies.find(
                p =>
                    p.policyNo === policyNo
            );

        if (!policy) {

            successMessage.textContent =
                "Policy not found.";

            return;
        }

        const today =
            new Date();

        const renewalDate =
            new Date(today);

        renewalDate.setDate(
            renewalDate.getDate() + 365
        );

        const newToDate =
            formatDate(
                renewalDate
            );

        policy.premium =
            premiumValue;

        policy.fromDate =
            formatDate(today);

        policy.toDate =
            newToDate;

        policy.lastRenewedOn =
            formatDate(today);

        localStorage.setItem(
            "policies",
            JSON.stringify(policies)
        );

        document.getElementById(
            "currentPremium"
        ).value =
            policy.premium;

        document.getElementById(
            "currentFromDate"
        ).value =
            policy.fromDate;

        document.getElementById(
            "currentToDate"
        ).value =
            policy.toDate;

        successMessage.textContent =
            "✅ Policy renewed successfully";
    }
);

resetBtn.addEventListener(
    "click",
    function () {

        policyId.value = "";
        newPremium.value = "";

        clearError(
            policyId,
            policyIdError
        );

        clearError(
            newPremium,
            premiumError
        );

        successMessage.textContent = "";

        renewBtn.disabled = false;
        renewBtn.style.opacity = "1";
        renewBtn.style.cursor = "pointer";

        policySection.classList.add(
            "hidden"
        );
    }
);


backBtn.addEventListener(
    "click",
    function () {

        window.history.back();
    }
);



policyId.addEventListener(
    "input",
    function () {

        this.value =
            this.value
                .toUpperCase()
                .replace(
                    /[^A-Z0-9-]/g,
                    ""
                );

        if (
            this.value.length === 0
        ) {

            clearError(
                policyId,
                policyIdError
            );

            return;
        }

        if (
            policyRegex.test(
                this.value
            )
        ) {

            clearError(
                policyId,
                policyIdError
            );
        }
        else {

            showError(
                policyId,
                policyIdError,
                "Policy Number must be 10-20 alphanumeric characters."
            );
        }
    }
);