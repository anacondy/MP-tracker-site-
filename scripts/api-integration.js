/*
  File: scripts/api-integration.js
  Handles AI-powered data updates using Gemini or OpenAI API
  Updates data at scheduled times and displays pumpkin animation
*/

// Configuration
const API_CONFIG = {
    // Users should set their API key in localStorage: localStorage.setItem('gemini_api_key', 'YOUR_KEY')
    GEMINI_API_KEY: localStorage.getItem('gemini_api_key') || '',
    OPENAI_API_KEY: localStorage.getItem('openai_api_key') || '',
    UPDATE_TIME: '03:07', // Time for scheduled updates (24-hour format)
    MIN_DATA_FIELDS: 5, // Minimum required fields for an MP entry
};

// Required fields for complete MP data
const REQUIRED_MP_FIELDS = [
    'name',
    'constituency',
    'party',
    'attendance',
    'questions',
    'debates',
    'criminal_cases'
];

// Data validation class
class MPDataValidator {
    constructor() {
        this.trustedSources = [
            'loksabha.gov.in',
            'rajyasabha.gov.in',
            'eci.gov.in',
            'myneta.info',
            'prsindia.org'
        ];
    }

    // Validate if MP data is complete
    isDataComplete(mpData) {
        if (!mpData || typeof mpData !== 'object') return false;
        
        let completedFields = 0;
        for (const field of REQUIRED_MP_FIELDS) {
            if (mpData[field] && mpData[field] !== '' && mpData[field] !== null) {
                completedFields++;
            }
        }
        
        return completedFields >= API_CONFIG.MIN_DATA_FIELDS;
    }

    // Validate data from multiple sources
    async validateFromMultipleSources(mpData) {
        // In a real implementation, this would verify the data across multiple sources
        // For now, we'll simulate the validation
        console.log('Validating MP data from multiple sources:', mpData.name);
        
        // Check if data has source verification
        if (!mpData.sources || mpData.sources.length < 2) {
            console.warn('Insufficient source verification for:', mpData.name);
            return false;
        }
        
        // Verify sources are from trusted list
        const validSources = mpData.sources.filter(source => 
            this.trustedSources.some(trusted => source.includes(trusted))
        );
        
        if (validSources.length < 2) {
            console.warn('Data not verified from trusted sources:', mpData.name);
            return false;
        }
        
        return true;
    }
}

// AI API Integration Manager
class AIDataManager {
    constructor() {
        this.validator = new MPDataValidator();
        this.isUpdating = false;
        this.scheduledUpdateTime = API_CONFIG.UPDATE_TIME;
    }

    // Initialize the data update system
    init() {
        console.log('AI Data Manager initialized');
        
        // Check for scheduled updates
        this.setupScheduledUpdates();
        
        // Check if API keys are configured
        if (!API_CONFIG.GEMINI_API_KEY && !API_CONFIG.OPENAI_API_KEY) {
            console.warn('No API keys configured. Set gemini_api_key or openai_api_key in localStorage.');
            console.info('Example: localStorage.setItem("gemini_api_key", "YOUR_API_KEY")');
        }
    }

    // Setup scheduled updates at specific time
    setupScheduledUpdates() {
        // Check every minute if it's update time, but only when page is visible
        const checkSchedule = () => {
            if (document.visibilityState === 'visible') {
                this.checkScheduledUpdate();
            }
        };
        
        setInterval(checkSchedule, 60000); // Check every minute
        
        // Also check when page becomes visible
        document.addEventListener('visibilitychange', checkSchedule);
        
        // Check immediately
        this.checkScheduledUpdate();
    }

    // Check if current time matches scheduled update time
    checkScheduledUpdate() {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        if (currentTime === this.scheduledUpdateTime) {
            const lastUpdate = localStorage.getItem('last_data_update');
            const today = now.toDateString();
            
            // Only update once per day
            if (lastUpdate !== today) {
                console.log('Scheduled update time reached!');
                this.performDataUpdate();
            }
        }
    }

    // Perform data update with pumpkin animation
    async performDataUpdate() {
        if (this.isUpdating) {
            console.log('Update already in progress');
            return;
        }
        
        this.isUpdating = true;
        
        // Show pumpkin animation and notification
        this.showHauntedAnimation();
        
        try {
            // Fetch and validate new MP data
            const newData = await this.fetchMPData();
            
            if (newData && newData.length > 0) {
                // Validate and store each MP entry
                const validatedData = await this.validateAndStoreData(newData);
                
                console.log(`Successfully updated ${validatedData.length} MP records`);
                
                // Update last update timestamp
                localStorage.setItem('last_data_update', new Date().toDateString());
                
                // Show success notification
                this.showUpdateNotification(`Updated ${validatedData.length} MP records!`);
            }
        } catch (error) {
            console.error('Data update failed:', error);
            this.showUpdateNotification('Update failed. Will retry later.', true);
        } finally {
            this.isUpdating = false;
            
            // Hide animation after 10 seconds
            setTimeout(() => {
                this.hideHauntedAnimation();
            }, 10000);
        }
    }

    // Fetch MP data from AI API
    async fetchMPData() {
        console.log('Fetching MP data from AI API...');
        
        // This is a placeholder for the actual API call
        // In production, this would call Gemini or OpenAI API
        
        if (API_CONFIG.GEMINI_API_KEY) {
            return await this.fetchFromGemini();
        } else if (API_CONFIG.OPENAI_API_KEY) {
            return await this.fetchFromOpenAI();
        }
        
        // For demo purposes, return empty array
        console.warn('No API key configured. Skipping data fetch.');
        return [];
    }

    // Fetch data using Gemini API
    async fetchFromGemini() {
        const prompt = `
            Gather information about Indian Members of Parliament (MPs) and Members of Legislative Assembly (MLAs).
            For each representative, collect the following verified information from trusted sources:
            1. Full name
            2. Constituency
            3. Political party
            4. Attendance percentage
            5. Number of questions asked in parliament/assembly
            6. Number of debates participated in
            7. Criminal cases (if any)
            
            Only include representatives where you can verify at least 5 of these 7 fields.
            Verify information from multiple trusted sources like loksabha.gov.in, myneta.info, prsindia.org
            
            Return data in JSON format as an array of objects.
        `;
        
        try {
            // Production implementation: Uncomment and configure the API call below
            // Note: This requires an active API key set in localStorage
            /*
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': API_CONFIG.GEMINI_API_KEY
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });
            
            const data = await response.json();
            
            // Parse and return MP data
            // This would need to extract JSON from the AI response
            return this.parseAIResponse(data);
            */
            
            // Demo mode: Return empty array when no API key is configured
            console.log('Demo mode: Gemini API integration ready but not called (no API key)');
            return [];
        } catch (error) {
            console.error('Gemini API error:', error);
            return [];
        }
    }

    // Fetch data using OpenAI API
    async fetchFromOpenAI() {
        const prompt = `
            Gather information about Indian Members of Parliament (MPs) and Members of Legislative Assembly (MLAs).
            For each representative, collect verified information including:
            name, constituency, party, attendance, questions, debates, criminal cases.
            
            Only include complete profiles with at least 5 fields verified from multiple trusted sources.
            Return data in JSON format.
        `;
        
        try {
            // Production implementation: Uncomment and configure the API call below
            // Note: This requires an active API key set in localStorage
            /*
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_CONFIG.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant that gathers verified information about Indian political representatives.' },
                        { role: 'user', content: prompt }
                    ]
                })
            });
            
            const data = await response.json();
            return this.parseAIResponse(data);
            */
            
            // Demo mode: Return empty array when no API key is configured
            console.log('Demo mode: OpenAI API integration ready but not called (no API key)');
            return [];
        } catch (error) {
            console.error('OpenAI API error:', error);
            return [];
        }
    }

    // Parse AI response to extract MP data
    parseAIResponse(response) {
        // This would parse the AI response and extract structured MP data
        // For now, return empty array as placeholder
        try {
            // Attempt to extract JSON from response
            // Implementation depends on specific API response format
            return [];
        } catch (error) {
            console.error('Failed to parse AI response:', error);
            return [];
        }
    }

    // Validate and store MP data
    async validateAndStoreData(mpDataArray) {
        const validatedData = [];
        
        for (const mpData of mpDataArray) {
            // Check if data is complete
            if (!this.validator.isDataComplete(mpData)) {
                console.log(`Skipping incomplete data for: ${mpData.name || 'Unknown'}`);
                continue;
            }
            
            // Validate from multiple sources
            const isValid = await this.validator.validateFromMultipleSources(mpData);
            
            if (isValid) {
                validatedData.push(mpData);
                this.storeMPData(mpData);
            } else {
                console.log(`Failed validation for: ${mpData.name}`);
            }
        }
        
        return validatedData;
    }

    // Store MP data in IndexedDB or localStorage
    storeMPData(mpData) {
        // Store in localStorage for now
        // In production, use IndexedDB for better performance
        
        // Validate mpData has required fields
        if (!mpData || !mpData.name) {
            console.error('Cannot store MP data: missing name field');
            return;
        }
        
        // Create safe key by encoding the name
        const safeName = encodeURIComponent(mpData.name.replace(/\s+/g, '_'));
        const storageKey = `mp_data_${safeName}`;
        localStorage.setItem(storageKey, JSON.stringify(mpData));
        console.log(`Stored data for: ${mpData.name}`);
    }

    // Show haunted pumpkin animation
    showHauntedAnimation() {
        // Add pumpkin animation element if not exists
        if (!document.getElementById('pumpkin-animation')) {
            const pumpkinDiv = document.createElement('div');
            pumpkinDiv.id = 'pumpkin-animation';
            pumpkinDiv.className = 'pumpkin-animation';
            pumpkinDiv.innerHTML = '<div class="pumpkin">🎃</div>';
            document.body.appendChild(pumpkinDiv);
            
            // Add haunted overlay
            const overlay = document.createElement('div');
            overlay.id = 'haunted-overlay';
            overlay.className = 'haunted-overlay';
            document.body.appendChild(overlay);
        }
        
        // Activate animations
        document.getElementById('pumpkin-animation').classList.add('active');
        document.getElementById('haunted-overlay').classList.add('active');
    }

    // Hide haunted animation
    hideHauntedAnimation() {
        const pumpkin = document.getElementById('pumpkin-animation');
        const overlay = document.getElementById('haunted-overlay');
        
        if (pumpkin) pumpkin.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    }

    // Show update notification
    showUpdateNotification(message, isError = false) {
        // Create notification if not exists
        if (!document.getElementById('data-update-notification')) {
            const notification = document.createElement('div');
            notification.id = 'data-update-notification';
            notification.className = 'data-update-notification';
            document.body.appendChild(notification);
        }
        
        const notification = document.getElementById('data-update-notification');
        notification.innerHTML = `
            <span class="update-icon">${isError ? '⚠️' : '🎃'}</span>
            <span class="update-text">${message}</span>
        `;
        notification.classList.add('active');
        
        // Hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('active');
        }, 5000);
    }
}

// Initialize AI Data Manager when document is ready
document.addEventListener('DOMContentLoaded', () => {
    const dataManager = new AIDataManager();
    dataManager.init();
    
    // Expose to window for manual testing
    window.aiDataManager = dataManager;
    
    console.log('AI Data Manager ready. To test pumpkin animation, run: window.aiDataManager.performDataUpdate()');
});
