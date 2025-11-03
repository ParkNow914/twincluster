export interface ManagerProfile {
  id: string;
  name: string;
  nationality: string;
  age: number;
  reputation: number; // 0-100
  experience: number; // Years as manager
  
  // Career Statistics
  careerStats: {
    matchesManaged: number;
    wins: number;
    draws: number;
    losses: number;
    trophiesWon: number;
    clubsManaged: number;
  };
  
  // Current Season
  seasonStats: {
    matchesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
  };
  
  // Preferences
  preferredFormation: string;
  managementStyle: 'Attacking' | 'Defensive' | 'Balanced' | 'Possession';
}

export interface Competition {
  id: string;
  name: string;
  type: 'League' | 'Cup' | 'Champions League';
  currentRound: number;
  teams: string[]; // team IDs
  matches: CompetitionMatch[];
  winner?: string;
}

export interface CompetitionMatch {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  round: number;
  homeScore?: number;
  awayScore?: number;
  played: boolean;
  date: string;
}

export interface WeatherCondition {
  type: 'Sunny' | 'Cloudy' | 'Rainy' | 'Snowy' | 'Foggy';
  temperature: number; // Celsius
  windSpeed: number; // km/h
  impact: {
    passing: number; // -20 to +20
    shooting: number;
    stamina: number;
  };
}

export interface PlayerPersonality {
  leadership: number; // 1-20
  workRate: number; // 1-20
  determination: number; // 1-20
  temperament: number; // 1-20 (higher = calmer)
  loyalty: number; // 1-20
  professionalism: number; // 1-20
}

export interface PressConference {
  id: string;
  type: 'Pre-Match' | 'Post-Match';
  date: string;
  questions: PressQuestion[];
  responses: PressResponse[];
}

export interface PressQuestion {
  id: string;
  question: string;
  category: 'Team' | 'Tactics' | 'Opponent' | 'Players' | 'Pressure';
}

export interface PressResponse {
  questionId: string;
  answer: string;
  tone: 'Confident' | 'Humble' | 'Aggressive' | 'Defensive' | 'Neutral';
  impact: {
    playerMorale: number; // -10 to +10
    fanSupport: number; // -10 to +10
    boardConfidence: number; // -10 to +10
  };
}

export interface BoardExpectation {
  season: number;
  leaguePosition: number; // Target finish position
  cupProgress: 'Quarter-Finals' | 'Semi-Finals' | 'Final' | 'Win';
  financialTarget: number; // Budget target
  youthDevelopment: number; // Number of youth players to promote
  status: 'On Track' | 'At Risk' | 'Failed';
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Assistant Manager' | 'Coach' | 'Scout' | 'Physio' | 'Analyst';
  nationality: string;
  age: number;
  rating: number; // 1-20
  wage: number; // Weekly wage
  contract: {
    yearsRemaining: number;
  };
  
  // Attributes based on role
  attributes: {
    attacking?: number; // Coach
    defending?: number; // Coach
    fitness?: number; // Physio
    tactics?: number; // Assistant/Analyst
    judgingPlayerPotential?: number; // Scout
    judgingPlayerAbility?: number; // Scout
  };
}

export interface LoanDeal {
  id: string;
  playerId: string;
  loanedFrom?: string; // Team ID (if we loaned in)
  loanedTo?: string; // Team ID (if we loaned out)
  startDate: string;
  endDate: string;
  monthsRemaining: number;
  wageCoverage: number; // Percentage (0-100)
  optionToBuy: boolean;
  buyClause?: number; // Price if option to buy
}

export interface FinancialReport {
  season: number;
  month: number;
  
  income: {
    matchRevenue: number;
    sponsorships: number;
    transfers: number;
    merchandising: number;
    broadcasting: number;
    total: number;
  };
  
  expenses: {
    wages: number;
    transfers: number;
    youthAcademy: number;
    staff: number;
    facilities: number;
    total: number;
  };
  
  balance: number;
  projectedBalance: number; // End of season
}
