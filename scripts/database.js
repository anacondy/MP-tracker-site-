/*
  File: scripts/database.js
  Simple SQLite-like search functionality using IndexedDB for MP/MLA data
*/

// Initialize IndexedDB for MP data storage
const DB_NAME = 'MPTrackerDB';
const DB_VERSION = 1;
const STORE_NAME = 'representatives';

let db = null;

// Initialize database
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

        request.onupgradeneeded = (e) => {
            db = e.target.result;

            // Create object store if it doesn't exist
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                
                // Create indexes for efficient searching
                objectStore.createIndex('name', 'name', { unique: false });
                objectStore.createIndex('constituency', 'constituency', { unique: false });
                objectStore.createIndex('party', 'party', { unique: false });
                objectStore.createIndex('alliance', 'alliance', { unique: false });
                
                console.log('Object store created');
            }
        };
    });
}

// Add representative data to database
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

// Search representatives by name
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

// Search representatives by constituency
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

// Search representatives by party
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

// Universal search function
function universalSearch(searchTerm) {
    return new Promise(async (resolve, reject) => {
        try {
            const [nameResults, constituencyResults, partyResults] = await Promise.all([
                searchByName(searchTerm),
                searchByConstituency(searchTerm),
                searchByParty(searchTerm)
            ]);

            // Combine and deduplicate results
            const allResults = [...nameResults, ...constituencyResults, ...partyResults];
            const uniqueResults = Array.from(new Map(allResults.map(item => [item.id, item])).values());
            
            resolve(uniqueResults);
        } catch (error) {
            reject(error);
        }
    });
}

// Get all representatives
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

// Seed database with sample data
async function seedDatabase(mps_data) {
    try {
        // Clear existing data first
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        await objectStore.clear();

        // Add all MPs
        for (const mp of mps_data) {
            await addRepresentative(mp);
        }
        
        console.log('Database seeded with', mps_data.length, 'representatives');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

// Export functions for use in other scripts
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
