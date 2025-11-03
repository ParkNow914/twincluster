import { Player } from './Player';
import { Trophy, ClubObjective, Achievement, NewsItem, Sponsorship, TrainingProgram, LoanDeal } from './Club';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  country: string;
  league: string;
  budget: number;
  reputation: number; // 1-5 stars
  players: Player[];
  formation: Formation;
  tactics: Tactics;
  chemistry: number; // Team chemistry (0-100)
  // Youth academy and scouting
  youthPlayers?: Player[]; // Youth academy players
  scouts?: number; // Number of scouts (0-5)
  // Manager stats
  managerReputation?: number; // Manager reputation (0-100)
  trophies?: number; // Total trophies won
  // NEW: Advanced features
  trophyList?: Trophy[]; // List of trophies won
  objectives?: ClubObjective[]; // Season objectives
  achievements?: Achievement[]; // Unlocked achievements
  news?: NewsItem[]; // Club news feed
  sponsorship?: Sponsorship; // Active sponsorship deal
  trainingProgram?: TrainingProgram; // Active training focus
  loanDeals?: LoanDeal[]; // Active loan deals
}

export enum Formation {
  F_4_4_2 = '4-4-2',
  F_4_3_3 = '4-3-3',
  F_3_5_2 = '3-5-2',
  F_4_2_3_1 = '4-2-3-1',
  F_4_3_2_1 = '4-3-2-1',
}

export interface Tactics {
  mentality: 'defensive' | 'balanced' | 'attacking';
  width: number; // 1-10
  tempo: number; // 1-10
  passingStyle: 'short' | 'mixed' | 'long';
  pressing: 'low' | 'medium' | 'high'; // New tactical option
}
