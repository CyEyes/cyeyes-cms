import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db, sqlite } from './database.js';
import path from 'path';

/**
 * Run database migrations
 */
async function runMigrations(): Promise<void> {
  console.log('🔄 Running database migrations...');

  try {
    // Run migrations from drizzle folder
    migrate(db, { migrationsFolder: path.join(process.cwd(), 'drizzle') });
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    sqlite.close();
  }
}

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { runMigrations };
