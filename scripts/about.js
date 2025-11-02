/*
  File: scripts/about.js
  Handles the About page functionality including feedback form and trace ID display
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // Display user's trace ID
    const traceIdElement = document.getElementById('user-trace-id');
    if (traceIdElement) {
        const traceId = localStorage.getItem('userTraceId') || 'Not set';
        traceIdElement.textContent = traceId;
    }

    // Handle feedback form submission
    const feedbackForm = document.getElementById('feedback-form');
    const successMessage = document.getElementById('feedback-success');

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = {
                type: document.getElementById('feedback-type').value,
                email: document.getElementById('feedback-email').value,
                message: document.getElementById('feedback-message').value,
                traceId: localStorage.getItem('userTraceId'),
                timestamp: new Date().toISOString()
            };

            // Sanitize input (basic XSS prevention)
            formData.message = sanitizeInput(formData.message);
            formData.email = sanitizeInput(formData.email);

            // Store feedback in localStorage (in a real app, this would be sent to a server)
            storeFeedback(formData);

            // Show success message
            successMessage.style.display = 'block';
            feedbackForm.reset();

            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        });
    }
});

// Sanitize user input to prevent XSS
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Store feedback locally (in production, send to server)
function storeFeedback(formData) {
    const feedbackKey = 'feedback_submissions';
    let feedbacks = JSON.parse(localStorage.getItem(feedbackKey) || '[]');
    
    // Add new feedback
    feedbacks.push(formData);
    
    // Keep only last 50 submissions
    if (feedbacks.length > 50) {
        feedbacks = feedbacks.slice(-50);
    }
    
    localStorage.setItem(feedbackKey, JSON.stringify(feedbacks));
    console.log('Feedback stored successfully');
}

// Share website function
function shareWebsite() {
    const shareData = {
        title: 'MP Tracker',
        text: 'Track Indian MPs and legislation with MP Tracker!',
        url: window.location.origin
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Shared successfully'))
            .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback: copy URL to clipboard
        navigator.clipboard.writeText(window.location.origin)
            .then(() => {
                alert('Website URL copied to clipboard!');
            })
            .catch(() => {
                alert('Please copy this URL to share: ' + window.location.origin);
            });
    }
}
