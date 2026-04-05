import { 
  Goal, Transaction, GoalProgress, GoalInsights, 
  WeeklyVelocity, DayVelocity, TrackingStatus,
  Badge, SavingsPersonality, MonthlyComparison, PersonalBests 
} from '../types/models';

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function computeGoalProgress(goal: Goal, transactions: Transaction[]): GoalProgress {
  const total_saved = transactions.reduce(
    (sum, txn) => sum + txn.converted_amount, 0
  );

  const remaining = Math.max(0, goal.target_amount - total_saved);
  const percentage = Math.min(100, (total_saved / goal.target_amount) * 100);

  const deadline = new Date(goal.deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

  const rawDiff = Math.ceil(
    (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  const days_left = Math.max(0, rawDiff);

  return {
    total_saved: round2(total_saved),
    remaining: round2(remaining),
    percentage: round2(percentage),
    days_left,
    is_complete: total_saved >= goal.target_amount,
    is_overdue: rawDiff < 0 && total_saved < goal.target_amount,
  };
}

// ------------------------------------------------------------------
// ENGAGEMENT CALCULATIONS
// ------------------------------------------------------------------

function getMonday(dStr: string): string {
  const d = new Date(dStr);
  const day = d.getDay() || 7; 
  if (day !== 1) d.setHours(-24 * (day - 1));
  return d.toISOString().split('T')[0];
}

export function computeWeeklyStreak(sortedTransactions: Transaction[]): number {
  if (sortedTransactions.length === 0) return 0;
  
  const mondays = [...new Set(sortedTransactions.map(t => getMonday(t.entry_date)))].sort().reverse();
  
  const thisMonday = getMonday(new Date().toISOString());
  const dToday = new Date(thisMonday);
  const dLastWeek = new Date(dToday);
  dLastWeek.setDate(dLastWeek.getDate() - 7);
  const lastMonday = dLastWeek.toISOString().split('T')[0];

  if (mondays[0] !== thisMonday && mondays[0] !== lastMonday) {
    return 0; // Missed this week AND last week -> streak broken
  }

  let streak = 1;
  for (let i = 1; i < mondays.length; i++) {
    const current = new Date(mondays[i - 1]);
    const previous = new Date(mondays[i]);
    const diff = Math.round((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 7) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function computePersonalBests(transactions: Transaction[]): PersonalBests {
  if (transactions.length === 0) return { biggest_single_day: 0, longest_streak: 0, best_week: 0 };

  // Best Single Day
  const dailySums: Record<string, number> = {};
  for (const t of transactions) {
    dailySums[t.entry_date] = (dailySums[t.entry_date] || 0) + t.converted_amount;
  }
  const biggest_single_day = Math.max(0, ...Object.values(dailySums));

  // Best Week
  const weeklySums: Record<string, number> = {};
  for (const t of transactions) {
    const monday = getMonday(t.entry_date);
    weeklySums[monday] = (weeklySums[monday] || 0) + t.converted_amount;
  }
  const best_week = Math.max(0, ...Object.values(weeklySums));

  // Longest Weekly Streak
  const mondays = [...new Set(transactions.map(t => getMonday(t.entry_date)))].sort();
  let longest_streak = 0;
  let current_streak = 1;
  for (let i = 1; i < mondays.length; i++) {
    const curr = new Date(mondays[i]);
    const prev = new Date(mondays[i - 1]);
    if (Math.round((curr.getTime() - prev.getTime()) / 86400000) === 7) {
      current_streak++;
    } else {
      longest_streak = Math.max(longest_streak, current_streak);
      current_streak = 1;
    }
  }
  longest_streak = Math.max(longest_streak, current_streak);

  return { biggest_single_day: round2(biggest_single_day), best_week: round2(best_week), longest_streak };
}

export function computeMonthlyComparison(transactions: Transaction[]): MonthlyComparison {
  const d = new Date();
  const currentMonth = d.getMonth();
  const currentYear = d.getFullYear();
  
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  let currTotal = 0;
  let lastTotal = 0;

  for (const t of transactions) {
    const tx = new Date(t.entry_date);
    if (tx.getMonth() === currentMonth && tx.getFullYear() === currentYear) currTotal += t.converted_amount;
    if (tx.getMonth() === lastMonth && tx.getFullYear() === lastMonthYear) lastTotal += t.converted_amount;
  }

  let pct = 0;
  let trend: "flat" | "up" | "down" = "flat";
  if (lastTotal > 0) {
    pct = round2(((currTotal - lastTotal) / lastTotal) * 100);
    trend = pct > 0 ? "up" : pct < 0 ? "down" : "flat";
  } else if (currTotal > 0) {
    pct = 100;
    trend = "up";
  }

  return {
    current_month_total: round2(currTotal),
    last_month_total: round2(lastTotal),
    percentage_change: Math.abs(pct),
    trend
  };
}

export function computePersonality(transactions: Transaction[], streak: number): SavingsPersonality {
  if (transactions.length < 5) return "Unknown";

  let weekendCount = 0;
  let nightCount = 0;
  
  for (const t of transactions) {
    const d = new Date(t.entry_date);
    if (d.getDay() === 0 || d.getDay() === 6) weekendCount++;
    
    // Simple night check using created_at
    const created = new Date(t.created_at);
    if (created.getHours() >= 20 || created.getHours() < 5) nightCount++;
  }

  if (nightCount / transactions.length > 0.4) return "Night Owl";
  if (weekendCount / transactions.length > 0.5) return "Weekend Saver";
  if (streak >= 4) return "Consistency Machine"; // 4 weeks in a row
  
  return "Burst Saver"; // Default fallback
}

export function computeBadges(goal: Goal, transactions: Transaction[], progress: GoalProgress, pb: PersonalBests): Badge[] {
  const badges: Badge[] = [];

  const tCount = transactions.length;
  const streak = pb.longest_streak;

  // 1. First Seed 🌱
  badges.push({
    id: 'first_seed', type: 'first_seed', name: 'First Seed',
    description: 'You planted your first seed of wealth.',
    icon: '🌱',
    earned_at: tCount > 0 ? transactions[tCount - 1]?.created_at : null,
    locked: tCount === 0,
  });

  // 2. Week Warrior 🔥
  badges.push({
    id: 'week_warrior', type: 'week_warrior', name: 'Week Warrior',
    description: '4 weeks of unbroken discipline.',
    icon: '🔥',
    earned_at: streak >= 4 ? new Date().toISOString() : null,
    locked: streak < 4,
  });

  // 3. Diamond Hands 💎
  badges.push({
    id: 'diamond_hands', type: 'diamond_hands', name: 'Diamond Hands',
    description: 'Nothing shakes your resolve.',
    icon: '💎',
    earned_at: streak >= 12 ? new Date().toISOString() : null,
    locked: streak < 12,
  });

  // 4. First Thousand 💰
  badges.push({
    id: 'first_thousand', type: 'first_thousand', name: 'First Thousand',
    description: 'Your first milestone of a thousand.',
    icon: '💰',
    earned_at: progress.total_saved >= 1000 ? new Date().toISOString() : null,
    locked: progress.total_saved < 1000,
  });

  // 5. Lucky 7 🎰
  const isLucky = transactions.some(t => t.amount === 777 || t.converted_amount === 777);
  badges.push({
    id: 'lucky_7', type: 'lucky_7', name: 'Lucky 7',
    description: 'The universe aligned — 777.',
    icon: '🎰',
    earned_at: isLucky ? new Date().toISOString() : null,
    locked: !isLucky,
  });

  // 6. Milestone Maker 🏔 — hit 50% of goal
  const hitFifty = progress.percentage >= 50;
  badges.push({
    id: 'milestone_maker', type: 'milestone_maker', name: 'Milestone Maker',
    description: 'The summit is in sight.',
    icon: '🏔',
    earned_at: hitFifty ? new Date().toISOString() : null,
    locked: !hitFifty,
  });

  // 7. Goal Crusher 👑 — completed the goal
  badges.push({
    id: 'goal_crusher', type: 'goal_crusher', name: 'Goal Crusher',
    description: 'You did what most only dream.',
    icon: '👑',
    earned_at: progress.is_complete ? new Date().toISOString() : null,
    locked: !progress.is_complete,
  });

  // 8. Early Bird 🌅 — ever saved before 8am
  const earlyBird = transactions.some(t => {
    const hr = new Date(t.created_at).getHours();
    return hr >= 5 && hr < 8;
  });
  badges.push({
    id: 'early_bird', type: 'early_bird', name: 'Early Bird',
    description: 'The early saver catches the dream.',
    icon: '🌅',
    earned_at: earlyBird ? new Date().toISOString() : null,
    locked: !earlyBird,
  });

  return badges;
}


// ------------------------------------------------------------------
// MAIN INSIGHTS RUNNER
// ------------------------------------------------------------------

export function computeInsights(
  goal: Goal,
  transactions: Transaction[],
  progress: GoalProgress
): GoalInsights {

  const daily_required = progress.days_left > 0
    ? round2(progress.remaining / progress.days_left)
    : 0; 
    
  const weekly_required = progress.days_left > 0
    ? round2(Math.min(progress.remaining, (progress.remaining / progress.days_left) * 7))
    : 0;

  const monthly_required = progress.days_left > 0
    ? round2(Math.min(progress.remaining, (progress.remaining / progress.days_left) * 30))
    : 0; 

  const sorted = [...transactions].sort(
    (a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime()
  );

  let daily_actual = 0;
  let weekly_actual = 0;
  let monthly_actual = 0;
  let projected_completion_date: string | null = null;
  let days_ahead_or_behind = 0;

  if (sorted.length >= 2) {
    const first_date = new Date(sorted[0].entry_date);
    const last_date = new Date(sorted[sorted.length - 1].entry_date);
    const span_days = Math.max(1, Math.ceil(
      (last_date.getTime() - first_date.getTime()) / (1000 * 60 * 60 * 24)
    ));

    daily_actual = round2(progress.total_saved / span_days);
    weekly_actual = round2(daily_actual * 7);
    monthly_actual = round2(daily_actual * 30);

    if (daily_actual > 0) {
      const days_to_finish = Math.ceil(progress.remaining / daily_actual);
      const projected = new Date();
      projected.setDate(projected.getDate() + days_to_finish);
      projected_completion_date = projected.toISOString().split('T')[0];

      const deadline = new Date(goal.deadline);
      days_ahead_or_behind = Math.ceil(
        (deadline.getTime() - projected.getTime()) / (1000 * 60 * 60 * 24)
      );
    }
  } else if (sorted.length === 1) {
    daily_actual = sorted[0].converted_amount;
    weekly_actual = daily_actual;
    monthly_actual = daily_actual;
  }

  let status: TrackingStatus;
  if (progress.is_complete) {
    status = "completed";
  } else if (progress.is_overdue) {
    status = "overdue";
  } else if (daily_actual >= daily_required && daily_actual > 0) {
    status = "on_track";
  } else if (daily_actual >= daily_required * 0.7 && daily_actual > 0) {
    status = "slightly_behind";
  } else if (daily_actual > 0) {
    status = "behind";
  } else {
    status = "no_data";
  }

  const pb = computePersonalBests(sorted);
  const streak = computeWeeklyStreak(sorted);
  const personality = computePersonality(sorted, streak);
  const badges = computeBadges(goal, sorted, progress, pb);
  const monthly_comparison = computeMonthlyComparison(sorted);

  return {
    daily_required,
    weekly_required,
    monthly_required,
    daily_actual,
    weekly_actual,
    monthly_actual,
    projected_completion_date,
    days_ahead_or_behind,
    status,
    saving_streak: streak,
    badges,
    personality,
    monthly_comparison,
    personal_bests: pb
  };
}

export function computeWeeklyVelocity(transactions: Transaction[]): WeeklyVelocity {
  const today = new Date();
  const dayOfWeek = today.getDay(); 
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const days: DayVelocity[] = [];
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    const dayTotal = transactions
      .filter(t => t.entry_date === dateStr)
      .reduce((sum, t) => sum + t.converted_amount, 0);

    days.push({
      label: labels[i],
      date: dateStr,
      total: round2(dayTotal),
      is_today: dateStr === today.toISOString().split('T')[0],
    });
  }

  const max = Math.max(...days.map(d => d.total), 1); 

  return {
    days,
    max_value: max,
    normalized: days.map(d => ({
      ...d,
      height_pct: round2((d.total / max) * 100),
    })),
  };
}

