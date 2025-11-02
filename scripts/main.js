/*
  File: scripts/main.js
  This script handles the theme switching and MP card ripple effect.
*/

document.addEventListener('DOMContentLoaded', () => {

    // === NEW: Theme Toggle Switch ===
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    const htmlElement = document.documentElement;

    // Function to set theme based on checkbox
    function toggleTheme() {
        if (themeToggle.checked) {
            // If checked, it's LIGHT mode
            htmlElement.classList.add('light-mode');
            htmlElement.classList.remove('dark-mode');
        } else {
            // If not checked, it's DARK mode
            htmlElement.classList.add('dark-mode');
            htmlElement.classList.remove('light-mode');
        }
    }

    // Add click event listener
    themeToggle.addEventListener('click', toggleTheme);

    // Set initial state of the toggle
    // We default to dark mode, so the checkbox should be UNCHECKED
    if (htmlElement.classList.contains('light-mode')) {
        themeToggle.checked = true;
    } else {
        themeToggle.checked = false;
    }


    // === MP Card Ripple Effect (No Change) ===
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
});
