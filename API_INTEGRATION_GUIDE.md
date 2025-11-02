# API Integration Guide

## Overview
The MP Tracker site includes AI-powered data gathering and validation using Gemini or OpenAI APIs. The system is designed to:
- Automatically gather MP/MLA information from trusted sources
- Validate data from multiple sources before adding
- Only add complete profiles (minimum 5 out of 7 required fields)
- Run scheduled updates at 3:07 AM daily
- Display a haunted pumpkin animation during updates

## Setup Instructions

### 1. Configure API Keys

The system supports both Gemini and OpenAI APIs. You need at least one API key configured.

#### For Gemini API:
```javascript
localStorage.setItem('gemini_api_key', 'YOUR_GEMINI_API_KEY');
```

#### For OpenAI API:
```javascript
localStorage.setItem('openai_api_key', 'YOUR_OPENAI_API_KEY');
```

**To set API keys:**
1. Open the site in your browser
2. Open browser console (F12)
3. Run one of the commands above with your actual API key
4. Refresh the page

### 2. Required Data Fields

For each MP/MLA, the system requires at least 5 of these 7 fields:
- **Name**: Full name of the representative
- **Constituency**: Electoral constituency
- **Party**: Political party affiliation
- **Attendance**: Attendance percentage in parliament/assembly
- **Questions**: Number of questions asked
- **Debates**: Number of debates participated in
- **Criminal Cases**: Information about any criminal cases

### 3. Trusted Data Sources

The system validates data from these trusted sources:
- loksabha.gov.in (Lok Sabha official website)
- rajyasabha.gov.in (Rajya Sabha official website)
- eci.gov.in (Election Commission of India)
- myneta.info (Association for Democratic Reforms)
- prsindia.org (PRS Legislative Research)

Data must be verified from at least 2 trusted sources before being added.

### 4. Scheduled Updates

The system checks for updates at **3:07 AM** daily. When an update occurs:
1. A haunted overlay appears on the site
2. A glowing pumpkin animation is displayed
3. Data is fetched from the AI API
4. Each entry is validated from multiple sources
5. Only complete profiles are added to the database
6. A notification shows how many records were updated

### 5. Manual Testing

To manually trigger an update for testing:

```javascript
// Open browser console and run:
window.aiDataManager.performDataUpdate();
```

This will:
- Show the pumpkin animation
- Display the haunted overlay
- Show an update notification
- (In production, it would fetch and validate actual data)

### 6. Implementation Notes

#### For Static GitHub Pages Deployment:
- The scheduled updates at 3:07 AM work when users have the site open
- For true automated updates without user interaction, you need a server-side solution
- Consider using:
  - GitHub Actions with scheduled workflows
  - Netlify/Vercel serverless functions
  - A dedicated backend server

#### Server-Side Implementation:
For production deployment with automated updates:

1. **GitHub Actions Approach:**
   - Create a workflow that runs at 3:07 AM
   - Fetches data using the API
   - Validates and updates data files
   - Commits changes to the repository
   - GitHub Pages automatically deploys updated content

2. **Serverless Function Approach:**
   - Deploy serverless functions on Netlify/Vercel
   - Schedule them to run at 3:07 AM
   - Update a database or JSON files
   - Frontend fetches updated data

3. **Backend Server Approach:**
   - Set up a Node.js/Python server
   - Use cron jobs for scheduling
   - Maintain a database with MP information
   - Provide API endpoints for the frontend

## Features

### AI-Powered Data Gathering
- Intelligent prompts instruct the AI to gather specific information
- AI is instructed to verify from multiple sources
- Only complete profiles are returned

### Data Validation
- Multi-source verification required
- Minimum field requirements enforced
- Incomplete data is rejected

### User Experience
- Haunted pumpkin animation during updates
- Visual notification of successful updates
- Non-intrusive background processing

### Security
- API keys stored in localStorage (client-side only)
- Never commit API keys to repository
- Use environment variables for production

## Example Data Structure

```json
{
  "name": "Sample MP Name",
  "constituency": "Sample Constituency",
  "party": "Sample Party",
  "attendance": "85%",
  "questions": 45,
  "debates": 23,
  "criminal_cases": "None",
  "sources": [
    "loksabha.gov.in",
    "myneta.info"
  ]
}
```

## Troubleshooting

### Animation Not Showing
- Ensure `pumpkin-animation.css` is properly linked in all HTML files
- Check browser console for JavaScript errors

### Updates Not Running
- Verify API key is set: `localStorage.getItem('gemini_api_key')`
- Check browser console for error messages
- Ensure correct time format (24-hour: "03:07")

### CORS Issues
- Some APIs may require server-side proxy
- Consider using serverless functions to avoid CORS

## Future Enhancements

- [ ] Implement actual AI API integration
- [ ] Add data export functionality
- [ ] Create admin dashboard for data management
- [ ] Implement real-time notifications
- [ ] Add data visualization charts
- [ ] Support for historical data tracking

## Support

For issues or questions:
- Email: anujmeena2025@gmail.com
- GitHub Issues: [Report a bug](https://github.com/anacondy/MP-tracker-site-/issues)
