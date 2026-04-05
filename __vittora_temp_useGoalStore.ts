import { create } from 'zustand';
import { Goal, Transaction, GoalProgress, GoalInsights } from '../types/models';
import { GoalService } from '../services/GoalService';
import { TransactionService } from '../services/TransactionService';
import { computeGoalProgress, computeInsights } from '../utils/calculations';

export interface GoalData {
  goal: Goal;
  transactions: Transaction[];
  progress: GoalProgress;
  insights: GoalInsights;
}

interface GoalStore {
  goalsData: GoalData[];
  refreshDashboard: () => Promise<void>;
  addTransactionOptimistic: (txn: Transaction) => void;
  completeGoal: (id: string) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

export const useGoalStore = create<GoalStore>((set, get) => ({
  goalsData: [],

  refreshDashboard: async () => {
    const activeGoals = await GoalService.getActiveGoals();
    if (!activeGoals || activeGoals.length === 0) {
      return set({ goalsData: [] });
    }

    const goalsData: GoalData[] = [];
    for (const goal of activeGoals) {
      const transactions = await TransactionService.getByGoalId(goal.id);
      const progress = computeGoalProgress(goal, transactions);
      const insights = computeInsights(goal, transactions, progress);
      goalsData.push({ goal, transactions, progress, insights });
    }

    set({ goalsData });
  },

  addTransactionOptimistic: (txn: Transaction) => {
    const { goalsData } = get();
    const targetIdx = goalsData.findIndex(g => g.goal.id === txn.goal_id);
    if (targetIdx === -1) return;

    const data = goalsData[targetIdx];
    const updatedTxns = [txn, ...data.transactions];
    const progress = computeGoalProgress(data.goal, updatedTxns);
    const insights = computeInsights(data.goal, updatedTxns, progress);

    const newData = [...goalsData];
    newData[targetIdx] = { ...data, transactions: updatedTxns, progress, insights };
    
    set({ goalsData: newData });
  },

  completeGoal: async (id: string) => {
    await GoalService.completeGoal(id);
    await get().refreshDashboard();
  },

  deleteGoal: async (id: string) => {
    await GoalService.deleteGoal(id);
    const { goalsData } = get();
    set({ goalsData: goalsData.filter(g => g.goal.id !== id) });
  }
}));
