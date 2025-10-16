import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../models/index.js';
import path from 'path';
import fs from 'fs';

// Get database path from environment or use default
const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'database', 'cyeyes.db');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize SQLite database
const sqlite = new Database(dbPath);

// Enable foreign keys
sqlite.pragma('foreign_keys = ON');

// Enable WAL mode for better concurrency
sqlite.pragma('journal_mode = WAL');

// Initialize Drizzle ORM
export const db = drizzle(sqlite, { schema });

// Export raw SQLite instance for migrations
export { sqlite };

// Database connection check
export const checkDatabaseConnection = (): boolean => {
  try {
    const result = sqlite.prepare('SELECT 1').get();
    return result !== undefined;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Close database connection
export const closeDatabaseConnection = (): void => {
  sqlite.close();
};
