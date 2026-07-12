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

let currentPolicy = null;

function showError(element, errorElement, message) {
    element.classList.add("invalid");
    errorElement.textContent = message;
}

function clearError(element, errorElement) {
    element.classList.remove("invalid");
    errorElement.textContent = "";
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

searchBtn.addEventListener("click", function () {
    const policyValue = policyId.value.trim();

    // Reset UI state
    successMessage.textContent = "";
    clearError(policyId, policyIdError);
    clearError(newPremium, premiumError);
    newPremium.value = "";
    newPremium.readOnly = true;
    currentPolicy = null;

    if (policyValue === "") {
        showError(policyId, policyIdError, "Policy ID is required.");
        policySection.classList.add("hidden");
        return;
    }

    if (!policyRegex.test(policyValue)) {
        showError(policyId, policyIdError, "Policy Number must be 10-20 alphanumeric characters.");
        policySection.classList.add("hidden");
        return;
    }

    let policies = [];
    try {
        policies = JSON.parse(localStorage.getItem("policies")) || [];
    } catch (e) {
        showError(policyId, policyIdError, "Failed to read data from local storage.");
        policySection.classList.add("hidden");
        return;
    }

    const policy = policies.find(p => p.policyNo === policyValue);

    if (!policy) {
        showError(policyId, policyIdError, "Policy not found.");
        policySection.classList.add("hidden");
        return;
    }

    currentPolicy = policy;

    // Load Details in Read-only Mode
    document.getElementById("policyNumber").value = policy.policyNo || "";
    document.getElementById("customerName").value = policy.customerName || "";
    document.getElementById("vehicleType").value = policy.vehicleType || "";
    document.getElementById("insuranceType").value = policy.insuranceType || "";
    document.getElementById("currentPremium").value = policy.premium || "";
    document.getElementById("currentFromDate").value = policy.fromDate || "";
    document.getElementById("currentToDate").value = policy.toDate || "";

    // Enable the premium input and make it editable
    newPremium.readOnly = false;
    newPremium.value = "";

    // Enable Renew Button
    renewBtn.disabled = false;
    renewBtn.style.opacity = "1";
    renewBtn.style.cursor = "pointer";

    policySection.classList.remove("hidden");
});

renewBtn.addEventListener("click", function () {
    if (!currentPolicy) {
        successMessage.textContent = "Please search for a policy first.";
        successMessage.style.color = "red";
        return;
    }

    // Verify Session
    const loggedInUnderwriter = JSON.parse(localStorage.getItem("loggedInUnderwriter"));
    const loggedInUnderwriterId = loggedInUnderwriter?.underwriterId;

    if (!loggedInUnderwriterId) {
        successMessage.textContent = "Missing logged-in session. Please log in again.";
        successMessage.style.color = "red";
        return;
    }

    const premiumValue = newPremium.value.trim();

    if (premiumValue === "") {
        showError(newPremium, premiumError, "Premium is mandatory.");
        return;
    }

    if (isNaN(premiumValue) || Number(premiumValue) <= 0) {
        showError(newPremium, premiumError, "Premium must be numeric and greater than zero.");
        return;
    }

    clearError(newPremium, premiumError);

    // Confirmation dialog
    if (!confirm("Are you sure you want to renew this policy?")) {
        return;
    }

    let policies = [];
    try {
        policies = JSON.parse(localStorage.getItem("policies")) || [];
    } catch (e) {
        successMessage.textContent = "Failed to load policies database.";
        successMessage.style.color = "red";
        return;
    }

    const policyIndex = policies.findIndex(p => p.policyNo === currentPolicy.policyNo);
    if (policyIndex === -1) {
        successMessage.textContent = "Policy no longer exists in local storage.";
        successMessage.style.color = "red";
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiryParts = currentPolicy.toDate.split("-");
    const expiryDate = new Date(expiryParts[2], expiryParts[1] - 1, expiryParts[0]);
    expiryDate.setHours(0, 0, 0, 0);

    let newFromDateObj;
    if (today > expiryDate) {
        newFromDateObj = new Date(today);
    } else {
        newFromDateObj = new Date(expiryDate);
        newFromDateObj.setDate(newFromDateObj.getDate() + 1);
    }

    const newToDateObj = new Date(newFromDateObj);
    newToDateObj.setDate(newToDateObj.getDate() + 365);

    const newFromDate = formatDate(newFromDateObj);
    const newToDate = formatDate(newToDateObj);

    // Update the record fields
    policies[policyIndex].premium = premiumValue;
    policies[policyIndex].fromDate = newFromDate;
    policies[policyIndex].toDate = newToDate;
    policies[policyIndex].underwriterId = loggedInUnderwriterId;
    policies[policyIndex].lastRenewedOn = formatDate(new Date());

    try {
        localStorage.setItem("policies", JSON.stringify(policies));
    } catch (e) {
        successMessage.textContent = "Error saving updated policy to local storage.";
        successMessage.style.color = "red";
        return;
    }

    // Update current session reference
    currentPolicy = policies[policyIndex];

    // Refresh UI fields
    document.getElementById("currentPremium").value = currentPolicy.premium;
    document.getElementById("currentFromDate").value = currentPolicy.fromDate;
    document.getElementById("currentToDate").value = currentPolicy.toDate;

    // Success state resets
    successMessage.textContent = "Policy renewed successfully.";
    successMessage.style.color = "#22C55E";

    newPremium.value = "";
    newPremium.readOnly = true;

    renewBtn.disabled = true;
    renewBtn.style.opacity = "0.6";
    renewBtn.style.cursor = "not-allowed";
});

resetBtn.addEventListener("click", function () {
    policyId.value = "";
    newPremium.value = "";
    newPremium.readOnly = true;

    clearError(policyId, policyIdError);
    clearError(newPremium, premiumError);

    successMessage.textContent = "";

    renewBtn.disabled = false;
    renewBtn.style.opacity = "1";
    renewBtn.style.cursor = "pointer";

    policySection.classList.add("hidden");
    currentPolicy = null;
});

backBtn.addEventListener("click", function () {
    window.history.back();
});

policyId.addEventListener("input", function () {
    this.value = this.value.toUpperCase().replace(/[^A-Z0-9-]/g, "");

    if (this.value.length === 0) {
        clearError(policyId, policyIdError);
        return;
    }

    if (policyRegex.test(this.value)) {
        clearError(policyId, policyIdError);
    } else {
        showError(policyId, policyIdError, "Policy Number must be 10-20 alphanumeric characters.");
    }
});