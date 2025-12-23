// Minified and Optimized JavaScript
// Dark Mode Toggle with LocalStorage
const toggle = document.getElementById('dark-mode-toggle');
const body = document.body;

if (toggle) {
  toggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
  });
}

// Check for saved preference
if (localStorage.getItem('darkMode') === 'true') {
  body.classList.add('dark-mode');
}

// Lazy Loading for Images
if ('loading' in HTMLImageElement.prototype) {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  lazyImages.forEach(img => {
    img.src = img.dataset.src;
  });
}

// Debounce Scroll/Resize Events
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

// GPU Acceleration for Animations
window.addEventListener('load', () => {
  const elements = document.querySelectorAll('.fade-in');
  elements.forEach(el => {
    el.style.willChange = 'transform, opacity';
  });
});