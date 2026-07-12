# 🚗 Vehicle Insurance Management System (VIMS)
### A Complete Workflow & Testing Guide

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [How Data Storage Works](#4-how-data-storage-works)
5. [User Roles Explained](#5-user-roles-explained)
6. [Component Deep Dive](#6-component-deep-dive)
7. [Data Models (What Gets Stored)](#7-data-models-what-gets-stored)
8. [Business Rules & Constraints](#8-business-rules--constraints)
9. [Step-by-Step Testing Guide](#9-step-by-step-testing-guide)
10. [Complete User Journey Walkthrough](#10-complete-user-journey-walkthrough)
11. [Common Issues & Troubleshooting](#11-common-issues--troubleshooting)

---

## 1. Project Overview

**Drive Secure - Vehicle Insurance Management System** is a fully client-side web application that allows insurance companies to manage vehicle policies through two distinct roles:

- 👨‍💼 **Administrator** — Manages the team of underwriters (create, search, update, delete)
- 🧑‍💻 **Underwriter** — Manages customer vehicle insurance policies (create, view, update, renew)

> **Key Feature**: The entire application runs in the browser — there is no backend server. All data is stored using the browser built-in **LocalStorage** (a mini database that persists even after you close the tab).

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 (Semantic markup) |
| Styling | Vanilla CSS3 (Custom variables, Flexbox, Grid) |
| Logic | JavaScript ES6+ (Vanilla, no frameworks) |
| Database | Browser LocalStorage (JSON format) |
| Layout Pattern | Fixed sidebar + iframe-injected components |
| Fonts | Google Fonts (Poppins, Segoe UI) |
| Icons | Inline SVG icons |

---

## 3. Project Structure

```
Group_project/
├── index.html                          Entry point (Landing / Login page)
├── assests/images/                     Logo and other image assets
├── components/                         Shared, reusable UI components
│   ├── login/
│   │   ├── login.html                  Login form page (Role switcher, form, alerts)
│   │   ├── login.css
│   │   └── login.js                    Authentication logic
│   ├── navbar/
│   │   └── navbar.html                 Top navigation bar (user info, logout)
│   ├── sidebar/
│   │   └── sidebar.html                Admin navigation sidebar
│   ├── sidebar_underwriter/
│   │   └── sidebar_underwriter.html    Underwriter navigation sidebar
│   └── forgot_password/
│       └── forgot_password.html        Password recovery page
├── admin/                              All Administrator pages
│   ├── admin_dashboard/                Admin home page
│   ├── register_underwriter/           Add new underwriters to the system
│   ├── search_underwriter/             Find underwriter by ID
│   ├── view_underwriter/               View full list of underwriters
│   ├── delete_underwriter/             Remove underwriters from system
│   └── update_password/                Reset underwriter passwords
└── underwriter/                        All Underwriter pages
    ├── underwriter_dashboard/          Underwriter home page (stats + charts)
    ├── create_vehicle_insurance/       Create new policy
    ├── update_policy/                  Change policy type (Full to Third Party)
    ├── renew_policy/                   Extend policy by 1 year
    ├── view_policy/                    View all policies in a table
    └── view_vehicles/                  Search vehicle records by underwriter
```

---

## 4. How Data Storage Works

Since there is no backend server, the app uses **LocalStorage** — a built-in browser key-value store that stores data as JSON strings.

### LocalStorage Keys Used

```
localStorage
  "underwriters"         Array of all registered underwriter accounts
  "policies"             Array of all vehicle insurance policies
  "isLoggedIn"           "true" or not set (session flag)
  "loggedInRole"         "Administrator" or "Underwriter"
  "loggedInUser"         Object with id, name, role, status
  "loggedInUnderwriter"  Full underwriter profile object
```

### How to View the Data in Your Browser

1. Open the app in Chrome/Edge
2. Press **F12** to open Developer Tools
3. Click the **Application** tab
4. In the left sidebar, expand **Storage → Local Storage → your localhost URL**
5. You will see all keys and their values

> **Note**: Clearing browser data or using Incognito mode will reset all stored data.

---

## 5. User Roles Explained

```
ADMINISTRATOR                          UNDERWRITER
username: admin                        username: UW1001 (example)
password: admin123                     password: set by admin

Can Do:                                Can Do:
  Register underwriters                  Create vehicle policies
  Search underwriters                    View policies they created
  View underwriter list                  Update policy types
  Delete underwriters                    Renew expiring policies
  Reset passwords                        View vehicle records

Cannot:                                Cannot:
  Manage policies                        Manage other underwriters
```

---

## 6. Component Deep Dive

### 6.1 Login System

**Files**: `components/login/login.html`, `components/login/login.js`

The login page is the gateway to the entire system.

#### Step 1 — Role Selection:
User clicks either "Administrator" or "Underwriter". The selected button gets highlighted and the Forgot Password link is only enabled for Underwriters.

#### Step 2 — Form Submission:
- Checks that a role has been selected
- Checks that username and password fields are not empty
- Calls the authentication function

#### Step 3 — Authentication Logic:

```javascript
// File: components/login/login.js

// Administrator: Static hardcoded credentials
if (role === "Administrator") {
    if (username === "admin" && password === "admin123") {
        handleLoginSuccess("admin_dashboard.html", "Administrator");
    } else {
        handleLoginFailure("Invalid Administrator credentials.");
    }
}

// Underwriter: Dynamic lookup in LocalStorage
if (role === "Underwriter") {
    const underwriters = JSON.parse(localStorage.getItem("underwriters")) || [];
    const underwriter = underwriters.find(
        u => u.underwriterId === username && u.password === password
    );
    if (underwriter) {
        localStorage.setItem("loggedInUnderwriter", JSON.stringify(underwriter));
        handleLoginSuccess("underwriter_dashboard.html", "Underwriter");
    } else {
        handleLoginFailure("Invalid Underwriter ID or Password.");
    }
}
```

#### Step 4 — Session Setup on Success:

```javascript
// Sets session flags and redirects after 1.5 seconds
localStorage.setItem("isLoggedIn", "true");
localStorage.setItem("loggedInRole", roleName);
localStorage.setItem("loggedInUser", JSON.stringify({
    id: underwriter.underwriterId,
    name: underwriter.name,
    role: roleName,
    status: underwriter.status
}));
setTimeout(() => { window.location.href = redirectUrl; }, 1500);
```

---

### 6.2 Administrator Module

**Files**: `admin/` directory

#### Register Underwriter — `admin/register_underwriter/`

Allows admin to create new underwriter accounts.

| Field | Validation Rule |
|---|---|
| Underwriter ID | Must match `UW` + 4 digits (e.g., `UW1001`). Must be unique. |
| Name | Alphabets and spaces only |
| Date of Birth | Cannot be in the future |
| Joining Date | Valid calendar date |
| Password | Minimum security requirements |

On success, a new underwriter object is pushed into the `localStorage["underwriters"]` array with `status: "Active"`.

#### Search Underwriter — `admin/search_underwriter/`
- Enter Underwriter ID → retrieves full profile card from storage
- Shows: Name, ID, DOB, Joining Date, Status, Registration Date

#### Delete Underwriter — `admin/delete_underwriter/`
Two-step safety process:
1. **Search first** — must verify the underwriter exists
2. **Confirm deletion** — a confirmation modal appears before removing
3. Record is spliced from the array and storage is updated

#### Update Password — `admin/update_password/`
- Admin searches for underwriter by ID
- Password reset form appears on finding the record
- New password and confirm password must match
- Updated record is saved back to storage

---

### 6.3 Underwriter Dashboard

**Files**: `underwriter/underwriter_dashboard/`

The first page an underwriter sees after logging in. Shows live statistics.

**Displays**:
- Today's date and welcome message with name
- Summary cards: Total Policies, Active Policies, Created Today, Renewals Due
- Pie Chart: Policy type distribution (Full vs Third Party)
- Bar Chart: Vehicle type distribution (2 Wheeler vs 4 Wheeler)
- Recent Policies: Last 5 policies created

**Key filtering code** — only shows current underwriter's policies:
```javascript
// File: underwriter/underwriter_dashboard/underwriter_dashboard.js
const filteredPolicies = allPolicies.filter(policy => {
    return policy.underwriterId === loggedInUser.id;
});
```

---

### 6.4 Create Vehicle Insurance

**Files**: `underwriter/create_vehicle_insurance/create_vehicle_insurance.html`, `.js`

The most complex form in the system. Creates a new insurance policy.

#### Form Fields

| Field | Type | Validation |
|---|---|---|
| Policy No | Text | 10–20 alphanumeric characters |
| Vehicle No | Text | 2 letters + 2 digits + 1-2 letters + 4 digits (e.g., `KL07AB1234`) |
| Vehicle Type | Dropdown | `2 Wheeler` or `4 Wheeler` |
| Customer Name | Text | Letters and spaces only, 3–50 characters |
| Engine No | Text | 8–17 alphanumeric characters |
| Chassis No | Text | Exactly 17 valid VIN characters (no I, O, Q) |
| Phone No | Number | 10 digits, starting with 6–9 |
| Insurance Type | Dropdown | `Full Insurance` or `Third Party` |
| Premium Amount | Text | Auto-generated (read-only) |
| From Date | Date Picker | Today or any future date |
| To Date | Text | Auto-calculated as 1 year from From Date (read-only) |
| Underwriter ID | Text | Auto-filled from logged-in session (read-only) |

#### Premium Calculation Matrix

```
Vehicle Type    Insurance Type      Premium Amount
2 Wheeler       Third Party         Rs. 2,500
2 Wheeler       Full Insurance      Rs. 4,500
4 Wheeler       Third Party         Rs. 6,000
4 Wheeler       Full Insurance      Rs. 10,000
```

#### Date Auto-Calculation Logic

```javascript
// File: underwriter/create_vehicle_insurance/create_vehicle_insurance.js
fromDate.addEventListener("change", function() {
    let date = new Date(fromDate.value);
    date.setDate(date.getDate() + 365);  // Add exactly 365 days

    let day = String(date.getDate()).padStart(2, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let year = date.getFullYear();

    toDate.value = `${day}-${month}-${year}`;  // Read-only DD-MM-YYYY display
});
```

---

### 6.5 Update Policy Type

**Files**: `underwriter/update_policy/update_policy.html`, `.js`, `.css`

Changes a policy's insurance type. **Business Rule**: Can only downgrade (Full → Third Party), never upgrade.

#### Workflow:
1. Enter Policy ID → Click Search
2. Policy details load and the Update Status card shows history
3. Select the new type
4. Click Update

#### Update Rule Enforcement:

```javascript
// File: underwriter/update_policy/update_policy.js
// Blocks upgrade — Third Party cannot become Full Insurance
if (currentPolicy.insuranceType === "3rd Party Insurance") {
    document.getElementById("updateBtn").disabled = true;
}
```

#### What Gets Saved:
```javascript
policies[policyIndex].insuranceType = "3rd Party Insurance";
policies[policyIndex].premium = "2500";          // Drops to Rs. 2,500
policies[policyIndex].isUpdated = true;          // Tracking flag
policies[policyIndex].updatedAt = new Date().toLocaleString();  // Timestamp
localStorage.setItem("policies", JSON.stringify(policies));
```

#### Dynamic Update Status Card:
When a policy is searched, the card shows "No Updates" or full update history with timestamp based on the `isUpdated` flag.

---

### 6.6 Renew Policy

**Files**: `underwriter/renew_policy/renew_policy.js`

Extends an existing policy by 365 days.

#### What Renewal Does:
```javascript
// File: underwriter/renew_policy/renew_policy.js
const today = new Date();
const renewalDate = new Date(today);
renewalDate.setDate(renewalDate.getDate() + 365);

policy.premium = premiumValue;
policy.fromDate = formatDate(today);       // New start = today
policy.toDate = formatDate(renewalDate);   // New end = today + 365 days
policy.lastRenewedOn = formatDate(today);  // Tracks renewal history

localStorage.setItem("policies", JSON.stringify(policies));
```

---

### 6.7 View Policies

**Files**: `underwriter/view_policy/view_policy.html`, `.js`, `.css`

Displays all policies by the current underwriter in a table with Active/Expired badges.

#### Status Calculation Logic:
```javascript
// File: underwriter/view_policy/view_policy.js
// Parses DD-MM-YYYY string and compares to today
const parts = policy.toDate.split("-");
const expiryDate = new Date(parts[2], parts[1] - 1, parts[0]);

if (expiryDate >= today) {
    status = "Active";   // Green badge
} else {
    status = "Expired";  // Red badge
}
```

---

### 6.8 Shared Components (Sidebar and Navbar)

Loaded as iframes into every page so code is not duplicated.

#### Layout Formula:
```css
/* Fixed sidebar on left */
.sidebar-frame { width: 330px; position: fixed; left: 0; top: 0; height: 100vh; }

/* Navbar fills rest of top bar */
.navbar-frame { left: 330px; width: calc(100% - 330px); position: fixed; top: 0; }

/* Main content clears both */
.content-wrapper { margin-left: 330px; width: calc(100% - 330px); margin-top: 70px; }
```

---

## 7. Data Models (What Gets Stored)

### `localStorage["underwriters"]`
```json
[
  {
    "underwriterId": "UW1001",
    "name": "John Doe",
    "dob": "1990-01-15",
    "joiningDate": "12 Jul 2026",
    "registeredOn": "12 Jul 2026, 11:30",
    "password": "SecurePass123",
    "status": "Active"
  }
]
```

### `localStorage["policies"]`
```json
[
  {
    "policyNo": "POL-2026-001",
    "vehicleNo": "KL07AB1234",
    "vehicleType": "4 Wheeler",
    "customerName": "Rajesh Kumar",
    "engineNo": "ENG12345678",
    "chassisNo": "12345678901234567",
    "phoneNo": "9876543210",
    "insuranceType": "Full Insurance",
    "premium": "10000",
    "fromDate": "12-07-2026",
    "toDate": "12-07-2027",
    "underwriterId": "UW1001",
    "createdOn": "2026-07-12T06:00:00.000Z",
    "isUpdated": true,
    "updatedAt": "7/12/2026, 11:30:00 AM"
  }
]
```

---

## 8. Business Rules & Constraints

| Rule | Where It Applies | Detail |
|---|---|---|
| Policy Downgrade Only | Update Policy | Can only change Full Insurance to 3rd Party Insurance. Reverse is blocked. |
| Premium Auto-Reset on Update | Update Policy | When downgraded, premium automatically becomes Rs. 2,500 |
| To Date = From Date + 365 days | Create Policy | The To Date field is always read-only and auto-computed |
| From Date must be today or later | Create Policy | Past dates are blocked by the calendar minimum date constraint |
| Unique Policy No | Create Policy | Duplicate policy numbers are rejected |
| Unique Underwriter ID | Register Underwriter | Format: UW + exactly 4 digits (e.g., UW1001) |
| Chassis No VIN Format | Create Policy | Exactly 17 characters, no I, O, Q |
| Vehicle No Format | Create Policy | 2 letters + 2 digits + 1-2 letters + 4 digits |
| Data Isolation | View Policy | Underwriters only see policies they created |
| Admin Credentials | Login | Hardcoded as admin / admin123 |
| Renewal Resets Dates | Renew Policy | New From Date = today, New To Date = today + 365 days |

---

## 9. Step-by-Step Testing Guide

### Prerequisites
- A modern browser (Chrome, Firefox, or Edge recommended)
- Open `Group_project/index.html` in your browser (or through a local server)

---

### Test 1: Administrator Login and Underwriter Registration

**Goal**: Log in as admin and create an underwriter account

1. Open the app — you will see the Login page
2. Click the **"Administrator"** role button
3. Enter Username: `admin` and Password: `admin123`
4. Click **Sign In**
5. Expected: Redirected to the **Admin Dashboard**
6. Click **"Register Underwriter"** from the sidebar
7. Fill in:
   - Underwriter ID: `UW1001`
   - Name: `Test User`
   - Date of Birth: Any past date (e.g., `1995-06-15`)
   - Joining Date: Today
   - Password: `Test@1234`
8. Click **Register**
9. Expected: A success modal appears

---

### Test 2: Underwriter Login

**Goal**: Log in as the underwriter you just created

1. Go back to the Login page
2. Click the **"Underwriter"** role button
3. Enter Username: `UW1001` and Password: `Test@1234`
4. Click **Sign In**
5. Expected: Underwriter Dashboard with "Welcome Test User" message

---

### Test 3: Create a Vehicle Insurance Policy

**Goal**: Create a new policy and verify it saves correctly

1. From sidebar, click **"Create Vehicle Insurance"**
2. Fill in:
   - Policy No: `POL-2026-001`
   - Vehicle No: `KL07AB1234`
   - Vehicle Type: `4 Wheeler`
   - Customer Name: `Rajesh Kumar`
   - Engine No: `ENG12345678`
   - Chassis No: `1HGCM82633A123456`
   - Phone No: `9876543210`
   - Insurance Type: `Full Insurance`
   - Premium: Should auto-fill with `10000`
   - From Date: Pick today or a future date from the calendar
   - To Date: Should auto-fill with date exactly 1 year later (read-only)
3. Click **Create Policy**
4. Expected: Success message, redirected to View Policies

---

### Test 4: View Policies

**Goal**: Verify the policy was saved

1. Click **"View Policies"** in the sidebar
2. Expected: See the policy in the table
3. Check that Status shows `Active` (green badge)

---

### Test 5: Update a Policy Type

**Goal**: Downgrade the policy from Full Insurance to 3rd Party

1. Click **"Update Policy"** in the sidebar
2. Enter Policy ID: `POL-2026-001` and click **Search**
3. Verify current details load and Update Status shows "No Updates"
4. Select `3rd Party Insurance`
5. Click **Update**
6. Expected: Policy type changes and Update Status card shows a timestamp log

**Test the restriction:**
- Search the same policy again — you should see it cannot be upgraded back
- The Update button should be disabled

---

### Test 6: Renew a Policy

**Goal**: Extend the policy validity by 365 days

1. Click **"Renew Policy"** in the sidebar
2. Enter Policy ID: `POL-2026-001` and click **Search**
3. Click **Renew**
4. Expected: From Date updates to today, To Date updates to today + 365 days

---

### Test 7: Test Validation Errors

**Goal**: Verify that bad input is rejected

On Create Policy form:
- Enter `KL7A1234` as Vehicle No → should show format error
- Enter `ABC` as Chassis No → should show length error
- Enter `1234567890` as Phone No → should show error (does not start with 6-9)
- Leave Vehicle Type unselected → should show "Please select" error

On Update Policy:
- Enter a non-existent policy ID → should show "Policy Not Found"
- Search a Third Party policy → Update button should be disabled

---

### Test 8: Admin Password Reset

**Goal**: Reset an underwriter password

1. Log in as admin
2. Click **"Update Password"** from sidebar
3. Search for underwriter ID `UW1001`
4. Enter a new password and confirm it
5. Click **Update Password**
6. Expected: Password updated
7. Try logging in with the new password — should work

---

### Test 9: Delete an Underwriter

**Goal**: Remove an underwriter from the system

1. Log in as admin
2. Click **"Delete Underwriter"** from sidebar
3. Enter `UW1001` and click **Search**
4. Click **Delete** and confirm in the modal
5. Expected: Underwriter removed from storage
6. Try logging in as `UW1001` — should fail with "Invalid credentials"

---

## 10. Complete User Journey Walkthrough

```
Open App in Browser
      |
      v
  Login Page
  Select Role --> Enter Credentials --> Sign In
      |                                    |
      |                          [If Wrong: Show Error]
      |                          [If Right: Set Session in LocalStorage]
      |
      +--- Administrator ---> Admin Dashboard
      |                          |
      |              +-----------+-----------+-----------+
      |              |           |           |           |
      |         Register      Search      Delete     Update
      |         Underwriter   Underwriter Underwriter Password
      |              |           |           |           |
      |         Save to       Find from   Remove from Update in
      |         localStorage  localStorage localStorage localStorage
      |
      +--- Underwriter ---> Underwriter Dashboard
                                 |
                   +-------------+-----------+-----------+
                   |             |           |           |
              Create Policy  Update Policy  Renew Policy  View Policies
                   |             |           |           |
              Fill Form      Search by ID  Search by ID  Show table
              Auto-premium   Downgrade     Extend 365    Filter by
              Auto-ToDate    only (rule)   days          current user
                   |             |           |           |
              Save new       Save updated  Save new      Read from
              policy object  fields +      dates +       localStorage
              to storage     timestamp     timestamp     + check status
```

---

## 11. Common Issues & Troubleshooting

| Problem | Cause | Solution |
|---|---|---|
| Login fails for underwriter | Underwriter not registered yet | Log in as admin first and register the underwriter |
| No data in View Policies | Logged in as different underwriter | The system filters policies per user — check the logged-in ID |
| Cannot select past dates | By design — min date is today | Select today or a future date |
| To Date does not change | JavaScript may not have loaded | Refresh the page and ensure correct file paths |
| Update button is disabled | Policy is already 3rd Party Insurance | This is by design — downgrade-only business rule |
| Data lost after browser clear | LocalStorage was cleared | Re-register underwriters and re-create policies |
| Premium field stays empty | Vehicle type or insurance type not selected | Both dropdowns must be selected for auto-calculation |
| Policy No already exists error | Duplicate entry attempted | Use a unique Policy Number for each policy |

---

> **Quick Reset Tip**: To wipe all stored data and start fresh, open the browser console (F12) and run:
> ```javascript
> localStorage.clear();
> location.reload();
> ```
