export interface Player {
  id: string;
  name: string;
  age: number;
  position: Position;
  nationality: string;
  overall: number; // 1-100
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  stamina: number; // Current stamina (0-100)
  maxStamina: number; // Maximum stamina capacity
  morale: number; // 1-100
  form: number; // 1-10
  injured: boolean;
  injuryDaysRemaining: number; // Days until recovery
  marketValue: number;
  gamesPlayed: number; // Season statistics
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
}

export enum Position {
  GK = 'GK',
  LB = 'LB',
  CB = 'CB',
  RB = 'RB',
  LM = 'LM',
  CM = 'CM',
  RM = 'RM',
  CAM = 'CAM',
  CDM = 'CDM',
  LW = 'LW',
  RW = 'RW',
  ST = 'ST',
}
