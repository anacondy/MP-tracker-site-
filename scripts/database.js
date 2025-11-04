/*
  File: scripts/database.js
  Implements SQLite-like search functionality using IndexedDB for MP/MLA data
  This provides client-side database capabilities for efficient searching and filtering
*/

// Database configuration constants
const DB_NAME = 'MPTrackerDB';
const DB_VERSION = 1;
const STORE_NAME = 'representatives';

// Global database connection variable
let db = null;

/**
 * Initialize the IndexedDB database
 * Creates the database and object stores if they don't exist
 * @returns {Promise} Resolves with database instance when ready
 */
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('Database failed to open');
            reject(request.error);
        };

        request.onsuccess = () => {
            db = request.result;
            console.log('Database opened successfully');
            resolve(db);
        };

        // Handle database upgrade (first time creation or version change)
        request.onupgradeneeded = (e) => {
            db = e.target.result;

            // Create object store if it doesn't exist
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                
                // Create indexes for efficient searching on different fields
                objectStore.createIndex('name', 'name', { unique: false });
                objectStore.createIndex('constituency', 'constituency', { unique: false });
                objectStore.createIndex('party', 'party', { unique: false });
                objectStore.createIndex('alliance', 'alliance', { unique: false });
                
                console.log('Object store created');
            }
        };
    });
}

/**
 * Add a representative to the database
 * @param {Object} data - Representative data object with fields like name, constituency, party, etc.
 * @returns {Promise} Resolves with the new record's ID
 */
function addRepresentative(data) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.add(data);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

/**
 * Search representatives by name
 * Uses the name index for efficient searching
 * @param {string} searchTerm - The name to search for (case-insensitive)
 * @returns {Promise<Array>} Array of matching representatives
 */
function searchByName(searchTerm) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const index = objectStore.index('name');
        
        const results = [];
        const request = index.openCursor();

        request.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                // Case-insensitive search
                if (cursor.value.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                    results.push(cursor.value);
                }
                cursor.continue();
            } else {
                resolve(results);
            }
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

/**
 * Search representatives by constituency
 * Uses the constituency index for efficient searching
 * @param {string} searchTerm - The constituency to search for (case-insensitive)
 * @returns {Promise<Array>} Array of matching representatives
 */
function searchByConstituency(searchTerm) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const index = objectStore.index('constituency');
        
        const results = [];
        const request = index.openCursor();

        request.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                // Case-insensitive search
                if (cursor.value.constituency.toLowerCase().includes(searchTerm.toLowerCase())) {
                    results.push(cursor.value);
                }
                cursor.continue();
            } else {
                resolve(results);
            }
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

/**
 * Search representatives by party
 * Uses the party index for efficient searching
 * @param {string} searchTerm - The party name to search for (case-insensitive)
 * @returns {Promise<Array>} Array of matching representatives
 */
function searchByParty(searchTerm) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const index = objectStore.index('party');
        
        const results = [];
        const request = index.openCursor();

        request.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                // Case-insensitive search
                if (cursor.value.party.toLowerCase().includes(searchTerm.toLowerCase())) {
                    results.push(cursor.value);
                }
                cursor.continue();
            } else {
                resolve(results);
            }
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

/**
 * Universal search function
 * Searches across name, constituency, and party fields simultaneously
 * @param {string} searchTerm - The term to search for across all fields
 * @returns {Promise<Array>} Array of unique matching representatives
 */
function universalSearch(searchTerm) {
    return new Promise(async (resolve, reject) => {
        try {
            // Search all fields in parallel for better performance
            const [nameResults, constituencyResults, partyResults] = await Promise.all([
                searchByName(searchTerm),
                searchByConstituency(searchTerm),
                searchByParty(searchTerm)
            ]);

            // Combine and deduplicate results using Map
            // This ensures each representative appears only once
            const allResults = [...nameResults, ...constituencyResults, ...partyResults];
            const uniqueResults = Array.from(new Map(allResults.map(item => [item.id, item])).values());
            
            resolve(uniqueResults);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Get all representatives from the database
 * @returns {Promise<Array>} Array of all representatives
 */
function getAllRepresentatives() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

/**
 * Seed database with sample data
 * Clears existing data and populates with new MP/MLA records
 * @param {Array} mps_data - Array of MP/MLA objects to add to database
 */
async function seedDatabase(mps_data) {
    try {
        // Clear existing data first to avoid duplicates
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        await objectStore.clear();

        // Add all MPs to the database
        for (const mp of mps_data) {
            await addRepresentative(mp);
        }
        
        console.log('Database seeded with', mps_data.length, 'representatives');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

/**
 * Export database functions globally for use in other scripts
 * Creates a window.MPDatabase object with all available methods
 */
if (typeof window !== 'undefined') {
    window.MPDatabase = {
        init: initDB,
        add: addRepresentative,
        searchByName,
        searchByConstituency,
        searchByParty,
        search: universalSearch,
        getAll: getAllRepresentatives,
        seed: seedDatabase
    };
}
