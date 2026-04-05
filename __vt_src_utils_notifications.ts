import { GoalData } from '../stores/useGoalStore';

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  icon: any; // MaterialIcons name
  timestamp: number;
}

export const computeNotifications = (goalsData: GoalData[]): AppNotification[] => {
  const notifications: AppNotification[] = [];
  let baseTimestamp = Date.now();

  // Helper to ensure unique decreasing timestamps so notifications stay ordered
  const getTs = () => {
    baseTimestamp -= 1000;
    return baseTimestamp;
  };

  let maxStreak = 0;

  for (const { goal, progress, insights, transactions } of goalsData) {
    const isCompleted = progress.percentage >= 100;
    
    if (isCompleted) {
      notifications.push({
        id: `comp_${goal.id}`,
        type: 'Goal completed',
        title: 'Goal Completed',
        message: `👑 ${goal.name} is complete! Claim it.`,
        icon: 'verified',
        timestamp: getTs(),
      });
      continue; 
    }

    if (progress.percentage >= 90) {
      notifications.push({
        id: `almost_${goal.id}`,
        type: 'Goal almost done',
        title: 'Almost There',
        message: `🎯 ${goal.name} is at ${Math.floor(progress.percentage)}%! So close!`,
        icon: 'flag',
        timestamp: getTs(),
      });
    }

    if (insights.daily_actual < insights.daily_required * 0.85 && insights.daily_required > 0) {
       const pctBehind = Math.abs(Math.round((1 - (insights.daily_actual / insights.daily_required)) * 100));
       notifications.push({
         id: `pace_${goal.id}`,
         type: 'Pace warning',
         title: 'Pace Warning',
         message: `⚠️ You're ${pctBehind}% behind pace for ${goal.name}.`,
         icon: 'warning',
         timestamp: getTs(),
       });
    }

    if (transactions.length > 0) {
       const sorted = [...transactions].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
       const lastTxnDate = new Date(sorted[0].created_at).getTime();
       const daysSince = (Date.now() - lastTxnDate) / (1000 * 60 * 60 * 24);
       if (daysSince >= 7) {
         notifications.push({
           id: `noact_${goal.id}`,
           type: 'No activity 7 days',
           title: 'We Miss You',
           message: `😴 It's been a week since you added to ${goal.name}. Even ${goal.target_currency} 100 counts.`,
           icon: 'hotel',
           timestamp: getTs(),
         });
       }
    }

    if (insights.saving_streak > maxStreak) {
      maxStreak = insights.saving_streak;
    }
  }

  // Monthly comparison
  const allTxns = goalsData.flatMap(g => g.transactions).filter(t => t.amount > 0);
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
  
  const thisMonthTotal = allTxns.filter(t => new Date(t.created_at).getTime() >= thisMonthStart).reduce((acc, t) => acc + t.amount, 0);
  const lastMonthTotal = allTxns.filter(t => {
    const time = new Date(t.created_at).getTime();
    return time >= lastMonthStart && time < thisMonthStart;
  }).reduce((acc, t) => acc + t.amount, 0);

  if (lastMonthTotal > 0 && thisMonthTotal > lastMonthTotal) {
    const pct = Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100);
    notifications.push({
      id: 'monthly_comp',
      type: 'Monthly comparison',
      title: 'Monthly Comparison',
      message: `📈 You saved ${pct}% more than last month!`,
      icon: 'trending-up',
      timestamp: getTs(),
    });
  }

  // Single streak milestone notification for the highest streak if > 0
  if (maxStreak > 0) {
    notifications.push({
      id: `max_streak_${maxStreak}`,
      type: 'Streak milestone',
      title: 'Streak Milestone',
      message: `🔥 ${maxStreak}-week streak! You're unstoppable.`,
      icon: 'local-fire-department',
      timestamp: getTs(),
    });
  }

  return notifications.sort((a,b) => b.timestamp - a.timestamp); // newest first
};
