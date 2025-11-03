export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  date: Date;
  competition: string;
  played: boolean;
  events: MatchEvent[];
  statistics?: MatchStatistics;
}

export interface MatchStatistics {
  homePossession: number; // Percentage
  awayPossession: number;
  homeShots: number;
  awayShots: number;
  homeShotsOnTarget: number;
  awayShotsOnTarget: number;
  homeCorners: number;
  awayCorners: number;
  homeFouls: number;
  awayFouls: number;
  homePassAccuracy: number; // Percentage
  awayPassAccuracy: number;
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'injury' | 'assist' | 'save' | 'offside';
  playerId: string;
  teamId: string;
  description: string;
  relatedPlayerId?: string; // For assists, substitutions
}

export interface Season {
  year: number;
  currentWeek: number;
  matches: Match[];
  standings: TeamStanding[];
  cupMatches?: Match[]; // NEW: Cup competition matches
  cupRound?: string; // Current cup round (R16, QF, SF, F)
}

// NEW: Cup competition structure
export interface CupCompetition {
  name: string;
  round: string; // 'R16', 'QF', 'SF', 'F' (Round of 16, Quarter-finals, Semi-finals, Final)
  matches: Match[];
  winner?: string; // Team ID of the winner
}

export interface TeamStanding {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}
