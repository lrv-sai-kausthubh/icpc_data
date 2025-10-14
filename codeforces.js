// Default user list
const defaultUsers = [
    "jalaluddin420", 
    "lrvkausthubh",
];

// Track selected users
let selectedUsers = [];
// Track if all users are selected
let allSelected = false;

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
});

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

// Helper function to handle API fetch with error handling
async function fetchCodeforcesAPI(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        const data = await response.json();
        if (data.status !== 'OK') {
            throw new Error(`API error: ${data.comment || 'Unknown error'}`);
        }
        return data.result;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

// Group submissions by problem difficulty
function groupSubmissionsByDifficulty(submissions) {
    const difficulties = {
        'A (800-1000)': 0,
        'B (1000-1200)': 0,
        'C (1200-1400)': 0,
        'D (1400-1600)': 0,
        'E (1600-1800)': 0,
        'F (1800-2000)': 0,
        '2000+': 0
    };
    
    // Create set of unique solved problems (by id+index)
    const solvedProblems = new Set();
    
    submissions.forEach(submission => {
        if (submission.verdict === 'OK') {
            // Create unique problem identifier
            const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
            
            if (!solvedProblems.has(problemId)) {
                solvedProblems.add(problemId);
                
                const rating = submission.problem.rating || 0;
                
                if (rating <= 1000) {
                    difficulties['A (800-1000)']++;
                } else if (rating <= 1200) {
                    difficulties['B (1000-1200)']++;
                } else if (rating <= 1400) {
                    difficulties['C (1200-1400)']++;
                } else if (rating <= 1600) {
                    difficulties['D (1400-1600)']++;
                } else if (rating <= 1800) {
                    difficulties['E (1600-1800)']++;
                } else if (rating <= 2000) {
                    difficulties['F (1800-2000)']++;
                } else {
                    difficulties['2000+']++;
                }
            }
        }
    });
    
    return {
        difficulties,
        total: solvedProblems.size
    };
}

// Fetch statistics from Codeforces
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
    
    // Show loading message
    document.getElementById("table-container").innerHTML = "<p>Loading data from Codeforces API...</p>";
    
    const data = [];

    for (let username of usernames) {
        try {
            // Fetch user info
            const userInfo = await fetchCodeforcesAPI(`https://codeforces.com/api/user.info?handles=${username}`);
            
            // Fetch user submissions (limited to most recent 500 for performance)
            const submissions = await fetchCodeforcesAPI(`https://codeforces.com/api/user.status?handle=${username}&count=500`);
            
            // Process submissions by difficulty
            const { difficulties, total } = groupSubmissionsByDifficulty(submissions);
            
            data.push({
                Username: username,
                Rating: userInfo[0].rating || 'Unrated',
                MaxRating: userInfo[0].maxRating || 'Unrated',
                Rank: userInfo[0].rank || 'Unranked',
                ...difficulties,
                Total: total
            });
        } catch (e) {
            console.error(`Error fetching data for ${username}:`, e);
            data.push({
                Username: username,
                Rating: 'Error',
                MaxRating: 'Error',
                Rank: 'Error',
                'A (800-1000)': 'Err',
                'B (1000-1200)': 'Err',
                'C (1200-1400)': 'Err',
                'D (1400-1600)': 'Err',
                'E (1600-1800)': 'Err',
                'F (1800-2000)': 'Err',
                '2000+': 'Err',
                Total: 'Err'
            });
        }
    }

    // Sort by Total (descending)
    data.sort((a, b) => {
        if (a.Total === 'Err') return 1;
        if (b.Total === 'Err') return -1;
        return b.Total - a.Total;
    });

    // Generate HTML table
    let html = "<table><tr><th>Username</th><th>Rating</th><th>Max</th><th>Rank</th>" +
               "<th>A (800-1000)</th><th>B (1000-1200)</th><th>C (1200-1400)</th>" +
               "<th>D (1400-1600)</th><th>E (1600-1800)</th><th>F (1800-2000)</th><th>2000+</th><th>Total</th></tr>";
    
    // Find highest total
    const topTotal = Math.max(...data.filter(row => row.Total !== 'Err').map(row => row.Total), 0);

    data.forEach(row => {
        const topClass = row.Total === topTotal && row.Total !== 'Err' ? "top" : "";
        html += `<tr class="${topClass}">
            <td>${row.Username}</td>
            <td>${row.Rating}</td>
            <td>${row.MaxRating}</td>
            <td>${row.Rank}</td>
            <td>${row['A (800-1000)']}</td>
            <td>${row['B (1000-1200)']}</td>
            <td>${row['C (1200-1400)']}</td>
            <td>${row['D (1400-1600)']}</td>
            <td>${row['E (1600-1800)']}</td>
            <td>${row['F (1800-2000)']}</td>
            <td>${row['2000+']}</td>
            <td>${row.Total}</td>
        </tr>`;
    });
    html += "</table>";
    document.getElementById("table-container").innerHTML = html;

    const timestamp = new Date();
    document.getElementById("timestamp").innerText = `Generated on: ${timestamp.toLocaleString()}`;
}