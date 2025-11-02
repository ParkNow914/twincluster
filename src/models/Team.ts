import { Player } from './Player';

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
}
