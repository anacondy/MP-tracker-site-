// Theme Toggle using checkbox
const themeToggle = document.getElementById('theme-toggle-checkbox');
const html = document.documentElement;

// Initialize theme from localStorage or system preference
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light') {
        html.classList.remove('dark-mode');
        html.classList.add('light-mode');
        if (themeToggle) themeToggle.checked = true;
    } else if (savedTheme === 'dark' || prefersDark) {
        html.classList.add('dark-mode');
        html.classList.remove('light-mode');
        if (themeToggle) themeToggle.checked = false;
    } else {
        // Default to dark mode
        html.classList.add('dark-mode');
        html.classList.remove('light-mode');
        if (themeToggle) themeToggle.checked = false;
    }
}

// Toggle theme
function toggleTheme() {
    if (html.classList.contains('dark-mode')) {
        html.classList.remove('dark-mode');
        html.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark-mode');
        html.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
    }
}

// Add event listener for theme toggle
if (themeToggle) {
    themeToggle.addEventListener('change', toggleTheme);
}

// Initialize theme on page load
initTheme();

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        if (e.matches) {
            html.classList.add('dark-mode');
            html.classList.remove('light-mode');
        } else {
            html.classList.remove('dark-mode');
            html.classList.add('light-mode');
        }
        if (themeToggle) themeToggle.checked = !e.matches;
    }
});

// Debounce function for scroll/resize events
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

// Lazy loading for images
if ('loading' in HTMLImageElement.prototype) {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  lazyImages.forEach(img => {
    img.src = img.dataset.src;
  });
} else {
  // Fallback for browsers without lazy loading support
  const lazyLoadScript = document.createElement('script');
  lazyLoadScript.src = 'https://cdn.jsdelivr.net/npm/vanilla-lazyload@17.3.1/dist/lazyload.min.js';
  document.body.appendChild(lazyLoadScript);
}

// GPU Acceleration for animations
const animatedElements = document.querySelectorAll('.fade-in');
animatedElements.forEach(el => {
  el.style.willChange = 'opacity, transform';
});

// Dropdown functionality
const dropdowns = document.querySelectorAll('.dropdown');
dropdowns.forEach(dropdown => {
  const trigger = dropdown.querySelector('.dropdown-trigger');
  if (trigger) {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      dropdown.querySelector('.dropdown-content').classList.toggle('show');
    });
  }
});

// Close dropdowns when clicking outside
window.addEventListener('click', (e) => {
  dropdowns.forEach(dropdown => {
    if (!dropdown.contains(e.target)) {
      const content = dropdown.querySelector('.dropdown-content');
      if (content && content.classList.contains('show')) {
        content.classList.remove('show');
      }
    }
  });
});