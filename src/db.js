import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import config from './config.js';

function initDatabase(dbPath) {
  const dbDir = path.dirname(dbPath);
  
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log(`Created database directory: ${dbDir}`);
  }
  
  const dbExists = fs.existsSync(dbPath);
  
  const db = new Database(dbPath);
  
  if (!dbExists) {
    console.log('Database not found. Creating new database...');
    
    db.exec(`
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        nwc_secret TEXT UNIQUE NOT NULL
      );
      
      CREATE INDEX idx_nwc_secret ON users(nwc_secret);
    `);
    
    console.log('Database initialized successfully');
  } else {
    console.log('Database found and connected');
  }
  
  return db;
}

const db = initDatabase(config.databasePath);

export const getUserByNwcSecret = db.prepare('SELECT * FROM users WHERE nwc_secret = ?');
export const getUserById = db.prepare('SELECT * FROM users WHERE id = ?');
export const insertUser = db.prepare('INSERT INTO users (id, nwc_secret) VALUES (?, ?)');

export default db;