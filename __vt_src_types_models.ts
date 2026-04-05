export type CurrencyCode = "USD" | "INR" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY";
export type RateSource = "live" | "cached" | "manual";
export type TransactionCategory = "salary" | "freelance" | "investment" | "other";

export interface Goal {
  id: string;
  name: string;
  target_amount: number;
  target_currency: CurrencyCode;
  earning_currency: CurrencyCode;
  deadline: string;
  is_active: number; // SQLite stores as INTEGER 0/1
  image_uri?: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  goal_id: string;
  amount: number;
  currency: CurrencyCode;
  converted_amount: number;
  exchange_rate: number;
  rate_source: RateSource;
  category: TransactionCategory;
  note: string | null;
  entry_date: string;
  created_at: string;
}

export interface ExchangeRateCache {
  id: number;
  base_currency: CurrencyCode;
  target_currency: CurrencyCode;
  rate: number;
  fetched_at: string;
  is_stale?: boolean;
}

export interface ExchangeRateResult {
  rate: number;
  source: RateSource;
  fetched_at: string;
  warning?: string;
}

export interface ConversionResult {
  original_amount: number;
  converted_amount: number;
  rate: number;
  source: RateSource;
  warning?: string;
}

export interface GoalProgress {
  total_saved: number;
  remaining: number;
  percentage: number;
  days_left: number;
  is_complete: boolean;
  is_overdue: boolean;
}

export type TrackingStatus =
  | "on_track"
  | "slightly_behind"
  | "behind"
  | "overdue"
  | "completed"
  | "no_data";

export type BadgeType = 
  | "first_seed" | "week_warrior" | "diamond_hands" | "bullseye" 
  | "speed_saver" | "first_thousand" | "consistency_king" | "night_owl" 
  | "early_bird" | "lucky_7" | "milestone_maker" | "goal_crusher";

export interface Badge {
  id: string;
  type: BadgeType;
  name: string;
  description: string;
  icon: string;
  earned_at: string | null;
  locked: boolean;
}

export type SavingsPersonality = 
  | "Unknown" 
  | "Weekend Saver" 
  | "Consistency Machine" 
  | "Burst Saver"
  | "Night Owl";

export interface MonthlyComparison {
  current_month_total: number;
  last_month_total: number;
  percentage_change: number; // e.g. 23 for +23%
  trend: "up" | "down" | "flat";
}

export interface PersonalBests {
  biggest_single_day: number;
  longest_streak: number;
  best_week: number;
}

export interface GoalInsights {
  daily_required: number;
  weekly_required: number;
  monthly_required: number;
  daily_actual: number;
  weekly_actual: number;
  monthly_actual: number;
  projected_completion_date: string | null;
  days_ahead_or_behind: number;
  status: TrackingStatus;
  
  // New Engagement Insights
  saving_streak: number; // Now Weekly streak as requested!
  badges: Badge[];
  personality: SavingsPersonality;
  monthly_comparison: MonthlyComparison;
  personal_bests: PersonalBests;
}

export interface DayVelocity {
  label: string;
  date: string;
  total: number;
  is_today: boolean;
  height_pct?: number;
}

export interface WeeklyVelocity {
  days: DayVelocity[];
  max_value: number;
  normalized: DayVelocity[];
}
