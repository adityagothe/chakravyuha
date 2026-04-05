export interface Migration {
  version: number;
  statements: string[];
}

export const MIGRATIONS: Migration[] = [
  {
    version: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS goals (
        id               TEXT PRIMARY KEY,
        name             TEXT NOT NULL,
        target_amount    REAL NOT NULL CHECK(target_amount > 0),
        target_currency  TEXT NOT NULL DEFAULT 'USD',
        earning_currency TEXT NOT NULL DEFAULT 'INR',
        deadline         TEXT NOT NULL,
        is_active        INTEGER NOT NULL DEFAULT 1,
        created_at       TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
      `CREATE TABLE IF NOT EXISTS transactions (
        id               TEXT PRIMARY KEY,
        goal_id          TEXT NOT NULL,
        amount           REAL NOT NULL,
        currency         TEXT NOT NULL,
        converted_amount REAL NOT NULL,
        exchange_rate    REAL NOT NULL CHECK(exchange_rate > 0),
        rate_source      TEXT NOT NULL DEFAULT 'live' CHECK(rate_source IN ('live', 'cached', 'manual')),
        category         TEXT NOT NULL DEFAULT 'other' CHECK(category IN ('salary', 'freelance', 'investment', 'other')),
        note             TEXT,
        entry_date       TEXT NOT NULL,
        created_at       TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
      )`,
      `CREATE INDEX IF NOT EXISTS idx_txn_goal_id ON transactions(goal_id)`,
      `CREATE INDEX IF NOT EXISTS idx_txn_entry_date ON transactions(entry_date DESC)`,
      `CREATE INDEX IF NOT EXISTS idx_txn_goal_date ON transactions(goal_id, entry_date)`,
      `CREATE TABLE IF NOT EXISTS exchange_rate_cache (
        id               INTEGER PRIMARY KEY AUTOINCREMENT,
        base_currency    TEXT NOT NULL,
        target_currency  TEXT NOT NULL,
        rate             REAL NOT NULL,
        fetched_at       TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(base_currency, target_currency)
      )`,
      `CREATE TABLE IF NOT EXISTS app_settings (
        key        TEXT PRIMARY KEY,
        value      TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
    ],
  },
  {
    version: 2,
    statements: [
      `ALTER TABLE goals ADD COLUMN image_uri TEXT;`
    ],
  },
  {
    version: 3,
    statements: [
      // SQLite doesn't directly support DROp CONSTRAINT, so we migrate the table
      `CREATE TABLE IF NOT EXISTS transactions_new (
        id               TEXT PRIMARY KEY,
        goal_id          TEXT NOT NULL,
        amount           REAL NOT NULL,
        currency         TEXT NOT NULL,
        converted_amount REAL NOT NULL,
        exchange_rate    REAL NOT NULL CHECK(exchange_rate > 0),
        rate_source      TEXT NOT NULL DEFAULT 'live' CHECK(rate_source IN ('live', 'cached', 'manual')),
        category         TEXT NOT NULL DEFAULT 'other' CHECK(category IN ('salary', 'freelance', 'investment', 'other')),
        note             TEXT,
        entry_date       TEXT NOT NULL,
        created_at       TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
      )`,
      `INSERT INTO transactions_new SELECT * FROM transactions;`,
      `DROP TABLE transactions;`,
      `ALTER TABLE transactions_new RENAME TO transactions;`,
      `CREATE INDEX IF NOT EXISTS idx_txn_goal_id ON transactions(goal_id);`,
      `CREATE INDEX IF NOT EXISTS idx_txn_entry_date ON transactions(entry_date DESC);`,
      `CREATE INDEX IF NOT EXISTS idx_txn_goal_date ON transactions(goal_id, entry_date);`
    ],
  },
];
