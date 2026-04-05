import { getDB } from '../db/database';
import { Goal } from '../types/models';
import { generateUUID } from '../utils/uuid';

export const GoalService = {
  async getActiveGoals(): Promise<Goal[]> {
    const db = await getDB();
    const result = await db.getAllAsync<Goal>('SELECT * FROM goals WHERE is_active = 1 ORDER BY created_at DESC');
    return result || [];
  },

  async createGoal(
    name: string,
    target_amount: number,
    target_currency: string,
    earning_currency: string,
    deadline: string,
    image_uri?: string
  ): Promise<Goal> {
    const db = await getDB();
    const newId = generateUUID();
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO goals (
        id, name, target_amount, target_currency, earning_currency, 
        deadline, image_uri, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      [newId, name, target_amount, target_currency, earning_currency, deadline, image_uri || null, now, now]
    );

    const createdGoal = await db.getFirstAsync<Goal>('SELECT * FROM goals WHERE id = ?', [newId]);
    if (!createdGoal) throw new Error('Failed to create goal');

    return createdGoal;
  },

  async completeGoal(id: string): Promise<void> {
    const db = await getDB();
    const now = new Date().toISOString();
    await db.runAsync('UPDATE goals SET is_active = 0, updated_at = ? WHERE id = ?', [now, id]);
  },

  async deleteGoal(id: string): Promise<void> {
    const db = await getDB();
    // Delete associated transactions first if PRAGMA foreign_keys is not turned on (it is, but good measure)
    await db.runAsync('DELETE FROM transactions WHERE goal_id = ?', [id]);
    await db.runAsync('DELETE FROM goals WHERE id = ?', [id]);
  }
};
