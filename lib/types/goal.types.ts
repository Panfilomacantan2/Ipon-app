export type GoalStatus =
  | "active"
  | "completed"
  | "cancelled";

export type Goal = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  target_amount: number;
  target_date: string;
  created_at: string;
};

export type GoalSummary = Goal & {
  total_contribution: number;
  remaining: number;
  progress: number;
  status: GoalStatus;
};