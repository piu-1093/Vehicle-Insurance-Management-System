function displayUpdateStatus(policy) {
    const statusContainer = document.getElementById("updateStatusDetails");
    if (!statusContainer) return;

    if (policy && policy.isUpdated) {
        statusContainer.innerHTML = `
            <div class="update-log">
                <p><strong>Status:</strong> Policy Updated</p>
                <p><strong>New Type:</strong> ${policy.insuranceType}</p>
                <p><strong>Premium:</strong> ${policy.premium}</p>
                <p class="update-time"><small>Updated on: ${policy.updatedAt || 'N/A'}</small></p>
            </div>
        `;
    } else {
        statusContainer.innerHTML = `<p style="color: var(--text-light); font-style: italic;">No Updates</p>`;
    }
}

let currentPolicy = null;

document.getElementById("searchBtn").addEventListener("click", () => {

    const enteredId =
        document.getElementById("policyId")
            .value
            .trim();

    const policies =
        JSON.parse(localStorage.getItem("policies")) || [];

    const policy =
        policies.find(
            p => p.policyNo === enteredId
        );

    if (!policy) {

        const status =
            document.getElementById("statusMessage");

        status.textContent = "Policy Not Found";
        status.style.color = "red";

        return;
    }

    currentPolicy = policy;

    document.getElementById("displayPolicyId").value =
        policy.policyNo;
    const status =
        document.getElementById("statusMessage");

        if (policy.insuranceType === "3rd Party Insurance") {

            status.textContent =
                "There's no provision to update the policy type from Third Party Insurance to Full Insurance.";
        
            status.style.color = "red";
        
            document.getElementById("updateBtn").disabled = true;
        
            document
                .querySelectorAll('input[name="newPolicy"]')
                .forEach(radio => {
                    radio.disabled = true;
                    radio.checked = false;
                });
        
        } else {
        
            status.textContent =
                "Full Insurance can be changed to Third Party Insurance.";
        
            status.style.color = "green";
        
            document.getElementById("updateBtn").disabled = false;
        
            document
                .querySelectorAll('input[name="newPolicy"]')
                .forEach(radio => {
                    radio.disabled = false;
                });
        }

    document.getElementById("vehicleNumber").value =
        policy.vehicleNo;

    document.getElementById("customerName").value =
        policy.customerName;

    document.getElementById("vehicleType").value =
        policy.vehicleType;

    document.getElementById("policyType").value =
        policy.insuranceType;

    document.getElementById("premium").value =
        policy.premium;

    document.getElementById("validity").value =
        `${policy.fromDate} To ${policy.toDate}`;

    displayUpdateStatus(policy);

});



/* UPDATE BUTTON */

document.getElementById("updateBtn").addEventListener("click", () => {

    if (!currentPolicy) {

        const status =
            document.getElementById("statusMessage");

        status.textContent =
            "Please search a policy first.";

        status.style.color = "red";

        return;
    }

    if (currentPolicy.insuranceType !== "Full Insurance") {

        const status =
            document.getElementById("statusMessage");

        status.textContent =
            "There's no provision to update Third Party Insurance.";

        status.style.color = "red";

        return;
    }


    const policies =
        JSON.parse(localStorage.getItem("policies")) || [];

    const policyIndex =
        policies.findIndex(
            p => p.policyNo === currentPolicy.policyNo
        );

    if (policyIndex === -1) {

        const status =
            document.getElementById("statusMessage");

        status.textContent = "Policy not found.";
        status.style.color = "red";

        return;
    }

    policies[policyIndex].insuranceType =
        "3rd Party Insurance";

    policies[policyIndex].premium =
        "2500";

    policies[policyIndex].isUpdated = true;
    policies[policyIndex].updatedAt = new Date().toLocaleString();

    // Save Back To Local Storage
    localStorage.setItem(
        "policies",
        JSON.stringify(policies)
    );

    currentPolicy =
        policies[policyIndex];

    document.getElementById("policyType").value =
        currentPolicy.insuranceType;

    document.getElementById("premium").value =
        currentPolicy.premium;

    const status =
        document.getElementById("statusMessage");

    status.textContent =
        "Policy Updated Successfully";

    status.style.color = "green";

    displayUpdateStatus(currentPolicy);

});


document.getElementById("resetBtn").addEventListener("click", () => {

    document.getElementById("policyId").value = "";
    document.getElementById("displayPolicyId").value = "";
    document.getElementById("vehicleNumber").value = "";
    document.getElementById("customerName").value = "";
    document.getElementById("vehicleType").value = "";
    document.getElementById("policyType").value = "";
    document.getElementById("premium").value = "";
    document.getElementById("validity").value = "";

    document
        .querySelectorAll('input[name="newPolicy"]')
        .forEach(radio => {
            radio.checked = false;
            radio.disabled = false;
        });

    document.getElementById("updateBtn").disabled = false;

    currentPolicy = null;

    document.getElementById("statusMessage").textContent =
        "Ready to Update";

    document.getElementById("statusMessage").style.color =
        "black";

    displayUpdateStatus(null);

});




document.getElementById("backBtn").addEventListener("click", () => {


    history.back();


});

