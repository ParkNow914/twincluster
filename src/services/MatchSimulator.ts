import { Team } from '../models/Team';
import { Match, MatchEvent } from '../models/Match';
import { Player } from '../models/Player';
import { nanoid } from 'nanoid';

export class MatchSimulator {
  /**
   * Simulates a match between two teams
   */
  static simulateMatch(
    homeTeam: Team,
    awayTeam: Team,
    competition: string = 'League'
  ): Match {
    const match: Match = {
      id: nanoid(),
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      homeScore: 0,
      awayScore: 0,
      date: new Date(),
      competition,
      played: true,
      events: [],
    };

    // Calculate team strengths
    const homeStrength = this.calculateTeamStrength(homeTeam) * 1.1; // Home advantage
    const awayStrength = this.calculateTeamStrength(awayTeam);

    // Simulate 90 minutes
    for (let minute = 1; minute <= 90; minute += 5) {
      // Goal probability based on team strength
      const homeGoalChance = (homeStrength / (homeStrength + awayStrength)) * 0.03;
      const awayGoalChance = (awayStrength / (homeStrength + awayStrength)) * 0.025;

      if (Math.random() < homeGoalChance) {
        const scorer = this.selectRandomAttacker(homeTeam.players);
        match.homeScore++;
        match.events.push({
          minute,
          type: 'goal',
          playerId: scorer.id,
          teamId: homeTeam.id,
          description: `⚽ ${scorer.name} scores!`,
        });
      }

      if (Math.random() < awayGoalChance) {
        const scorer = this.selectRandomAttacker(awayTeam.players);
        match.awayScore++;
        match.events.push({
          minute,
          type: 'goal',
          playerId: scorer.id,
          teamId: awayTeam.id,
          description: `⚽ ${scorer.name} scores!`,
        });
      }

      // Yellow cards
      if (Math.random() < 0.02) {
        const player = this.selectRandomPlayer([...homeTeam.players, ...awayTeam.players]);
        const teamId = homeTeam.players.includes(player) ? homeTeam.id : awayTeam.id;
        match.events.push({
          minute,
          type: 'yellow_card',
          playerId: player.id,
          teamId,
          description: `🟨 ${player.name} receives a yellow card`,
        });
      }
    }

    return match;
  }

  /**
   * Calculate overall team strength
   */
  private static calculateTeamStrength(team: Team): number {
    const playerStrengths = team.players.map(p => p.overall * p.form / 10);
    return playerStrengths.reduce((sum, strength) => sum + strength, 0) / team.players.length;
  }

  /**
   * Select a random attacking player for scoring
   */
  private static selectRandomAttacker(players: Player[]): Player {
    const attackers = players.filter(p => 
      ['ST', 'LW', 'RW', 'CAM'].includes(p.position)
    );
    
    if (attackers.length === 0) {
      return players[Math.floor(Math.random() * players.length)];
    }

    // Weight by shooting ability
    const totalShooting = attackers.reduce((sum, p) => sum + p.shooting, 0);
    let random = Math.random() * totalShooting;
    
    for (const attacker of attackers) {
      random -= attacker.shooting;
      if (random <= 0) {
        return attacker;
      }
    }
    
    return attackers[0];
  }

  /**
   * Select a random player
   */
  private static selectRandomPlayer(players: Player[]): Player {
    return players[Math.floor(Math.random() * players.length)];
  }

  /**
   * Simulate multiple matches quickly
   */
  static simulateMultipleMatches(
    matches: Array<{ homeTeam: Team; awayTeam: Team; competition?: string }>
  ): Match[] {
    return matches.map(({ homeTeam, awayTeam, competition }) =>
      this.simulateMatch(homeTeam, awayTeam, competition)
    );
  }
}
