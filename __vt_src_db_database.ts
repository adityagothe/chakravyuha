import * as SQLite from 'expo-sqlite';
import { MIGRATIONS } from './schema';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;
  dbInstance = await SQLite.openDatabaseAsync('vittora.db');
  // Enable WAL mode for better concurrent read performance
  await dbInstance.execAsync('PRAGMA journal_mode = WAL;');
  await runMigrations(dbInstance);
  return dbInstance;
}

async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  // Create migrations tracking table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS _migrations (
      version    INTEGER PRIMARY KEY,
      applied_at TEXT DEFAULT (datetime('now'))
    )
  `);

  const applied = await db.getAllAsync<{ version: number }>(
    'SELECT version FROM _migrations ORDER BY version'
  );
  const appliedVersions = new Set(applied.map((m) => m.version));

  for (const migration of MIGRATIONS) {
    if (!appliedVersions.has(migration.version)) {
      await db.withTransactionAsync(async () => {
        // Run each statement individually — much safer than multi-statement execAsync
        for (const statement of migration.statements) {
          await db.execAsync(statement);
        }
        await db.runAsync(
          'INSERT INTO _migrations (version) VALUES (?)',
          [migration.version]
        );
      });
      console.log(`[DB] Applied migration v${migration.version}`);
    }
  }
}
