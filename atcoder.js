// Default user list
const defaultUsers = [
    "surya_sujith09", "Chandrika0205", "jalaluddin420", "harshith2507",
    "Tanushreddyy", "Karthik0206", "koushikweb", "suhas3157", 
    "joelchopra", "sonu24", "hemanthraojamena", "manichandana", 
    "lrv", "sdr", "shiva_karthik121", "advaithchaitanya", 
    "manchalaganesh", "ponugotikruthik", "ManojVakiti", "KiranKumarChenna"
];

// Track selected users
let selectedUsers = [];
// Track if all users are selected
let allSelected = false;
// Store the fetched data
let fetchedData = [];
// Store the category filters
let categoryFilters = {
    "A": true,
    "B": true,
    "C": true,
    "D": true,
    "E": true,
    "F": true,
    "G": true,
    "H/Ex": true
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Generate user profiles
    generateUserProfiles();
    
    // Add search functionality
    document.getElementById('profile-search').addEventListener('input', filterProfiles);
    
    // Add Select All functionality
    document.getElementById('select-all-btn').addEventListener('click', toggleSelectAll);
    
    // Add theme switch functionality
    const themeSwitch = document.getElementById('checkbox');
    const themeLabel = document.getElementById('theme-label');
    
    // Check if user has previously selected a theme
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update checkbox state based on saved preference
    if (currentTheme === 'dark') {
        themeSwitch.checked = true;
        themeLabel.textContent = 'Dark Mode';
    }
    
    // Listen for theme toggle
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeLabel.textContent = 'Dark Mode';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeLabel.textContent = 'Light Mode';
        }
    });

    // Set up category filter listeners
    setupCategoryFilterListeners();
});

// Set up category filter functionality
// function setupCategoryFilterListeners() {
//     // All checkbox functionality
//     const allCheckbox = document.getElementById('filter-all');
//     allCheckbox.addEventListener('change', function() {
//         const checked = this.checked;
//         document.querySelectorAll('.filter-checkbox input:not(#filter-all)').forEach(checkbox => {
//             checkbox.checked = checked;
//             const category = checkbox.id.replace('filter-', '');
//             categoryFilters[category] = checked;
//         });
//     });

//     // Individual category checkboxes
//     document.querySelectorAll('.filter-checkbox input:not(#filter-all)').forEach(checkbox => {
//     checkbox.addEventListener('change', function() {
//         // Get category from checkbox id
//         let category = this.id.replace('filter-', '');
        
//         // Special case for H/Ex since IDs can't contain slashes
//         if (category === 'H') {
//             category = 'H/Ex';
//         }
        
//         categoryFilters[category] = this.checked;
        
//         // Update "All" checkbox based on individual selections
//         const allChecked = Array.from(document.querySelectorAll('.filter-checkbox input:not(#filter-all)')).every(cb => cb.checked);
//         allCheckbox.checked = allChecked;
//     });
// });
//     // document.querySelectorAll('.filter-checkbox input:not(#filter-all)').forEach(checkbox => {
//     //     checkbox.addEventListener('change', function() {
//     //         const category = this.id.replace('filter-', '');
//     //         categoryFilters[category] = this.checked;
            
//     //         // Update "All" checkbox based on individual selections
//     //         const allChecked = Array.from(document.querySelectorAll('.filter-checkbox input:not(#filter-all)')).every(cb => cb.checked);
//     //         allCheckbox.checked = allChecked;
//     //     });
//     // });

//     // Apply filter button
//     document.getElementById('apply-filter').addEventListener('click', function() {
//         renderTable(fetchedData);
//     });
// }

function setupCategoryFilterListeners() {
    // All checkbox functionality
    const allCheckbox = document.getElementById('filter-all');
    allCheckbox.addEventListener('change', function() {
        const checked = this.checked;
        document.querySelectorAll('.filter-checkbox input:not(#filter-all)').forEach(checkbox => {
            checkbox.checked = checked;
            let category = checkbox.id.replace('filter-', '');
            
            // Special case for H/Ex since IDs can't contain slashes
            if (category === 'H') {
                category = 'H/Ex';
            }
            
            categoryFilters[category] = checked;
        });
    });

    // Individual category checkboxes
    document.querySelectorAll('.filter-checkbox input:not(#filter-all)').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Get category from checkbox id
            let category = this.id.replace('filter-', '');
            
            // Special case for H/Ex since IDs can't contain slashes
            if (category === 'H') {
                category = 'H/Ex';
            }
            
            categoryFilters[category] = this.checked;
            
            // Update "All" checkbox based on individual selections
            const allChecked = Array.from(document.querySelectorAll('.filter-checkbox input:not(#filter-all)')).every(cb => cb.checked);
            allCheckbox.checked = allChecked;
        });
    });

    // Apply filter button
    document.getElementById('apply-filter').addEventListener('click', function() {
        renderTable(fetchedData);
    });
}

// Toggle select all users
function toggleSelectAll() {
    const profiles = document.querySelectorAll('.user-profile');
    allSelected = !allSelected;
    
    // Update button text
    const selectAllBtn = document.getElementById('select-all-btn');
    selectAllBtn.textContent = allSelected ? 'Deselect All' : 'Select All';
    
    // Reset selectedUsers array
    selectedUsers = [];
    
    profiles.forEach(profile => {
        if (profile.style.display !== 'none') { // Only select visible profiles
            if (allSelected) {
                profile.classList.add('selected');
                selectedUsers.push(profile.dataset.username);
            } else {
                profile.classList.remove('selected');
            }
        }
    });
}

// Show the selected tab
function showTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Show the selected tab
    document.getElementById(tabId).style.display = 'block';
    
    // Update active class
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Find the button that triggered this and add active class
    const buttons = document.querySelectorAll('.tab-button');
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].onclick.toString().includes(tabId)) {
            buttons[i].classList.add('active');
            break;
        }
    }
}

// Generate user profile elements
function generateUserProfiles() {
    const container = document.getElementById('user-profiles');
    container.innerHTML = '';
    
    defaultUsers.forEach(username => {
        const profileEl = document.createElement('div');
        profileEl.className = 'user-profile';
        profileEl.dataset.username = username;
        
        const avatarEl = document.createElement('div');
        avatarEl.className = 'avatar';
        avatarEl.textContent = username.charAt(0).toUpperCase();
        
        const nameEl = document.createElement('div');
        nameEl.className = 'username';
        nameEl.textContent = username;
        
        profileEl.appendChild(avatarEl);
        profileEl.appendChild(nameEl);
        
        // Add click event to select/deselect
        profileEl.addEventListener('click', function() {
            this.classList.toggle('selected');
            
            if (this.classList.contains('selected')) {
                selectedUsers.push(username);
            } else {
                selectedUsers = selectedUsers.filter(user => user !== username);
            }
            
            // Update allSelected status when clicking individual profiles
            updateSelectAllStatus();
        });
        
        container.appendChild(profileEl);
    });
}

// Update the Select All button status based on individual selections
function updateSelectAllStatus() {
    const visibleProfiles = Array.from(document.querySelectorAll('.user-profile')).filter(
        profile => profile.style.display !== 'none'
    );
    
    const allVisibleSelected = visibleProfiles.every(
        profile => profile.classList.contains('selected')
    );
    
    allSelected = allVisibleSelected;
    
    // Update button text
    const selectAllBtn = document.getElementById('select-all-btn');
    selectAllBtn.textContent = allSelected ? 'Deselect All' : 'Select All';
}

// Filter profiles based on search input
function filterProfiles() {
    const searchTerm = document.getElementById('profile-search').value.toLowerCase();
    const profiles = document.querySelectorAll('.user-profile');
    
    profiles.forEach(profile => {
        const username = profile.dataset.username.toLowerCase();
        if (username.includes(searchTerm)) {
            profile.style.display = 'block';
        } else {
            profile.style.display = 'none';
        }
    });
    
    // Update Select All button after filtering
    updateSelectAllStatus();
}

// Fetch statistics from AtCoder
async function fetchStats() {
    // Determine which users to fetch
    let usernames = [];
    
    // If we're on the profiles tab and have selected users
    if (document.getElementById('profiles-tab').style.display !== 'none' && selectedUsers.length > 0) {
        usernames = selectedUsers;
    } else {
        // Fallback to manual entry
        const usernamesText = document.getElementById("usernames").value.trim();
        if (!usernamesText) {
            alert("Please either select user profiles or enter usernames manually.");
            return;
        }
        usernames = usernamesText.split("\n").map(u => u.trim()).filter(u => u);
    }
    
    if (usernames.length === 0) {
        alert("Please select at least one user profile or enter usernames manually.");
        return;
    }
    
    const data = [];

    for (let uname of usernames) {
        try {
            const res = await fetch(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${uname}&from_second=0`);
            if (!res.ok) throw new Error("Failed to fetch");
            const submissions = await res.json();
            const accepted = submissions.filter(sub => sub.result === "AC");
            const solvedProblems = [...new Set(accepted.map(sub => sub.problem_id))];

            const levels = {
                "A": 0,
                "B": 0,
                "C": 0,
                "D": 0,
                "E": 0,
                "F": 0,
                "G": 0,
                "H/Ex": 0
            };
            solvedProblems.forEach(pid => {
                if (pid.endsWith("_a")) levels["A"]++;
                else if (pid.endsWith("_b")) levels["B"]++;
                else if (pid.endsWith("_c")) levels["C"]++;
                else if (pid.endsWith("_d")) levels["D"]++;
                else if (pid.endsWith("_e")) levels["E"]++;
                else if (pid.endsWith("_f")) levels["F"]++;
                else if (pid.endsWith("_g")) levels["G"]++;
                else if (pid.endsWith("_h") || pid.endsWith("_ex")) levels["H/Ex"]++;
            });
            const total = Object.values(levels).reduce((a, b) => a + b, 0);
            data.push({
                Username: uname,
                ...levels,
                Total: total
            });
        } catch (e) {
            data.push({
                Username: uname,
                "A": "Err",
                "B": "Err",
                "C": "Err",
                "D": "Err",
                "E": "Err",
                "F": "Err",
                "G": "Err",
                "H/Ex": "Err",
                "Total": "Err"
            });
        }
    }

    // Sort by Total
    data.sort((a, b) => (b.Total || 0) - (a.Total || 0));

    // Store the fetched data
    fetchedData = data;

    // Show the category filter
    document.getElementById('category-filter').style.display = 'block';

    // Generate table with the fetched data
    renderTable(data);

    const timestamp = new Date();
    document.getElementById("timestamp").innerText = `Generated on: ${timestamp.toLocaleString()}`;
}

// Render table with filtered data
// function renderTable(data) {
//     // Determine which categories to show
//     const columnsToShow = Object.entries(categoryFilters)
//         .filter(([_, isVisible]) => isVisible)
//         .map(([category]) => category);
    
//     // Start building table HTML
//     let html = "<table><tr><th>Username</th>";
    
//     // Add headers for selected categories
//     columnsToShow.forEach(category => {
//         html += `<th>${category}</th>`;
//     });
    
//     // Add total column
//     html += "<th>Total</th></tr>";
    
//     const topTotal = data[0].Total || 0;

//     // Add rows for each user
//     data.forEach(row => {
//         const topClass = row.Total === topTotal ? "top" : "";
//         html += `<tr class="${topClass}"><td>${row.Username}</td>`;
        
//         // Only show selected category columns
//         columnsToShow.forEach(category => {
//             html += `<td>${row[category]}</td>`;
//         });
        
//         // Calculate filtered total based on selected categories
//         let filteredTotal = 0;
//         if (row.Total !== "Err") {
//             filteredTotal = columnsToShow.reduce((sum, category) => sum + (parseInt(row[category]) || 0), 0);
//         } else {
//             filteredTotal = "Err";
//         }
        
//         html += `<td>${filteredTotal}</td></tr>`;
//     });
    
//     // Calculate summary statistics for each category if we have valid data
//     if (data.length > 0 && data[0].Total !== "Err") {
//         html += `<tr class="summary-row"><td><strong>Average</strong></td>`;
        
//         columnsToShow.forEach(category => {
//             const avg = data.reduce((sum, user) => 
//                 sum + (user[category] !== "Err" ? parseInt(user[category]) || 0 : 0), 0) / data.length;
//             html += `<td>${avg.toFixed(1)}</td>`;
//         });
        
//         // Average total
//         const avgTotal = data.reduce((sum, user) => 
//             sum + (user.Total !== "Err" ? parseInt(user.Total) || 0 : 0), 0) / data.length;
//         html += `<td>${avgTotal.toFixed(1)}</td></tr>`;
//     }
    
//     html += "</table>";
    
//     // Display active filters
//     let filterInfo = "";
//     if (columnsToShow.length < 8) {
//         filterInfo = "<div class='active-filters'><strong>Showing: </strong>";
//         columnsToShow.forEach(category => {
//             filterInfo += `<span class='filter-tag'>${category}</span>`;
//         });
//         filterInfo += "</div>";
//     }
    
//     document.getElementById("table-container").innerHTML = filterInfo + html;
// }



// Render table with filtered data
function renderTable(data) {
    // Determine which categories to show
    const columnsToShow = Object.entries(categoryFilters)
        .filter(([_, isVisible]) => isVisible)
        .map(([category]) => category);
    
    // Create a copy of the data to sort
    let sortedData = [...data];
    
    // If we're filtering by exactly one category, sort by that category
    if (columnsToShow.length === 1) {
        const sortCategory = columnsToShow[0];
        sortedData.sort((a, b) => {
            // Handle "Err" values
            if (a[sortCategory] === "Err") return 1;
            if (b[sortCategory] === "Err") return -1;
            
            // Sort by the selected category in descending order
            return parseInt(b[sortCategory]) - parseInt(a[sortCategory]);
        });
    } else {
        // Otherwise, sort by the sum of selected categories (filtered total)
        sortedData.sort((a, b) => {
            // Calculate filtered totals
            const totalA = columnsToShow.reduce((sum, category) => {
                return sum + (a[category] !== "Err" ? parseInt(a[category]) || 0 : 0);
            }, 0);
            
            const totalB = columnsToShow.reduce((sum, category) => {
                return sum + (b[category] !== "Err" ? parseInt(b[category]) || 0 : 0);
            }, 0);
            
            return totalB - totalA; // Descending order
        });
    }
    
    // Start building table HTML
    let html = "<table><tr><th>Username</th>";
    
    // Add headers for selected categories
    columnsToShow.forEach(category => {
        html += `<th>${category}</th>`;
    });
    
    // Add total column
    html += "<th>Total</th></tr>";
    
    // Find top value based on current sort
    let topValue;
    if (columnsToShow.length === 1) {
        const sortCategory = columnsToShow[0];
        topValue = sortedData[0][sortCategory];
    } else {
        topValue = sortedData[0].Total;
    }
    
    // Add rows for each user
    sortedData.forEach(row => {
        // Determine if this row should have the "top" class
        let isTop = false;
        if (columnsToShow.length === 1) {
            const sortCategory = columnsToShow[0];
            isTop = (row[sortCategory] === topValue && row[sortCategory] !== "Err");
        } else {
            isTop = (row.Total === topValue && row.Total !== "Err");
        }
        
        const topClass = isTop ? "top" : "";
        html += `<tr class="${topClass}"><td>${row.Username}</td>`;
        
        // Only show selected category columns
        columnsToShow.forEach(category => {
            html += `<td>${row[category]}</td>`;
        });
        
        // Calculate filtered total based on selected categories
        let filteredTotal = 0;
        if (row.Total !== "Err") {
            filteredTotal = columnsToShow.reduce((sum, category) => sum + (parseInt(row[category]) || 0), 0);
        } else {
            filteredTotal = "Err";
        }
        
        html += `<td>${filteredTotal}</td></tr>`;
    });
    
    // Calculate summary statistics for each category if we have valid data
    if (sortedData.length > 0 && sortedData[0].Total !== "Err") {
        html += `<tr class="summary-row"><td><strong>Average</strong></td>`;
        
        columnsToShow.forEach(category => {
            const avg = sortedData.reduce((sum, user) => 
                sum + (user[category] !== "Err" ? parseInt(user[category]) || 0 : 0), 0) / sortedData.length;
            html += `<td>${avg.toFixed(1)}</td>`;
        });
        
        // Average total
        const avgTotal = sortedData.reduce((sum, user) => 
            sum + (user.Total !== "Err" ? parseInt(user.Total) || 0 : 0), 0) / sortedData.length;
        html += `<td>${avgTotal.toFixed(1)}</td></tr>`;
    }
    
    html += "</table>";
    
    // Display active filters
    let filterInfo = "";
    if (columnsToShow.length < 8) {
        filterInfo = "<div class='active-filters'><strong>Showing: </strong>";
        columnsToShow.forEach(category => {
            filterInfo += `<span class='filter-tag'>${category}</span>`;
        });
        filterInfo += "</div>";
    }
    
    document.getElementById("table-container").innerHTML = filterInfo + html;
}

