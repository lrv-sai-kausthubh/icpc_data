// Default user lists for each platform
const defaultAtCoderUsers = [
    "surya_sujith09", "Chandrika0205", "jalaluddin420", "harshith2507",
    "Tanushreddyy", "Karthik0206", "koushikweb", "suhas3157", 
    "joelchopra", "sonu24", "hemanthraojamena", "manichandana", 
    "lrv", "sdr", "shiva_karthik121", "advaithchaitanya", 
    "manchalaganesh", "ponugotikruthik", "ManojVakiti", "KiranKumarChenna"
];

const defaultCodeforcesUsers = [
    "surya_sujith09", "Chandrika0205", "jalaluddin420", "harshith2507",
    "Tanushreddyy", "Karthik0206", "koushikweb", "suhas3157", 
    "joelchopra", "sonu24", "hemanthraojamena", "manichandana", 
    "lrvkausthubh", "sdr", "shiva_karthik121", "advaithchaitanya", 
    "manchalaganesh", "ponugotikruthik", "ManojVakiti", "KiranKumarChenna"
];

// User mapping to connect AtCoder and CodeForces IDs
const userMapping = {};
defaultAtCoderUsers.forEach((user, index) => {
    userMapping[user] = {
        atcoder: user,
        codeforces: defaultCodeforcesUsers[index] || user // Fallback to same name if no mapping
    };
});

// Add this new function to combine data by user

function consolidateUserData() {
    const consolidatedData = [];
    const userMap = new Map();
    
    // First, process AtCoder data
    if (platformVisibility.atcoder) {
        fetchedData.atcoder.forEach(atcoderUser => {
            userMap.set(atcoderUser.Username, {
                Username: atcoderUser.Username,
                AtCoderUsername: atcoderUser.PlatformUsername,
                CodeforcesUsername: "",
                // AtCoder data
                "A": atcoderUser.A,
                "B": atcoderUser.B,
                "C": atcoderUser.C,
                "D": atcoderUser.D,
                "E": atcoderUser.E,
                "F": atcoderUser.F,
                "G": atcoderUser.G,
                "H/Ex": atcoderUser["H/Ex"],
                // Initialize CodeForces data as empty
                "CF-800": "-",
                "CF-1000": "-",
                "CF-1200": "-",
                "CF-1400": "-",
                "CF-1600": "-",
                "CF-1900": "-",
                // Calculate AtCoder total
                AtCoderTotal: atcoderUser.Total,
                CodeforcesTotal: "-",
                // Combined total will be calculated later
                Total: atcoderUser.Total === "Err" ? "Err" : parseInt(atcoderUser.Total) || 0
            });
        });
    }
    
    // Then, process and merge CodeForces data
    if (platformVisibility.codeforces) {
        fetchedData.codeforces.forEach(cfUser => {
            if (userMap.has(cfUser.Username)) {
                // Update existing user with CodeForces data
                const userData = userMap.get(cfUser.Username);
                userData.CodeforcesUsername = cfUser.PlatformUsername;
                userData["CF-800"] = cfUser["CF-800"];
                userData["CF-1000"] = cfUser["CF-1000"];
                userData["CF-1200"] = cfUser["CF-1200"];
                userData["CF-1400"] = cfUser["CF-1400"];
                userData["CF-1600"] = cfUser["CF-1600"];
                userData["CF-1900"] = cfUser["CF-1900"];
                userData.CodeforcesTotal = cfUser.Total;
                
                // Update combined total
                if (userData.Total !== "Err" && cfUser.Total !== "Err") {
                    userData.Total = parseInt(userData.Total) + parseInt(cfUser.Total);
                } else if (cfUser.Total !== "Err") {
                    userData.Total = parseInt(cfUser.Total);
                }
            } else {
                // Create new user with only CodeForces data
                userMap.set(cfUser.Username, {
                    Username: cfUser.Username,
                    AtCoderUsername: "",
                    CodeforcesUsername: cfUser.PlatformUsername,
                    // Initialize AtCoder data as empty
                    "A": "-",
                    "B": "-",
                    "C": "-",
                    "D": "-",
                    "E": "-",
                    "F": "-",
                    "G": "-",
                    "H/Ex": "-",
                    // CodeForces data
                    "CF-800": cfUser["CF-800"],
                    "CF-1000": cfUser["CF-1000"],
                    "CF-1200": cfUser["CF-1200"],
                    "CF-1400": cfUser["CF-1400"],
                    "CF-1600": cfUser["CF-1600"],
                    "CF-1900": cfUser["CF-1900"],
                    // Totals
                    AtCoderTotal: "-",
                    CodeforcesTotal: cfUser.Total,
                    Total: cfUser.Total
                });
            }
        });
    }
    
    // Convert the map to an array
    userMap.forEach(userData => {
        consolidatedData.push(userData);
    });
    
    return consolidatedData;
}

// Track selected users
let selectedUsers = [];
// Track if all users are selected
let allSelected = false;
// Store the fetched data
let fetchedData = {
    atcoder: [],
    codeforces: []
};
// Store the combined data
let combinedData = [];

// Store the category filters
let categoryFilters = {
    // AtCoder categories
    "A": true,
    "B": true,
    "C": true,
    "D": true,
    "E": true,
    "F": true,
    "G": true,
    "H/Ex": true,
    // CodeForces categories by rating
    "CF-800": true,   // 800-999
    "CF-1000": true,  // 1000-1199
    "CF-1200": true,  // 1200-1399
    "CF-1400": true,  // 1400-1599
    "CF-1600": true,  // 1600-1899
    "CF-1900": true   // 1900+
};

// Store platform visibility
let platformVisibility = {
    atcoder: true,
    codeforces: true
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
    setupFilterListeners();
});

// Set up filter functionality
// Update the setupFilterListeners function
function setupFilterListeners() {
    // Log current filter state for debugging
    console.log("Initial category filters:", categoryFilters);

    // All checkbox functionality
    const allCheckbox = document.getElementById('filter-all');
    allCheckbox.addEventListener('change', function() {
        const checked = this.checked;
        
        // Update all individual category checkboxes
        document.querySelectorAll('.filter-checkbox input:not(#filter-all)').forEach(checkbox => {
            checkbox.checked = checked;
            
            // Extract the full category ID
            let category = checkbox.id.replace('filter-', '');
            
            // Special case handling
            if (category === 'H') {
                category = 'H/Ex';
            }
            
            // Update the filter state
            categoryFilters[category] = checked;
        });
        
        console.log("After 'All' change:", categoryFilters);
    });

    // Individual AtCoder category checkboxes
    document.querySelectorAll('#atcoder-categories .filter-checkbox input').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Get category from checkbox id
            let category = this.id.replace('filter-', '');
            
            // Special case for H/Ex
            if (category === 'H') {
                category = 'H/Ex';
            }
            
            // Update filter state
            categoryFilters[category] = this.checked;
            console.log(`AtCoder category ${category} set to ${this.checked}`);
            
            updateAllCheckboxState();
        });
    });
    
    // Individual CodeForces category checkboxes
    document.querySelectorAll('#codeforces-categories .filter-checkbox input').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // For CodeForces, we need the full ID including "CF-"
            const category = this.id.replace('filter-', '');
            
            // Update filter state
            categoryFilters[category] = this.checked;
            console.log(`CodeForces category ${category} set to ${this.checked}`);
            
            updateAllCheckboxState();
        });
    });

    // Platform visibility checkboxes
    document.getElementById('show-atcoder').addEventListener('change', function() {
        platformVisibility.atcoder = this.checked;
        console.log(`AtCoder visibility set to ${this.checked}`);
    });
    
    document.getElementById('show-codeforces').addEventListener('change', function() {
        platformVisibility.codeforces = this.checked;
        console.log(`CodeForces visibility set to ${this.checked}`);
    });

    // Apply filter button
    document.getElementById('apply-filter').addEventListener('click', function() {
        console.log("Applying filters:", categoryFilters);
        combineAndRenderData();
    });
}

// Helper function to update the "All" checkbox state
function updateAllCheckboxState() {
    const allCheckbox = document.getElementById('filter-all');
    const allCategoryCheckboxes = document.querySelectorAll('.filter-checkbox input:not(#filter-all)');
    const allChecked = Array.from(allCategoryCheckboxes).every(cb => cb.checked);
    
    // Update the "All" checkbox without triggering its change event
    allCheckbox.checked = allChecked;
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
    // Same as before - no changes needed here
    // ...existing code...
}

// Generate user profile elements
function generateUserProfiles() {
    const container = document.getElementById('user-profiles');
    container.innerHTML = '';
    
    Object.keys(userMapping).forEach(username => {
        const profileEl = document.createElement('div');
        profileEl.className = 'user-profile';
        profileEl.dataset.username = username;
        profileEl.dataset.atcoder = userMapping[username].atcoder;
        profileEl.dataset.codeforces = userMapping[username].codeforces;
        
        const avatarEl = document.createElement('div');
        avatarEl.className = 'avatar';
        avatarEl.textContent = username.charAt(0).toUpperCase();
        
        const nameEl = document.createElement('div');
        nameEl.className = 'username';
        nameEl.textContent = username;
        
        // Add platform usernames if they differ
        if (userMapping[username].atcoder !== userMapping[username].codeforces) {
            const platformsEl = document.createElement('div');
            platformsEl.className = 'platform-usernames';
            platformsEl.innerHTML = `
                <span class="platform-tag atcoder-tag">AC: ${userMapping[username].atcoder}</span>
                <span class="platform-tag codeforces-tag">CF: ${userMapping[username].codeforces}</span>
            `;
            profileEl.appendChild(avatarEl);
            profileEl.appendChild(nameEl);
            profileEl.appendChild(platformsEl);
        } else {
            profileEl.appendChild(avatarEl);
            profileEl.appendChild(nameEl);
        }
        
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
    // Same as before - no changes needed here
    // ...existing code...
}

// Filter profiles based on search input
function filterProfiles() {
    const searchTerm = document.getElementById('profile-search').value.toLowerCase();
    const profiles = document.querySelectorAll('.user-profile');
    
    profiles.forEach(profile => {
        const username = profile.dataset.username.toLowerCase();
        const atcoderId = profile.dataset.atcoder.toLowerCase();
        const codeforcesId = profile.dataset.codeforces.toLowerCase();
        
        if (username.includes(searchTerm) || 
            atcoderId.includes(searchTerm) || 
            codeforcesId.includes(searchTerm)) {
            profile.style.display = 'block';
        } else {
            profile.style.display = 'none';
        }
    });
    
    // Update Select All button after filtering
    updateSelectAllStatus();
}

// Fetch statistics from both platforms
async function fetchStats() {
    // Determine which users to fetch
    let selectedUsernames = [];
    
    // If we're on the profiles tab and have selected users
    if (document.getElementById('profiles-tab').style.display !== 'none' && selectedUsers.length > 0) {
        selectedUsernames = selectedUsers;
    } else {
        // Fallback to manual entry - this needs to be modified for dual platform
        const atcoderText = document.getElementById("atcoder-usernames").value.trim();
        const codeforcesText = document.getElementById("codeforces-usernames").value.trim();
        
        if (!atcoderText && !codeforcesText) {
            alert("Please either select user profiles or enter usernames manually for at least one platform.");
            return;
        }
        
        // Create mappings for manually entered users
        const atcoderUsers = atcoderText.split("\n").map(u => u.trim()).filter(u => u);
        const codeforcesUsers = codeforcesText.split("\n").map(u => u.trim()).filter(u => u);
        
        // Use the longer list as the base
        const baseList = atcoderUsers.length >= codeforcesUsers.length ? atcoderUsers : codeforcesUsers;
        
        baseList.forEach((user, index) => {
            const mappedUser = user;
            userMapping[mappedUser] = {
                atcoder: atcoderUsers[index] || "",
                codeforces: codeforcesUsers[index] || ""
            };
            selectedUsernames.push(mappedUser);
        });
    }
    
    if (selectedUsernames.length === 0) {
        alert("Please select at least one user profile or enter usernames manually.");
        return;
    }
    
    // Reset data
    fetchedData = {
        atcoder: [],
        codeforces: []
    };
    
    // Determine which platforms to fetch
    let fetchAtCoder = true;
    let fetchCodeforces = true;
    
    // If in manual mode, check platform selections
    if (document.getElementById('manual-tab').style.display !== 'none') {
        fetchAtCoder = document.getElementById('platform-atcoder').checked;
        fetchCodeforces = document.getElementById('platform-codeforces').checked;
        
        if (!fetchAtCoder && !fetchCodeforces) {
            alert("Please select at least one platform to fetch data from.");
            return;
        }
    }
    
    // Show loading indicator
    document.getElementById("table-container").innerHTML = "<p>Fetching data from both platforms, please wait...</p>";
    
    // Fetch data in parallel
    const fetchPromises = [];
    
    if (fetchAtCoder) {
        fetchPromises.push(fetchAtCoderData(selectedUsernames));
    }
    
    if (fetchCodeforces) {
        fetchPromises.push(fetchCodeforcesData(selectedUsernames));
    }
    
    try {
        await Promise.all(fetchPromises);
        
        // Show the filters
        document.getElementById('platform-filter').style.display = 'block';
        document.getElementById('category-filter').style.display = 'block';
        
        // Combine and render data
        combineAndRenderData();
        
        const timestamp = new Date();
        document.getElementById("timestamp").innerText = `Generated on: ${timestamp.toLocaleString()}`;
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("table-container").innerHTML = "<p>Error fetching data. Please try again.</p>";
    }
}

// Fetch AtCoder data
async function fetchAtCoderData(selectedUsernames) {
    for (let username of selectedUsernames) {
        const atcoderUsername = userMapping[username].atcoder;
        if (!atcoderUsername) continue; // Skip if no AtCoder username
        
        try {
            const res = await fetch(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${atcoderUsername}&from_second=0`);
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
            fetchedData.atcoder.push({
                Username: username,
                PlatformUsername: atcoderUsername,
                Platform: "AtCoder",
                ...levels,
                Total: total
            });
        } catch (e) {
            fetchedData.atcoder.push({
                Username: username,
                PlatformUsername: atcoderUsername,
                Platform: "AtCoder",
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
}

// Fetch Codeforces data
// Update the CodeForces data fetching function to categorize by rating
async function fetchCodeforcesData(selectedUsernames) {
    for (let username of selectedUsernames) {
        const codeforcesUsername = userMapping[username].codeforces;
        if (!codeforcesUsername) continue; // Skip if no CodeForces username
        
        try {
            const res = await fetch(`https://codeforces.com/api/user.status?handle=${codeforcesUsername}`);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            
            if (data.status !== "OK") throw new Error("API returned error");
            
            const submissions = data.result;
            const accepted = submissions.filter(sub => sub.verdict === "OK");
            
            // Create a unique set of solved problems with their ratings
            const solvedProblems = [];
            const uniqueProblemIds = new Set();
            
            accepted.forEach(sub => {
                const problemId = `${sub.contestId}_${sub.problem.index}`;
                if (!uniqueProblemIds.has(problemId)) {
                    uniqueProblemIds.add(problemId);
                    solvedProblems.push({
                        id: problemId,
                        rating: sub.problem.rating || 0
                    });
                }
            });

            const levels = {
                "CF-800": 0,   // 800-999
                "CF-1000": 0,  // 1000-1199
                "CF-1200": 0,  // 1200-1399
                "CF-1400": 0,  // 1400-1599
                "CF-1600": 0,  // 1600-1899
                "CF-1900": 0   // 1900+
            };
            
            solvedProblems.forEach(problem => {
                const rating = problem.rating;
                
                if (rating === 0) {
                    // Skip unrated problems
                    return;
                } else if (rating < 1000) {
                    levels["CF-800"]++;
                } else if (rating < 1200) {
                    levels["CF-1000"]++;
                } else if (rating < 1400) {
                    levels["CF-1200"]++;
                } else if (rating < 1600) {
                    levels["CF-1400"]++;
                } else if (rating < 1900) {
                    levels["CF-1600"]++;
                } else {
                    levels["CF-1900"]++;
                }
            });
            
            const total = Object.values(levels).reduce((a, b) => a + b, 0);
            fetchedData.codeforces.push({
                Username: username,
                PlatformUsername: codeforcesUsername,
                Platform: "CodeForces",
                ...levels,
                Total: total
            });
        } catch (e) {
            fetchedData.codeforces.push({
                Username: username,
                PlatformUsername: codeforcesUsername,
                Platform: "CodeForces",
                "CF-800": "Err",
                "CF-1000": "Err",
                "CF-1200": "Err",
                "CF-1400": "Err",
                "CF-1600": "Err",
                "CF-1900": "Err",
                "Total": "Err"
            });
        }
    }
}

// Combine data from both platforms and render
// Replace the existing combineAndRenderData function

function combineAndRenderData() {
    // Use the new consolidation function instead of simply concatenating arrays
    const consolidatedData = consolidateUserData();
    
    // Sort by total score
    consolidatedData.sort((a, b) => {
        if (a.Total === "Err") return 1;
        if (b.Total === "Err") return -1;
        return b.Total - a.Total;
    });
    
    // Render the consolidated data
    renderConsolidatedTable(consolidatedData);
}

function renderConsolidatedTable(data) {
    if (data.length === 0) {
        document.getElementById("table-container").innerHTML = "<p>No data to display. Please select at least one platform.</p>";
        return;
    }
    
    // Determine which categories to show based on platform visibility and filters
    let atcoderCategories = [];
    if (platformVisibility.atcoder) {
        atcoderCategories = ["A", "B", "C", "D", "E", "F", "G", "H/Ex"]
            .filter(cat => categoryFilters[cat]);
    }
    
    let cfCategories = [];
    if (platformVisibility.codeforces) {
        cfCategories = ["CF-800", "CF-1000", "CF-1200", "CF-1400", "CF-1600", "CF-1900"]
            .filter(cat => categoryFilters[cat]);
    }
    
    // Start building table
    let html = "<table><tr><th>Username</th><th>Platform IDs</th>";
    
    // Add headers for AtCoder categories
    atcoderCategories.forEach(category => {
        html += `<th>${category}</th>`;
    });
    
    // Add headers for CodeForces categories
    cfCategories.forEach(category => {
        // Display rating ranges
        let displayText = "";
        switch(category) {
            case "CF-800": displayText = "800-999"; break;
            case "CF-1000": displayText = "1000-1199"; break;
            case "CF-1200": displayText = "1200-1399"; break;
            case "CF-1400": displayText = "1400-1599"; break;
            case "CF-1600": displayText = "1600-1899"; break;
            case "CF-1900": displayText = "1900+"; break;
            default: displayText = category.replace('CF-', '');
        }
        html += `<th>${displayText}</th>`;
    });
    
    // Add total column
    html += "<th>Total</th></tr>";
    
    // Find the top performer
    const topTotal = data[0].Total !== "Err" ? data[0].Total : 0;
    
    // Add rows for each user
    data.forEach(row => {
        const isTop = (row.Total === topTotal && row.Total !== "Err");
        const topClass = isTop ? "top" : "";
        
        html += `<tr class="${topClass}">
            <td>${row.Username}</td>
            <td>`;
            
        // Show platform usernames with appropriate tags
        if (row.AtCoderUsername && row.AtCoderUsername !== "-") {
            html += `<span class="platform-tag atcoder-tag">AC: ${row.AtCoderUsername}</span> `;
        }
        if (row.CodeforcesUsername && row.CodeforcesUsername !== "-") {
            html += `<span class="platform-tag codeforces-tag">CF: ${row.CodeforcesUsername}</span>`;
        }
        
        html += `</td>`;
        
        // Add AtCoder category cells
        atcoderCategories.forEach(category => {
            html += `<td>${row[category]}</td>`;
        });
        
        // Add CodeForces category cells
        cfCategories.forEach(category => {
            html += `<td>${row[category]}</td>`;
        });
        
        // Calculate filtered total based on selected categories
        let filteredTotal = 0;
        if (row.Total !== "Err") {
            // For AtCoder categories
            atcoderCategories.forEach(cat => {
                if (row[cat] !== "-" && !isNaN(parseInt(row[cat]))) {
                    filteredTotal += parseInt(row[cat]);
                }
            });
            
            // For CodeForces categories
            cfCategories.forEach(cat => {
                if (row[cat] !== "-" && !isNaN(parseInt(row[cat]))) {
                    filteredTotal += parseInt(row[cat]);
                }
            });
        } else {
            filteredTotal = "Err";
        }
        
        html += `<td>${filteredTotal}</td></tr>`;
    });
    
    // Calculate summary statistics
    if (data.length > 0) {
        // AtCoder averages
        if (platformVisibility.atcoder && atcoderCategories.length > 0) {
            const validAtcoderData = data.filter(user => user.AtCoderTotal !== "Err" && user.AtCoderTotal !== "-");
            
            if (validAtcoderData.length > 0) {
                html += `<tr class="summary-row"><td><strong>AtCoder Average</strong></td><td>-</td>`;
                
                // AtCoder category averages
                atcoderCategories.forEach(category => {
                    const avg = validAtcoderData.reduce((sum, user) => {
                        if (user[category] === "-" || user[category] === "Err") return sum;
                        return sum + (parseInt(user[category]) || 0);
                    }, 0) / validAtcoderData.length;
                    html += `<td>${avg.toFixed(1)}</td>`;
                });
                
                // Empty cells for CF categories
                cfCategories.forEach(() => {
                    html += `<td>-</td>`;
                });
                
                html += `<td>-</td></tr>`;
            }
        }
        
        // CodeForces averages
        if (platformVisibility.codeforces && cfCategories.length > 0) {
            const validCfData = data.filter(user => user.CodeforcesTotal !== "Err" && user.CodeforcesTotal !== "-");
            
            if (validCfData.length > 0) {
                html += `<tr class="summary-row"><td><strong>CodeForces Average</strong></td><td>-</td>`;
                
                // Empty cells for AtCoder categories
                atcoderCategories.forEach(() => {
                    html += `<td>-</td>`;
                });
                
                // CodeForces category averages
                cfCategories.forEach(category => {
                    const avg = validCfData.reduce((sum, user) => {
                        if (user[category] === "-" || user[category] === "Err") return sum;
                        return sum + (parseInt(user[category]) || 0);
                    }, 0) / validCfData.length;
                    html += `<td>${avg.toFixed(1)}</td>`;
                });
                
                html += `<td>-</td></tr>`;
            }
        }
    }
    
    html += "</table>";
    
    // Display active filters
    let filterInfo = "<div class='active-filters'><strong>Showing: </strong>";
    
    // Display selected platforms
    if (platformVisibility.atcoder) {
        filterInfo += `<span class="platform-tag atcoder-tag">AtCoder</span>`;
    }
    if (platformVisibility.codeforces) {
        filterInfo += `<span class="platform-tag codeforces-tag">CodeForces</span>`;
    }
    
    // Display selected categories
    let hasFilters = false;
    if (atcoderCategories.length < 8 || cfCategories.length < 6) {
        hasFilters = true;
        filterInfo += " <strong>Categories:</strong> ";
        atcoderCategories.forEach(category => {
            filterInfo += `<span class='filter-tag'>${category}</span>`;
        });
        cfCategories.forEach(category => {
            // Use proper display text for rating ranges
            let displayText = "";
            switch(category) {
                case "CF-800": displayText = "800-999"; break;
                case "CF-1000": displayText = "1000-1199"; break;
                case "CF-1200": displayText = "1200-1399"; break;
                case "CF-1400": displayText = "1400-1599"; break;
                case "CF-1600": displayText = "1600-1899"; break;
                case "CF-1900": displayText = "1900+"; break;
                default: displayText = category.replace('CF-', '');
            }
            filterInfo += `<span class='filter-tag'>${displayText}</span>`;
        });
    }
    
    filterInfo += "</div>";
    
    document.getElementById("table-container").innerHTML = (hasFilters ? filterInfo : "") + html;
}


