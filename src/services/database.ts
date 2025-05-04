// Database initialization service
export const initDatabase = async () => {
  try {
    // Import SQLite from the WASM module with correct path
    const sqlite3 = await import('@sqlite.org/sqlite-wasm');
    
    // Initialize SQLite and wait for it to be ready
    const sqlite = await sqlite3.default();
    
    // Create an in-memory database using the correct DB constructor
    const db = new sqlite.oo1.DB(':memory:', 'c');
    
    console.log('SQLite database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing SQLite database:', error);
    throw error;
  }
};