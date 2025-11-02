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
            traceId = 'trace_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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

    // Load saved theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark-mode';
    htmlElement.className = savedTheme;
    
    // Set checkbox state based on saved theme
    themeToggle.checked = (savedTheme === 'light-mode');

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
});
