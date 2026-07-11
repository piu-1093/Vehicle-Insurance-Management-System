document.addEventListener("DOMContentLoaded", function () {

    // Date
    document.getElementById("date").textContent =
        new Date().toLocaleDateString("en-GB");

    // Logged In User
    const loggedInUser =
        JSON.parse(localStorage.getItem("loggedInUser"));
    console.log("Logged In User:", loggedInUser);
    if (loggedInUser) {
        document.getElementById("welcomeUser").textContent =
            "Welcome " + loggedInUser.name;
    }

    const allPolicies =
        JSON.parse(localStorage.getItem("policies")) || [];
    console.log("All Policies:", allPolicies);

    const filteredPolicies = allPolicies.filter(policy => {
        console.log("Policy Underwriter:", policy.underwriterId, "Logged User:", loggedInUser.id);
        return policy.underwriterId === loggedInUser.id;

    });
    console.log("Filtered Policies:", filteredPolicies);


    let totalPolicies = filteredPolicies.length;
    let activePolicies = 0;
    let renewalsDue = 0;
    let createdToday = 0;

    let bikePolicies = 0;
    let carPolicies = 0;

    let fullInsurance = 0;
    let thirdParty = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    filteredPolicies.forEach(function (policy) {

        // Vehicle Type
        if (policy.vehicleType === "2 Wheeler") {
            bikePolicies++;
        }

        if (policy.vehicleType === "4 Wheeler") {
            carPolicies++;
        }

        // Insurance Type
        if (policy.insuranceType === "Full Insurance") {
            fullInsurance++;
        }

        if (
            policy.insuranceType === "Third Party" ||
            policy.insuranceType === "3rd Party Insurance"
        ) {
            thirdParty++;
        }

        // Created Today
        if (policy.createdOn) {

            let created =
                new Date(policy.createdOn);

            created.setHours(0, 0, 0, 0);

            if (created.getTime() === today.getTime()) {
                createdToday++;
            }

        }

        // Active & Renewal Due

        if (policy.toDate) {

            let expiry;

            if (policy.toDate.includes("-")) {

                let p =
                    policy.toDate.split("-");

                if (p[0].length === 4) {

                    expiry =
                        new Date(policy.toDate);

                } else {

                    expiry =
                        new Date(
                            p[2],
                            p[1] - 1,
                            p[0]
                        );

                }

                expiry.setHours(0, 0, 0, 0);

                if (expiry >= today) {
                    activePolicies++;
                }

                let days =
                    (expiry - today) / (1000 * 60 * 60 * 24);

                if (days >= 0 && days <= 30) {
                    renewalsDue++;
                }

            }

        }

    });

    // ==========================
    // Top Cards
    // ==========================

    document.getElementById("totalPolicies").textContent =
        totalPolicies;

    document.getElementById("activePolicies").textContent =
        activePolicies;

    document.getElementById("renewalsDue").textContent =
        renewalsDue;

    document.getElementById("policiesToday").textContent =
        createdToday;

    // ==========================
    // Summary Cards
    // ==========================

    document.getElementById("bikePolicies").textContent =
        bikePolicies;

    document.getElementById("carPolicies").textContent =
        carPolicies;

    

    document.getElementById("bikeCount").textContent =
        bikePolicies;

    document.getElementById("carCount").textContent =
        carPolicies;

    document.getElementById("distributionTotal").textContent =
        totalPolicies;

    

    

    document.getElementById("fullCount").textContent =
        fullInsurance;

    document.getElementById("thirdCount").textContent =
        thirdParty;

    document.getElementById("insuranceTotal").textContent =
        totalPolicies;

   


    const activity =
        document.getElementById("recentActivities");

    activity.innerHTML = "";

    if (filteredPolicies.length === 0) {

        activity.innerHTML =
            "<li class='empty'>No Policies Available</li>";

    } else {

        filteredPolicies
            .slice()
            .reverse()
            .slice(0, 5)
            .forEach(function (policy) {

                activity.innerHTML +=
                    `<li>
                    <i class="fa-solid fa-square-check" style="color:#22C55E"></i>
                    Policy ${policy.policyNo}
                    created for
                    ${policy.customerName}
                </li>`;

            });

    }
    new Chart(
    document.getElementById("vehicleChart"),
    {
        type: "bar",
        data: {
            labels: [
                "2 Wheeler",
                "4 Wheeler"
            ],
            datasets: [{
                label: "Policies",
                data: [
                    bikePolicies,
                    carPolicies
                ],
                backgroundColor: [
                    "#3B82F6",
                    "#10B981"
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    }
);
new Chart(
    document.getElementById("insuranceChart"),
    {
        type: "pie",
        data: {
            labels: [
                "Full Insurance",
                "Third Party"
            ],
            datasets: [{
                data: [
                    fullInsurance,
                    thirdParty
                ],
                backgroundColor: [
                    "#2563EB",
                    "#F59E0B"
                ]
            }]
        },
        options: {
            responsive: true
        }
    }
);

});
