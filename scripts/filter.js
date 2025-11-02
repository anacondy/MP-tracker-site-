/*
  File: scripts/filter.js
  Description: This file is the "brain" for the Know Your Rep page.
  It contains the MP data and all logic for filtering, sorting,
  and rendering the MP cards dynamically.
*/

// Wait for the DOM to load before running
document.addEventListener('DOMContentLoaded', () => {

    // === 1. MP DATABASE ===
    // This is our list of 20+ sample MPs.
    // 'alliance' -> 'NDA', 'INDIA', or 'Other'
    const mps_data = [
        { name: "Supriya Sule", party: "NCP", constituency: "Baramati", alliance: "INDIA", attendance: 92, questions: 596, debates: 189, cases: 0 },
        { name: "Nishikant Dubey", party: "BJP", constituency: "Godda", alliance: "NDA", attendance: 85, questions: 430, debates: 120, cases: 2 },
        { name: "Asaduddin Owaisi", party: "AIMIM", constituency: "Hyderabad", alliance: "Other", attendance: 70, questions: 345, debates: 55, cases: 5 },
        { name: "Mahua Moitra", party: "AITC", constituency: "Krishnanagar", alliance: "INDIA", attendance: 80, questions: 210, debates: 80, cases: 0 },
        { name: "Sunny Deol", party: "BJP", constituency: "Gurdaspur", alliance: "NDA", attendance: 17, questions: 1, debates: 0, cases: 0 },
        { name: "Rahul Gandhi", party: "INC", constituency: "Wayanad", alliance: "INDIA", attendance: 65, questions: 90, debates: 35, cases: 3 },
        { name: "Amit Shah", party: "BJP", constituency: "Gandhinagar", alliance: "NDA", attendance: 88, questions: 0, debates: 15, cases: 0 },
        { name: "Shashi Tharoor", party: "INC", constituency: "Thiruvananthapuram", alliance: "INDIA", attendance: 76, questions: 250, debates: 95, cases: 1 },
        { name: "Locket Chatterjee", party: "BJP", constituency: "Hooghly", alliance: "NDA", attendance: 82, questions: 310, debates: 60, cases: 0 },
        { name: "Akhilesh Yadav", party: "SP", constituency: "Azamgarh", alliance: "INDIA", attendance: 40, questions: 20, debates: 5, cases: 1 },
        { name: "Harsimrat Kaur Badal", party: "SAD", constituency: "Bathinda", alliance: "NDA", attendance: 78, questions: 120, debates: 22, cases: 0 },
        { name: "Adhir Ranjan Chowdhury", party: "INC", constituency: "Baharampur", alliance: "INDIA", attendance: 69, questions: 180, debates: 110, cases: 0 },
        { name: "Smriti Irani", party: "BJP", constituency: "Amethi", alliance: "NDA", attendance: 75, questions: 0, debates: 12, cases: 0 },
        { name: "Dayanidhi Maran", party: "DMK", constituency: "Chennai Central", alliance: "INDIA", attendance: 81, questions: 280, debates: 45, cases: 2 },
        { name: "Gautam Gambhir", party: "BJP", constituency: "East Delhi", alliance: "NDA", attendance: 35, questions: 10, debates: 2, cases: 0 },
        { name: "Kanimozhi", party: "DMK", constituency: "Thoothukkudi", alliance: "INDIA", attendance: 84, questions: 320, debates: 70, cases: 0 },
        { name: "Ravi Kishan", party: "BJP", constituency: "Gorakhpur", alliance: "NDA", attendance: 60, questions: 55, debates: 18, cases: 0 },
        { name: "Mimi Chakraborty", party: "AITC", constituency: "Jadavpur", alliance: "INDIA", attendance: 22, questions: 5, debates: 1, cases: 0 },
        { name: "Tejasvi Surya", party: "BJP", constituency: "Bangalore South", alliance: "NDA", attendance: 77, questions: 150, debates: 40, cases: 1 },
        { name: "S. S. Ahluwalia", party: "BJP", constituency: "Bardhaman-Durgapur", alliance: "NDA", attendance: 90, questions: 220, debates: 85, cases: 0 }
    ];

    // === 2. GET HTML ELEMENTS ===
    const gridContainer = document.getElementById('rep-grid-container');
    const searchBar = document.getElementById('filter-search');
    const sortSelect = document.getElementById('filter-sort');

    // === 3. RENDER FUNCTION ===
    // This function takes a list of MPs and builds the HTML
    const renderMPs = (mpList) => {
        // Clear the grid first
        gridContainer.innerHTML = '';

        if (mpList.length === 0) {
            gridContainer.innerHTML = '<p class="no-results">No MPs found matching your criteria.</p>';
            return;
        }

        // Loop through each MP and create an HTML card
        mpList.forEach(mp => {
            // Your dynamic styling rules:
            const attClass = mp.attendance > 50 ? 'highlight-green' : 'highlight-red';
            const borderClass = mp.alliance === 'NDA' ? 'alliance-nda' : (mp.alliance === 'INDIA' ? 'alliance-india' : 'alliance-other');

            // Generate the initials
            const names = mp.name.split(' ');
            const initials = names.length > 1 ? `${names[0][0]}${names[1][0]}` : `${names[0][0]}`;

            // Create the card HTML
            const cardHTML = `
                <div class="rep-card">
                    <div class="rep-header">
                        <div class="rep-photo ${borderClass}">
                            <span class="rep-initials">${initials}</span>
                        </div>
                        <div class="rep-info">
                            <h3>${mp.name}</h3>
                            <p>${mp.party} - <span class="constituency">${mp.constituency}</span></p>
                        </div>
                    </div>
                    <div class="rep-stats">
                        <div class="stat-item" title="Attendance">
                            <span class="stat-value ${attClass}">${mp.attendance}%</span>
                            <span class="stat-label">Attendance</span>
                        </div>
                        <div class="stat-item" title="Questions Asked">
                            <span class="stat-value">${mp.questions}</span>
                            <span class="stat-label">Questions</span>
                        </div>
                        <div class="stat-item" title="Debates Participated">
                            <span class="stat-value">${mp.debates}</span>
                            <span class="stat-label">Debates</span>
                        </div>
                        <div class="stat-item" title="Declared Criminal Cases">
                            <span class="stat-value ${mp.cases > 0 ? 'highlight-red' : 'highlight-green'}">${mp.cases}</span>
                            <span class="stat-label">Cases</span>
                        </div>
                    </div>
                </div>
            `;
            // Add the new card to the grid
            gridContainer.innerHTML += cardHTML;
        });
    };

    // === 4. FILTER AND SORT FUNCTION ===
    // This function runs every time you type or change the sort
    const filterAndSort = () => {
        const searchTerm = searchBar.value.toLowerCase();
        const sortValue = sortSelect.value;

        // 1. Filter the list
        let filteredMPs = mps_data.filter(mp => {
            const nameMatch = mp.name.toLowerCase().includes(searchTerm);
            const constMatch = mp.constituency.toLowerCase().includes(searchTerm);
            return nameMatch || constMatch;
        });

        // 2. Sort the filtered list
        switch (sortValue) {
            case 'attendance_high':
                filteredMPs.sort((a, b) => b.attendance - a.attendance);
                break;
            case 'attendance_low':
                filteredMPs.sort((a, b) => a.attendance - b.attendance);
                break;
            case 'cases_high':
                filteredMPs.sort((a, b) => b.cases - a.cases);
                break;
            case 'questions_high':
                filteredMPs.sort((a, b) => b.questions - a.questions);
                break;
            case 'constituency_az':
                filteredMPs.sort((a, b) => a.constituency.localeCompare(b.constituency));
                break;
            case 'constituency_za':
                filteredMPs.sort((a, b) => b.constituency.localeCompare(a.constituency));
                break;
            // 'default' case needs no sorting
        }

        // 3. Re-render the grid with the new list
        renderMPs(filteredMPs);
    };

    // === 5. ADD EVENT LISTENERS ===
    searchBar.addEventListener('input', filterAndSort);
    sortSelect.addEventListener('change', filterAndSort);

    // === 6. INITIAL RENDER ===
    // Render the full list of MPs when the page first loads
    renderMPs(mps_data);

});
