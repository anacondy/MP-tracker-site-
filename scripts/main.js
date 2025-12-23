// Dark Mode Toggle
const toggle = document.getElementById('dark-mode-toggle');
const body = document.body;

if (toggle) {
  toggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
  });
}

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
  body.classList.add('dark-mode');
}

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