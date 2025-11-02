# API Integration Guide - How to Add Your API

This guide explains how to integrate your own API with the MP Tracker site and where to use it.

## Table of Contents
1. [Overview](#overview)
2. [Setting Up Your API Key](#setting-up-your-api-key)
3. [Where to Add Your API](#where-to-add-your-api)
4. [API Integration Points](#api-integration-points)
5. [Examples](#examples)
6. [Security Considerations](#security-considerations)

---

## Overview

The MP Tracker site supports integration with AI APIs (Gemini or OpenAI) for automated data updates, as well as custom APIs for various features. This guide will help you understand where and how to integrate your API.

---

## Setting Up Your API Key

### For AI-Powered Data Updates (Gemini or OpenAI)

The site already has built-in support for Gemini and OpenAI APIs. To use them:

#### Option 1: Using Browser Console
Open your browser's developer console and run:

```javascript
// For Gemini API
localStorage.setItem('gemini_api_key', 'YOUR_GEMINI_API_KEY_HERE');

// For OpenAI API
localStorage.setItem('openai_api_key', 'YOUR_OPENAI_API_KEY_HERE');
```

#### Option 2: Directly in the Code
Edit the file: `scripts/api-integration.js`

```javascript
const API_CONFIG = {
    GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY_HERE',
    OPENAI_API_KEY: 'YOUR_OPENAI_API_KEY_HERE',
    UPDATE_TIME: '03:07', // Time for scheduled updates
    MIN_DATA_FIELDS: 5,
};
```

---

## Where to Add Your API

### 1. **MP Data Fetching API**

**File**: `scripts/api-integration.js`

**Location**: Lines 177-303 (functions `fetchMPData`, `fetchFromGemini`, `fetchFromOpenAI`)

**Purpose**: Fetch MP/MLA information from external sources

**How to Add**:

```javascript
// Add your custom API function
async fetchFromCustomAPI() {
    const API_ENDPOINT = 'https://your-api-endpoint.com/api/mps';
    const API_KEY = 'your_api_key_here';
    
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            }
        });
        
        const data = await response.json();
        return data; // Should return array of MP objects
    } catch (error) {
        console.error('Custom API error:', error);
        return [];
    }
}
```

Then modify the `fetchMPData` function to use your custom API:

```javascript
async fetchMPData() {
    // Use your custom API
    return await this.fetchFromCustomAPI();
}
```

---

### 2. **Active Users Tracking API**

**File**: `scripts/main.js`

**Location**: Line 154-168 (function `getAllTraceIds`)

**Purpose**: Fetch real active users from your backend

**How to Add**:

```javascript
async function getAllTraceIds() {
    const API_ENDPOINT = 'https://your-backend.com/api/active-users';
    
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();
        return data.traceIds; // Should return array of trace IDs
    } catch (error) {
        console.error('Failed to fetch active users:', error);
        // Fallback to mock data
        const currentTraceId = localStorage.getItem('userTraceId');
        return [currentTraceId];
    }
}
```

**Backend Requirements**:
- Your API should return JSON in this format:
```json
{
    "traceIds": [
        "trace_1234567890_abc123",
        "trace_1234567891_def456",
        "trace_1234567892_ghi789"
    ],
    "count": 3
}
```

---

### 3. **Feedback Submission API**

**File**: `scripts/about.js`

**Location**: Line 61-76 (function `storeFeedback`)

**Purpose**: Submit user feedback to your backend instead of localStorage

**How to Add**:

```javascript
async function storeFeedback(formData) {
    const API_ENDPOINT = 'https://your-backend.com/api/feedback';
    
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            console.log('Feedback submitted successfully');
            return true;
        } else {
            throw new Error('Failed to submit feedback');
        }
    } catch (error) {
        console.error('Feedback submission error:', error);
        // Fallback to localStorage
        localStorage.setItem('feedback_submissions', JSON.stringify([formData]));
        return false;
    }
}
```

---

### 4. **MP Search API**

**File**: `scripts/filter.js` (if it exists) or create new functionality

**Purpose**: Search MPs from your backend database

**How to Add**:

Create a new file `scripts/search-api.js`:

```javascript
class MPSearchAPI {
    constructor(apiKey, baseURL) {
        this.apiKey = apiKey;
        this.baseURL = baseURL || 'https://your-api.com/api';
    }

    async searchMPs(query, filters = {}) {
        const endpoint = `${this.baseURL}/search`;
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    query: query,
                    filters: filters
                })
            });

            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Search API error:', error);
            return [];
        }
    }

    async getMPById(mpId) {
        const endpoint = `${this.baseURL}/mps/${mpId}`;
        
        try {
            const response = await fetch(endpoint, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            return await response.json();
        } catch (error) {
            console.error('Get MP error:', error);
            return null;
        }
    }
}

// Initialize and use
const searchAPI = new MPSearchAPI('your_api_key', 'https://your-api.com/api');

// Example usage
searchAPI.searchMPs('Gandhi', { party: 'INC' })
    .then(results => {
        console.log('Search results:', results);
        // Display results in UI
    });
```

Then add the script to your HTML:

```html
<script src="scripts/search-api.js"></script>
```

---

## API Integration Points

Here's a summary of where you can integrate different APIs:

| Feature | File | Function | Purpose |
|---------|------|----------|---------|
| AI Data Updates | `api-integration.js` | `fetchMPData()` | Fetch MP data from AI or custom API |
| Active Users | `main.js` | `getAllTraceIds()` | Get list of active users |
| Feedback | `about.js` | `storeFeedback()` | Submit feedback to backend |
| User Analytics | `main.js` | `getOrCreateTraceId()` | Track users with your analytics API |
| MP Search | Custom | Create new | Search and filter MPs from backend |

---

## Examples

### Example 1: Track Page Views

Add this to `main.js`:

```javascript
// Track page view
async function trackPageView() {
    const traceId = localStorage.getItem('userTraceId');
    const API_ENDPOINT = 'https://your-analytics.com/api/pageview';
    
    try {
        await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                traceId: traceId,
                page: window.location.pathname,
                timestamp: new Date().toISOString()
            })
        });
    } catch (error) {
        console.error('Analytics error:', error);
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', trackPageView);
```

### Example 2: Real-time Active Users

Modify `getAllTraceIds()` in `main.js` to fetch from your WebSocket or polling API:

```javascript
async function getAllTraceIds() {
    const API_ENDPOINT = 'https://your-backend.com/api/active-users';
    
    try {
        const response = await fetch(API_ENDPOINT);
        const data = await response.json();
        return data.activeUsers || [];
    } catch (error) {
        console.error('Failed to fetch active users:', error);
        return [localStorage.getItem('userTraceId')];
    }
}

// Poll for updates every 30 seconds
setInterval(() => {
    // Update active user count if modal is open
    if (document.getElementById('active-users-modal')) {
        getAllTraceIds().then(users => {
            // Update the UI with new count
        });
    }
}, 30000);
```

---

## Security Considerations

### ⚠️ Important Security Tips

1. **Never expose API keys in frontend code**
   - Use environment variables or backend proxy
   - Store sensitive keys on your server

2. **Use Backend Proxy**
   - Create a backend service to handle API calls
   - Frontend calls your backend, backend calls external APIs

3. **Example Backend Proxy Setup (Node.js)**:

```javascript
// server.js (Backend)
const express = require('express');
const app = express();

app.post('/api/fetch-mp-data', async (req, res) => {
    const API_KEY = process.env.GEMINI_API_KEY; // Stored securely
    
    try {
        const response = await fetch('https://api.gemini.com/...', {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(3000);
```

Then in your frontend:

```javascript
// scripts/api-integration.js
async fetchMPData() {
    // Call your backend instead of external API directly
    const response = await fetch('/api/fetch-mp-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
}
```

4. **CORS Configuration**
   - Configure CORS on your backend to only allow your domain
   - Set proper headers to prevent unauthorized access

5. **Rate Limiting**
   - Implement rate limiting on your API endpoints
   - Prevent abuse and excessive API calls

---

## Testing Your API Integration

### 1. Test in Browser Console

```javascript
// Test AI data fetch
window.aiDataManager.performDataUpdate();

// Test active users
getAllTraceIds().then(ids => console.log('Active users:', ids));

// Test feedback submission
const testFeedback = {
    type: 'test',
    message: 'Testing API',
    traceId: localStorage.getItem('userTraceId')
};
storeFeedback(testFeedback);
```

### 2. Check Network Tab
- Open Developer Tools → Network tab
- Trigger your API calls
- Verify requests are being made correctly
- Check response data format

### 3. Error Handling
Make sure your API integration handles errors gracefully:

```javascript
try {
    const data = await yourAPICall();
    // Process data
} catch (error) {
    console.error('API Error:', error);
    // Fallback to cached data or show error message
}
```

---

## Need Help?

- Check the existing API integration in `scripts/api-integration.js` for reference
- Review the browser console for error messages
- Test with mock data first before connecting to real APIs
- Contact: anujmeena2025@gmail.com for support

---

## Additional Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Fetch API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**Built by anacondy with puppy pilot 🐕‍🦺**
