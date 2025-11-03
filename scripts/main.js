/*
  File: scripts/main.js
  This script handles the theme switching, MP card ripple effect, and user trace ID.
*/

document.addEventListener('DOMContentLoaded', () => {

    // === TRACE ID FEATURE ===
    // Generate or retrieve anonymous trace ID for the user
    function getOrCreateTraceId() {
        let traceId = localStorage.getItem('userTraceId');
        if (!traceId) {
            // Generate a unique trace ID
            traceId = 'trace_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
            localStorage.setItem('userTraceId', traceId);
            console.log('New trace ID created:', traceId);
        }
        return traceId;
    }

    // Initialize trace ID
    const userTraceId = getOrCreateTraceId();

    // === THEME TOGGLE SWITCH WITH PERSISTENCE ===
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    const htmlElement = document.documentElement;

    // Function to detect system theme preference
    function getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light-mode';
        }
        return 'dark-mode';
    }

    // Load saved theme from localStorage or use system preference
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || getSystemTheme();
    htmlElement.className = initialTheme;
    
    // Set checkbox state based on theme
    themeToggle.checked = (initialTheme === 'light-mode');

    // Function to set theme based on checkbox
    function toggleTheme() {
        if (themeToggle.checked) {
            // If checked, it's LIGHT mode
            htmlElement.className = 'light-mode';
            localStorage.setItem('theme', 'light-mode');
        } else {
            // If not checked, it's DARK mode
            htmlElement.className = 'dark-mode';
            localStorage.setItem('theme', 'dark-mode');
        }
    }

    // Add click event listener
    themeToggle.addEventListener('click', toggleTheme);

    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
            // Only update if user hasn't manually set a preference
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'light-mode' : 'dark-mode';
                htmlElement.className = newTheme;
                themeToggle.checked = (newTheme === 'light-mode');
            }
        });
    }


    // === MP Card Ripple Effect ===
    const mpCards = document.querySelectorAll('.mp-card');

    mpCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Check if the click is on a link *inside* the card
            if (e.target.closest('a')) {
                return; // Don't run ripple if a link was clicked
            }

            // Remove any existing ripple effect
            const existingRipple = card.querySelector('.ripple-effect');
            if (existingRipple) {
                existingRipple.remove();
            }

            // Create the ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            card.appendChild(ripple);

            // Get position of the click
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            // Remove the ripple element after animation
            ripple.addEventListener('animationend', () => {
                if (ripple) {
                    ripple.remove();
                }
            });
        });
    });

    // === FIX MP PHOTO CARDS: Hide initials when image loads successfully ===
    const mpPhotos = document.querySelectorAll('.mp-photo');
    
    mpPhotos.forEach(photoContainer => {
        const img = photoContainer.querySelector('img');
        const initials = photoContainer.querySelector('.mp-initials');
        
        if (img && initials) {
            // Hide initials initially if image src is valid
            if (img.complete && img.naturalWidth > 0) {
                // Image already loaded
                initials.style.display = 'none';
            } else {
                // Show initials by default
                initials.style.display = 'flex';
                
                // When image loads successfully, hide initials
                img.addEventListener('load', () => {
                    initials.style.display = 'none';
                });
                
                // If image fails to load, keep showing initials
                img.addEventListener('error', () => {
                    initials.style.display = 'flex';
                    img.style.display = 'none'; // Hide broken image
                });
            }
        }
    });

    // === F+S KEYBOARD SHORTCUT: Show Active Users ===
    let fPressed = false;
    let sPressed = false;
    let keyPressTimer = null;
    let keyPressStartTime = null;

    function showActiveUsers() {
        // Create overlay and modal if they don't exist
        if (!document.getElementById('active-users-overlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'active-users-overlay';
            overlay.className = 'active-users-overlay';
            
            const modal = document.createElement('div');
            modal.id = 'active-users-modal';
            modal.className = 'active-users-modal';
            
            // Get all trace IDs from localStorage
            const traceIds = getAllTraceIds();
            
            modal.innerHTML = `
                <div class="modal-header">
                    <span class="material-icons">people</span>
                    <h2>Active Users on Site</h2>
                    <button class="close-btn" onclick="hideActiveUsers()">
                        <span class="material-icons">close</span>
                    </button>
                </div>
                <div class="modal-content">
                    <div class="user-count">
                        <span class="material-icons">groups</span>
                        <p><strong>${traceIds.length}</strong> ${traceIds.length === 1 ? 'User' : 'Users'} Currently Active</p>
                    </div>
                    <div class="trace-ids-list">
                        ${traceIds.map(id => `
                            <div class="trace-id-item">
                                <span class="material-icons">fingerprint</span>
                                <code>${id}</code>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            document.body.appendChild(overlay);
            document.body.appendChild(modal);
            
            // Add event listeners
            overlay.addEventListener('click', hideActiveUsers);
            
            // Animate in
            setTimeout(() => {
                overlay.classList.add('active');
                modal.classList.add('active');
            }, 10);
        }
    }

    function hideActiveUsers() {
        const overlay = document.getElementById('active-users-overlay');
        const modal = document.getElementById('active-users-modal');
        
        if (overlay && modal) {
            overlay.classList.remove('active');
            modal.classList.remove('active');
            
            setTimeout(() => {
                overlay.remove();
                modal.remove();
            }, 300);
        }
    }

    function getAllTraceIds() {
        // In a real scenario, this would fetch from a server
        // For now, we'll simulate with the current user's trace ID
        const currentTraceId = localStorage.getItem('userTraceId');
        const traceIds = [currentTraceId];
        
        // Simulate additional users by generating mock trace IDs
        // In production, this would come from your backend API
        const mockUserCount = Math.floor(Math.random() * 10) + 1; // 1-10 users
        for (let i = 1; i < mockUserCount; i++) {
            traceIds.push('trace_' + (Date.now() + i) + '_' + Math.random().toString(36).substring(2, 11));
        }
        
        return traceIds;
    }

    // Make hideActiveUsers available globally
    window.hideActiveUsers = hideActiveUsers;

    // Key press handlers
    document.addEventListener('keydown', (e) => {
        // Check for F key
        if (e.key === 'f' || e.key === 'F') {
            if (!fPressed) {
                fPressed = true;
                checkBothKeysPressed();
            }
        }
        
        // Check for S key
        if (e.key === 's' || e.key === 'S') {
            if (!sPressed) {
                sPressed = true;
                checkBothKeysPressed();
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        // Release F key
        if (e.key === 'f' || e.key === 'F') {
            fPressed = false;
            resetKeyPressTimer();
        }
        
        // Release S key
        if (e.key === 's' || e.key === 'S') {
            sPressed = false;
            resetKeyPressTimer();
        }
    });

    function checkBothKeysPressed() {
        if (fPressed && sPressed && !keyPressTimer) {
            // Both keys are pressed, start timer
            keyPressStartTime = Date.now();
            keyPressTimer = setTimeout(() => {
                // 3 seconds have passed
                showActiveUsers();
            }, 3000);
        }
    }

    function resetKeyPressTimer() {
        if (keyPressTimer) {
            clearTimeout(keyPressTimer);
            keyPressTimer = null;
            keyPressStartTime = null;
        }
    }
});
