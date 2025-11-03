export interface Trophy {
  id: string;
  name: string;
  season: number;
  date: string;
}

export interface ClubObjective {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
  reward: number; // Budget reward
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedDate?: string;
  icon: string;
}

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'transfer' | 'match' | 'trophy' | 'youth' | 'contract' | 'achievement';
}

export interface Sponsorship {
  id: string;
  name: string;
  weeklyIncome: number;
  bonusPerWin: number;
  bonusPerGoal: number;
}

export type TrainingFocus = 'balanced' | 'attacking' | 'defending' | 'physical' | 'technical';

export interface TrainingProgram {
  focus: TrainingFocus;
  weeksRemaining: number;
  effectiveness: number; // 0-100
}

export interface LoanDeal {
  id: string;
  playerId: string;
  fromTeamId: string;
  toTeamId: string;
  weeksRemaining: number;
  weeklyWageContribution: number; // Percentage
}
