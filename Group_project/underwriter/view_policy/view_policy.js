document.addEventListener("DOMContentLoaded", function () {


    const policyBody = document.getElementById("policyBody");


    const policies =
        JSON.parse(localStorage.getItem("policies")) || [];


    const loggedInUnderwriter =
        JSON.parse(localStorage.getItem("loggedInUnderwriter"));


    const loggedInUnderwriterId =
        loggedInUnderwriter?.underwriterId;


    const underwriterPolicies = policies.filter(function (policy) {


        return String(policy.underwriterId) ===
               String(loggedInUnderwriterId);


    });


    if (underwriterPolicies.length === 0) {


        policyBody.innerHTML = `
            <tr>
                <td colspan="12">
                    No Policies Available For This Underwriter
                </td>
            </tr>
        `;


        return;
    }


    const today = new Date();
    today.setHours(0, 0, 0, 0);


    underwriterPolicies.forEach(function (policy) {


        let status = "Expired";


        if (policy.toDate) {


            const parts = policy.toDate.split("-");


            const expiryDate = new Date(
                parts[2],
                parts[1] - 1,
                parts[0]
            );


            expiryDate.setHours(0, 0, 0, 0);


            if (expiryDate >= today) {
                status = "Active";
            }
        }


        const row = `
            <tr>
                <td>${policy.policyNo || ""}</td>
                <td>${policy.vehicleNo || ""}</td>
                <td>${policy.vehicleType || ""}</td>
                <td>${policy.customerName || ""}</td>
                <td>${policy.engineNo || ""}</td>
                <td>${policy.chassisNo || ""}</td>
                <td>${policy.phoneNo || ""}</td>
                <td>${policy.insuranceType || ""}</td>
                <td>₹${policy.premium || ""}</td>
                <td>${policy.fromDate || ""}</td>
                <td>${policy.toDate || ""}</td>
                <td>
                    <span class="${status === "Active"
                        ? "status status-active"
                        : "status status-expired"}">
                        ${status}
                    </span>
                </td>
            </tr>
        `;


        policyBody.innerHTML += row;
    });


});

