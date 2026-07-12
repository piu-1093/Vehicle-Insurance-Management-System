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

    // Add a row for "No matching results found"
    const noResultsRowHtml = `
        <tr id="noResultsRow" style="display: none;">
            <td colspan="12" style="text-align: center; color: var(--danger); font-weight: 600; padding: 20px;">
                No matching policies found matching your search/filter criteria.
            </td>
        </tr>
    `;
    policyBody.innerHTML += noResultsRowHtml;

    const searchInput = document.getElementById("policySearchInput");
    const vehicleTypeFilter = document.getElementById("vehicleTypeFilter");
    const insuranceTypeFilter = document.getElementById("insuranceTypeFilter");

    function applyFilters() {
        const query = searchInput.value.trim().toLowerCase();
        const selectedVehicleType = vehicleTypeFilter.value;
        const selectedInsuranceType = insuranceTypeFilter.value.toLowerCase();

        const rows = document.querySelectorAll("#policyBody tr:not(#noResultsRow)");
        let visibleCount = 0;

        rows.forEach(row => {
            if (row.cells.length > 1) {
                const policyNo = row.cells[0].textContent.toLowerCase();
                const vehicleType = row.cells[2].textContent;
                const insuranceType = row.cells[7].textContent.toLowerCase();

                const matchesSearch = policyNo.includes(query);
                const matchesVehicle = selectedVehicleType === "" || vehicleType === selectedVehicleType;
                
                let matchesInsurance = false;
                if (selectedInsuranceType === "") {
                    matchesInsurance = true;
                } else if (selectedInsuranceType === "third party") {
                    matchesInsurance = insuranceType.includes("third") || insuranceType.includes("3rd");
                } else {
                    matchesInsurance = insuranceType.includes(selectedInsuranceType);
                }

                if (matchesSearch && matchesVehicle && matchesInsurance) {
                    row.style.display = "";
                    visibleCount++;
                } else {
                    row.style.display = "none";
                }
            }
        });

        const noResultsRow = document.getElementById("noResultsRow");
        if (noResultsRow) {
            if (visibleCount === 0) {
                noResultsRow.style.display = "";
            } else {
                noResultsRow.style.display = "none";
            }
        }
    }

    searchInput.addEventListener("keyup", applyFilters);
    vehicleTypeFilter.addEventListener("change", applyFilters);
    insuranceTypeFilter.addEventListener("change", applyFilters);

});

