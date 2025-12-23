# MP Tracker Site - Project Documentation

## **Pre-Existing Structure**
- **Legislation Section**: Hardcoded data, no real-time updates.
- **Know Your Rep Section**: Basic search, no sorting or filtering.
- **Dark Mode**: Inconsistent toggle functionality.
- **UI**: Default system dropdowns, unoptimized scrollbar.

## **Changes Made**

### **1. Automated Data Updates**
- **`scripts/fetch_data.py`**: Fetches legislative data from PRS India and Lok Sabha.
- **`.github/workflows/update_legislation.yml`**: GitHub Actions workflow for daily updates.

### **2. Performance Optimization**
- **Minified CSS/JS**: Reduced file sizes for faster loading.
- **Lazy Loading**: Implemented for images and non-critical resources.
- **GPU Acceleration**: Used `transform: translateZ(0)` and `will-change` for animations.
- **Debounced Events**: Prevented performance drops due to frequent scroll/resize events.

### **3. Responsive Design**
- **Media Queries**: Added for all screen sizes (mobile, tablet, desktop).
- **Flexbox/Grid Layout**: Used for fluid layouts.
- **Viewport Meta Tag**: Ensured proper scaling on mobile devices.

### **4. Robust Dark Mode**
- **CSS Variables**: Used for easy theme switching.
- **LocalStorage**: Saved user preferences for dark/light mode.
- **Consistent Toggle**: Ensured the toggle works across all pages.

### **5. Custom UI Components**
- **Custom Dropdown**: Replaced default dropdowns with styled components.
- **Scrollbar Styling**: Styled to match the site’s theme.

## **Reasoning**
- **Performance**: Ensured smooth experience on low-end devices.
- **Responsiveness**: Accessibility across all devices.
- **Robustness**: Reliable dark mode and data updates.

## **Next Steps**
- **Test on Multiple Devices**: Ensure compatibility.
- **Final Review**: Check for any remaining issues.
- **Merge to Main**: Once approved, merge changes to the `main` branch.