document.addEventListener("DOMContentLoaded", () => {

    // Current Date
    const dateElement = document.getElementById("currentDate");

    if (dateElement) {

        const today = new Date();

        const options = {
            day: "2-digit",
            month: "long",
            year: "numeric",
            weekday: "long"
        };

        dateElement.textContent =
            today.toLocaleDateString("en-GB", options);
    }

    // Load Data
    const underwriters =
        JSON.parse(localStorage.getItem("underwriters")) || [];

    const policies =
        JSON.parse(localStorage.getItem("policies")) || [];

    // Total Underwriters
    const underwriterCount =
        document.getElementById("underwriterCount");

    if (underwriterCount) {
        underwriterCount.textContent =
            underwriters.length;
    }

    // Total Policies
    const policyCount =
        document.getElementById("policyCount");

    if (policyCount) {
        policyCount.textContent =
            policies.length;
    }

    // Active Policies
    const activePolicyCount =
        document.getElementById("activePolicies");

    if (activePolicyCount) {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activePolicies = policies.filter(policy => {

            if (!policy.toDate) {
                return false;
            }

            const parts = policy.toDate.split("-");

            if (parts.length !== 3) {
                return false;
            }

            const expiryDate = new Date(
                parts[2],     // year
                parts[1] - 1, // month
                parts[0]      // day
            );

            expiryDate.setHours(0, 0, 0, 0);

            return expiryDate >= today;

        }).length;

        activePolicyCount.textContent = activePolicies;
    }

    // Policies by Underwriter Graph
    const graph =
        document.getElementById("underwriterGraph");

    if (graph) {

        graph.innerHTML = "";

        if (policies.length === 0) {

            graph.innerHTML = `
                <div style="
                    text-align:center;
                    padding:40px 0;
                    color:#6B7280;
                ">
                    No policies created yet
                </div>
            `;

        } else {

            const underwriterStats =
                underwriters.map(underwriter => {

                    const count =
                        policies.filter(policy =>
                            policy.underwriterId ==
                            underwriter.underwriterId
                        ).length;

                    return {
                        name: underwriter.name,
                        count: count
                    };

                });

            underwriterStats.sort(
                (a, b) => b.count - a.count
            );

            const maxCount =
                Math.max(
                    ...underwriterStats.map(
                        item => item.count
                    ),
                    1
                );

            underwriterStats.forEach(item => {

                const percentage =
                    (item.count / maxCount) * 100;

                graph.innerHTML += `
                    <div class="bar-row">

                        <div class="bar-label">
                            <span>${item.name}</span>
                            <span>${item.count} Policies</span>
                        </div>

                        <div class="bar-container">
                            <div
                                class="bar-fill"
                                style="
                                    width:${percentage}%;
                                ">
                            </div>
                        </div>

                    </div>
                `;
            });
        }
    }
        // Premium Analytics

const premiumAnalytics =
document.getElementById("premiumAnalytics");

if (premiumAnalytics) {

let twoWheelerPremium = 0;
let fourWheelerPremium = 0;

policies.forEach(policy => {

    const amount =
        Number(policy.premium) || 0;

    if (policy.vehicleType === "2 Wheeler") {

        twoWheelerPremium += amount;

    }
    else if (
        policy.vehicleType === "4 Wheeler"
    ) {

        fourWheelerPremium += amount;

    }

});

const totalPremium =
    twoWheelerPremium +
    fourWheelerPremium;

const twoPercent =
    totalPremium === 0
        ? 0
        : (twoWheelerPremium / totalPremium) * 100;

premiumAnalytics.innerHTML = `

    <div
        class="premium-donut"
        style="
            --percentage:${twoPercent};
        ">
        <div class="donut-center">
            ₹${totalPremium.toLocaleString()}
        </div>
    </div>

    <div class="premium-breakdown">

        <div class="premium-item">

            <span class="legend two"></span>

            <strong>
                ₹${twoWheelerPremium.toLocaleString()}
            </strong>

            <p>2 Wheeler</p>

        </div>

        <div class="premium-item">

            <span class="legend four"></span>

            <strong>
                ₹${fourWheelerPremium.toLocaleString()}
            </strong>

            <p>4 Wheeler</p>

        </div>

    </div>

`;

}
      
    // Recent Activities
const activityList =
document.getElementById("activityList");

if (activityList) {

activityList.innerHTML = "";

if (underwriters.length === 0) {

    activityList.innerHTML = `
        <li>
            <span>No recent activities</span>
        </li>
    `;

} else {

    const recentUnderwriters =
        [...underwriters]
            .reverse()
            .slice(0, 5);

    recentUnderwriters.forEach(
        underwriter => {

            const li =
                document.createElement("li");

                li.innerHTML = `
                <span>
                    Underwriter ${underwriter.name}
                    registered
                </span>
                <small>
                    ${underwriter.registeredOn}
                </small>
            `;

            activityList.appendChild(li);
        }
    );
}
}

    // Card Hover Effect
    const cards =
        document.querySelectorAll(".card");

    cards.forEach(card => {

        card.addEventListener(
            "mouseenter",
            () => {
                card.style.transform =
                    "translateY(-5px)";
            }
        );

        card.addEventListener(
            "mouseleave",
            () => {
                card.style.transform =
                    "translateY(0)";
            }
        );
    });

    console.log("Dashboard Loaded Successfully");

});