# MP Tracker Site - Project Documentation

## **Pre-Existing Structure**
- **Legislation Section**: Hardcoded data, no real-time updates.
- **Know Your Rep Section**: Basic search, no sorting/filtering.
- **Dark Mode**: Inconsistent toggle functionality.
- **UI**: Default system dropdowns, unoptimized scrollbar.
- **Performance**: No minification, lazy loading, or GPU acceleration.

## **Changes Made So Far**
### **1. Automated Data Updates**
- **`scripts/fetch_data.py`**: Fetches legislative data from PRS India & Lok Sabha, cross-verifies, and saves to `data/legislation.json`.
- **GitHub Actions Workflow**: Runs daily at midnight, updates data, and commits changes.

### **2. Repository Changes**
- **New Branch**: `feature/automated-data-updates`
- **Files Added**:
  - `scripts/fetch_data.py`
  - `.github/workflows/update_legislation.yml`

## **Upcoming Changes**
### **1. Performance Optimization**
- Minify CSS/JS.
- Implement lazy loading for images.
- GPU acceleration for animations.
- Debounce scroll/resize events.

### **2. Responsive Design**
- Media queries for all screen sizes.
- Flexbox/Grid for fluid layouts.
- Viewport meta tag for mobile scaling.

### **3. Dark Mode & UI Tweaks**
- CSS variables for theming.
- LocalStorage for user preferences.
- Custom dropdowns and pink/crimson scrollbar.

### **4. Documentation**
- Update `project.md` with progress.

## **Reasoning**
- **Performance**: Ensure smooth 60 FPS on low-end devices.
- **Responsiveness**: Accessibility across all devices.
- **Robustness**: Reliable dark mode and data updates.
- **Aesthetics**: Custom UI to match site theme.

## **Final Goal**
- **Legislation Section**: Auto-updates daily with verified data.
- **Know Your Rep**: Search/sort by name, constituency, attendance, etc.
- **UI/UX**: Smooth, responsive, dark mode toggle, custom components.
- **Performance**: Optimized for all devices, high refresh rates.