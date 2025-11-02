import { Team } from '../models/Team';
import { Match, Season, TeamStanding } from '../models/Match';
import { initialTeams } from '../data/initialData';
import { MatchSimulator } from './MatchSimulator';

export class GameState {
  private static instance: GameState;
  
  public teams: Team[];
  public playerTeamId: string;
  public season: Season;

  private constructor() {
    this.teams = [...initialTeams];
    this.playerTeamId = this.teams[0].id; // Default to first team
    this.season = this.initializeSeason();
  }

  static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }

  private initializeSeason(): Season {
    const matches: Match[] = [];
    const currentYear = new Date().getFullYear();

    // Generate round-robin fixtures
    for (let i = 0; i < this.teams.length; i++) {
      for (let j = i + 1; j < this.teams.length; j++) {
        // Home match
        matches.push({
          id: `match_${i}_${j}_h`,
          homeTeamId: this.teams[i].id,
          awayTeamId: this.teams[j].id,
          homeScore: 0,
          awayScore: 0,
          date: new Date(currentYear, 8, (i * this.teams.length + j) % 30 + 1),
          competition: 'League',
          played: false,
          events: [],
        });

        // Away match
        matches.push({
          id: `match_${i}_${j}_a`,
          homeTeamId: this.teams[j].id,
          awayTeamId: this.teams[i].id,
          homeScore: 0,
          awayScore: 0,
          date: new Date(currentYear, 2, (i * this.teams.length + j) % 30 + 1),
          competition: 'League',
          played: false,
          events: [],
        });
      }
    }

    return {
      year: currentYear,
      currentWeek: 1,
      matches,
      standings: this.initializeStandings(),
    };
  }

  private initializeStandings(): TeamStanding[] {
    return this.teams.map(team => ({
      teamId: team.id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    }));
  }

  getPlayerTeam(): Team | undefined {
    return this.teams.find(t => t.id === this.playerTeamId);
  }

  getTeamById(id: string): Team | undefined {
    return this.teams.find(t => t.id === id);
  }

  selectPlayerTeam(teamId: string): void {
    this.playerTeamId = teamId;
  }

  simulateNextMatch(): Match | null {
    const playerTeam = this.getPlayerTeam();
    if (!playerTeam) return null;

    // Find next unplayed match for player's team
    const nextMatch = this.season.matches.find(
      m => !m.played && 
      (m.homeTeamId === playerTeam.id || m.awayTeamId === playerTeam.id)
    );

    if (!nextMatch) return null;

    const homeTeam = this.getTeamById(nextMatch.homeTeamId);
    const awayTeam = this.getTeamById(nextMatch.awayTeamId);

    if (!homeTeam || !awayTeam) return null;

    const result = MatchSimulator.simulateMatch(homeTeam, awayTeam, nextMatch.competition);
    
    // Update the match in season
    const index = this.season.matches.findIndex(m => m.id === nextMatch.id);
    if (index !== -1) {
      this.season.matches[index] = result;
    }

    // Update standings
    this.updateStandings(result);

    return result;
  }

  private updateStandings(match: Match): void {
    const homeStanding = this.season.standings.find(s => s.teamId === match.homeTeamId);
    const awayStanding = this.season.standings.find(s => s.teamId === match.awayTeamId);

    if (!homeStanding || !awayStanding) return;

    homeStanding.played++;
    awayStanding.played++;
    homeStanding.goalsFor += match.homeScore;
    homeStanding.goalsAgainst += match.awayScore;
    awayStanding.goalsFor += match.awayScore;
    awayStanding.goalsAgainst += match.homeScore;

    if (match.homeScore > match.awayScore) {
      homeStanding.won++;
      homeStanding.points += 3;
      awayStanding.lost++;
    } else if (match.homeScore < match.awayScore) {
      awayStanding.won++;
      awayStanding.points += 3;
      homeStanding.lost++;
    } else {
      homeStanding.drawn++;
      awayStanding.drawn++;
      homeStanding.points++;
      awayStanding.points++;
    }

    // Sort standings by points
    this.season.standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const goalDiffA = a.goalsFor - a.goalsAgainst;
      const goalDiffB = b.goalsFor - b.goalsAgainst;
      return goalDiffB - goalDiffA;
    });
  }

  getUpcomingMatches(limit: number = 5): Match[] {
    const playerTeam = this.getPlayerTeam();
    if (!playerTeam) return [];

    return this.season.matches
      .filter(m => !m.played && 
        (m.homeTeamId === playerTeam.id || m.awayTeamId === playerTeam.id))
      .slice(0, limit);
  }

  getRecentMatches(limit: number = 5): Match[] {
    const playerTeam = this.getPlayerTeam();
    if (!playerTeam) return [];

    return this.season.matches
      .filter(m => m.played && 
        (m.homeTeamId === playerTeam.id || m.awayTeamId === playerTeam.id))
      .slice(-limit)
      .reverse();
  }
}
