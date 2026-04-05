import { getDB } from '../db/database';
import { Transaction } from '../types/models';
import { generateUUID } from '../utils/uuid';

export const TransactionService = {
  async getByGoalId(goalId: string, limit = 50, offset = 0): Promise<Transaction[]> {
    const db = await getDB();
    const result = await db.getAllAsync<Transaction>(
      'SELECT * FROM transactions WHERE goal_id = ? ORDER BY entry_date DESC, created_at DESC LIMIT ? OFFSET ?',
      [goalId, limit, offset]
    );
    return result || [];
  },

  async addTransaction(
    goal_id: string,
    amount: number,
    currency: string,
    converted_amount: number,
    exchange_rate: number,
    rate_source: string,
    category: string,
    note: string | null,
    entry_date: string
  ): Promise<Transaction> {
    const db = await getDB();
    const newId = generateUUID();
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO transactions (
        id, goal_id, amount, currency, converted_amount,
        exchange_rate, rate_source, category, note, entry_date, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [newId, goal_id, amount, currency, converted_amount, exchange_rate, rate_source, category, note, entry_date, now]
    );

    const createdTxn = await db.getFirstAsync<Transaction>('SELECT * FROM transactions WHERE id = ?', [newId]);
    if (!createdTxn) throw new Error('Failed to create transaction');

    return createdTxn;
  },
};
