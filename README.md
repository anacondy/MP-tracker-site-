# MP Tracker - Indian Parliamentary Tracker 🇮🇳

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

A modern, transparent, and user-friendly web application for tracking Indian Members of Parliament (MPs), their performance, and legislative activities.

![MP Tracker Banner](https://via.placeholder.com/1200x400/0a0a0a/3b9aff?text=MP+Tracker+-+Track+Your+Representatives)

## ✨ Features

### 🏛️ Core Functionality
- **MP Directory**: Browse through comprehensive profiles of Indian MPs
- **Legislation Tracker**: Track bills, amendments, and their status in Parliament
- **Know Your Rep**: Search and filter MPs by name, constituency, party, or alliance
- **Performance Metrics**: View attendance, questions asked, debates participated, and more

### 🎨 Design & UX
- **Dark/Light Mode**: Beautiful theme toggle with persistent preferences across pages
- **Frosted Glass UI**: Modern glassmorphism design with transparent, blurred backgrounds
- **Smooth Animations**: Fluid transitions and hover effects for enhanced user experience
- **Mobile Optimized**: Fully responsive design for 16:9 and 20:9 aspect ratio devices

### 🔒 Security & Privacy
- **Anonymous Browsing**: Trace ID system for anonymous user tracking
- **Content Security Policy**: CSP headers to prevent XSS attacks
- **Input Sanitization**: All user inputs are sanitized to prevent security vulnerabilities
- **No Personal Data Collection**: Privacy-first approach

### 💾 Technology
- **IndexedDB Integration**: Client-side database for efficient search and data management
- **Advanced Search**: Search by name, constituency, or party name
- **Progressive Enhancement**: Works even with JavaScript disabled for basic features
- **No External Dependencies**: Lightweight and fast-loading

### 📱 User Features
- **Feedback System**: Submit feedback, bug reports, and feature requests
- **About Page**: Learn about the project and its mission
- **Support Options**: Contribute, donate, or spread the word

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A local web server (optional, for development)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/anacondy/MP-tracker-site-.git
cd MP-tracker-site-
```

2. **Open in browser**
```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000

# Or simply open index.html in your browser
```

3. **Navigate to**
```
http://localhost:8000
```

## 📂 Project Structure

```
MP-tracker-site-/
├── index.html              # MP Directory (Home page)
├── legislation.html        # Legislation tracker
├── legislation_detail.html # Bill details page
├── know_your_rep.html      # Search and filter MPs
├── about.html              # About page with feedback form
├── styles/
│   ├── main.css           # Main styles and layout
│   ├── themes.css         # Dark/Light theme variables
│   └── about.css          # About page specific styles
├── scripts/
│   ├── main.js            # Theme toggle and trace ID
│   ├── filter.js          # MP filtering and sorting
│   ├── database.js        # IndexedDB implementation
│   └── about.js           # Feedback form handling
├── LICENSE                # MIT License
└── README.md             # This file
```

## 🎯 Pages Overview

### 🏠 MP Directory (index.html)
Browse through MP profiles with photos, party affiliations, and constituencies.

![MP Directory](https://via.placeholder.com/800x500/0a0a0a/3b9aff?text=MP+Directory)

### 📜 Legislation (legislation.html)
Track important bills and legislation with status indicators.

![Legislation Tracker](https://via.placeholder.com/800x500/0a0a0a/3b9aff?text=Legislation+Tracker)

### 🔍 Know Your Rep (know_your_rep.html)
Search and filter MPs with advanced sorting options.

![Know Your Rep](https://via.placeholder.com/800x500/0a0a0a/3b9aff?text=Know+Your+Rep)

### ℹ️ About (about.html)
Learn about the project, submit feedback, and support the initiative.

![About Page](https://via.placeholder.com/800x500/0a0a0a/3b9aff?text=About+Page)

## 🌈 Theme System

The site supports both dark and light modes with smooth transitions:

- **Dark Mode**: Deep blacks with vibrant accents (default)
- **Light Mode**: Clean whites with professional tones
- **Persistent**: Theme choice is saved and persists across pages
- **Smooth Transitions**: 0.4s ease transitions for comfortable viewing

## 🔍 Search Features

### Advanced Search Capabilities
- Search by **MP Name**: Find specific representatives
- Search by **Constituency**: Discover MPs from your area
- Search by **Party Name**: Filter by political affiliation
- **Universal Search**: Searches across all fields simultaneously

### IndexedDB Integration
- Client-side database for faster searches
- Offline capability for previously loaded data
- Efficient indexing for quick results

## 🛡️ Security Features

### Implemented Protections
1. **Content Security Policy (CSP)**: Prevents XSS attacks
2. **Input Sanitization**: All user inputs are sanitized
3. **No Inline Event Handlers**: Secure JavaScript execution
4. **Anonymous Tracking**: Privacy-preserving trace IDs
5. **HTTPS Ready**: Secure communication ready

## 🎨 Design Philosophy

### Visual Design
- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Color Consistency**: Carefully chosen color palettes for both themes
- **Typography**: Inter font family for clean, readable text
- **Spacing**: Generous whitespace for comfortable reading

### User Experience
- **Mobile First**: Optimized for touch devices
- **Progressive Disclosure**: Information revealed as needed
- **Feedback**: Visual feedback for all interactions
- **Accessibility**: Semantic HTML and ARIA labels

## 📱 Mobile Optimization

### Responsive Breakpoints
- **Desktop**: 1200px+ (Full layout)
- **Tablet**: 768px - 1199px (Adapted layout)
- **Mobile**: <768px (Stacked layout)

### Device Support
- ✅ 16:9 aspect ratio (most phones)
- ✅ 20:9 aspect ratio (modern phones)
- ✅ Tablet devices
- ✅ Desktop browsers

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report Bugs**: Use the feedback form on the About page
2. **Suggest Features**: Share your ideas through feedback
3. **Submit Pull Requests**: Fork, improve, and submit PRs
4. **Improve Documentation**: Help make the docs better
5. **Share**: Spread the word about MP Tracker

### Development Guidelines
- Follow existing code style and conventions
- Test on multiple browsers before submitting
- Ensure mobile responsiveness
- Maintain theme consistency
- Add comments for complex logic

## 🗺️ Roadmap

### Upcoming Features
- [ ] Real-time data integration with parliamentary APIs
- [ ] More detailed MP profiles with voting history
- [ ] Advanced analytics and visualizations
- [ ] Multi-language support (Hindi, regional languages)
- [ ] Email notifications for bill updates
- [ ] PDF export for reports
- [ ] Comparison tool for MPs
- [ ] Historical data and trends

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Data sources: Lok Sabha and Rajya Sabha official records
- Design inspiration: Modern web design principles
- Community: Thanks to all contributors and users

## 📞 Contact & Support

- **Feedback**: Use the feedback form on the About page
- **Issues**: Report bugs through GitHub Issues
- **Email**: [Your contact email]
- **Website**: [Your website URL]

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

**Made with ❤️ for Indian democracy and transparency**

![Footer](https://via.placeholder.com/1200x100/0a0a0a/3b9aff?text=Empowering+Citizens+Through+Information)
