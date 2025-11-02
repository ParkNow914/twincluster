import { Team } from '../models/Team';
import { Match, MatchStatistics } from '../models/Match';
import { Player } from '../models/Player';
import { nanoid } from 'nanoid';

export class MatchSimulator {
  /**
   * Simulates a match between two teams with enhanced statistics and events
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
      statistics: {
        homePossession: 0,
        awayPossession: 0,
        homeShots: 0,
        awayShots: 0,
        homeShotsOnTarget: 0,
        awayShotsOnTarget: 0,
        homeCorners: 0,
        awayCorners: 0,
        homeFouls: 0,
        awayFouls: 0,
        homePassAccuracy: 0,
        awayPassAccuracy: 0,
      },
    };

    // Calculate team strengths with chemistry factor
    const homeStrength = this.calculateTeamStrength(homeTeam) * 1.1; // Home advantage
    const awayStrength = this.calculateTeamStrength(awayTeam);

    // Calculate possession based on team strength and tactics
    const totalStrength = homeStrength + awayStrength;
    const stats = match.statistics!; // Non-null assertion: statistics is initialized above
    stats.homePossession = Math.round((homeStrength / totalStrength) * 100);
    stats.awayPossession = 100 - stats.homePossession;

    // Simulate 90 minutes
    for (let minute = 1; minute <= 90; minute += 5) {
      // Goal probability based on team strength
      const homeGoalChance = (homeStrength / totalStrength) * 0.03;
      const awayGoalChance = (awayStrength / totalStrength) * 0.025;

      // Home team attack
      if (Math.random() < homeGoalChance) {
        const scorer = this.selectRandomAttacker(homeTeam.players);
        const assister = this.selectRandomMidfielder(homeTeam.players);
        
        match.homeScore++;
        stats.homeShots++;
        stats.homeShotsOnTarget++;
        
        // Update player stats
        scorer.goals++;
        scorer.gamesPlayed++;
        if (assister && assister.id !== scorer.id) {
          assister.assists++;
          match.events.push({
            minute,
            type: 'assist',
            playerId: assister.id,
            teamId: homeTeam.id,
            description: `👟 Assist by ${assister.name}`,
            relatedPlayerId: scorer.id,
          });
        }
        
        match.events.push({
          minute,
          type: 'goal',
          playerId: scorer.id,
          teamId: homeTeam.id,
          description: `⚽ ${scorer.name} scores!`,
          relatedPlayerId: assister?.id,
        });
      } else if (Math.random() < 0.05) {
        // Missed shot
        stats.homeShots++;
      }

      // Away team attack
      if (Math.random() < awayGoalChance) {
        const scorer = this.selectRandomAttacker(awayTeam.players);
        const assister = this.selectRandomMidfielder(awayTeam.players);
        
        match.awayScore++;
        stats.awayShots++;
        stats.awayShotsOnTarget++;
        
        scorer.goals++;
        scorer.gamesPlayed++;
        if (assister && assister.id !== scorer.id) {
          assister.assists++;
          match.events.push({
            minute,
            type: 'assist',
            playerId: assister.id,
            teamId: awayTeam.id,
            description: `👟 Assist by ${assister.name}`,
            relatedPlayerId: scorer.id,
          });
        }
        
        match.events.push({
          minute,
          type: 'goal',
          playerId: scorer.id,
          teamId: awayTeam.id,
          description: `⚽ ${scorer.name} scores!`,
          relatedPlayerId: assister?.id,
        });
      } else if (Math.random() < 0.05) {
        stats.awayShots++;
      }

      // Yellow cards (more likely with high pressing)
      const yellowCardChance = homeTeam.tactics.pressing === 'high' ? 0.025 : 0.02;
      if (Math.random() < yellowCardChance) {
        const player = this.selectRandomPlayer([...homeTeam.players, ...awayTeam.players]);
        const teamId = homeTeam.players.includes(player) ? homeTeam.id : awayTeam.id;
        
        player.yellowCards++;
        if (teamId === homeTeam.id) {
          stats.homeFouls++;
        } else {
          stats.awayFouls++;
        }
        
        // Check for second yellow (red card)
        if (player.yellowCards >= 2 && Math.random() < 0.3) {
          player.redCards++;
          match.events.push({
            minute,
            type: 'red_card',
            playerId: player.id,
            teamId,
            description: `🟥 ${player.name} sent off! (Second yellow)`,
          });
        } else {
          match.events.push({
            minute,
            type: 'yellow_card',
            playerId: player.id,
            teamId,
            description: `🟨 ${player.name} receives a yellow card`,
          });
        }
      }

      // Red cards (very rare, direct)
      if (Math.random() < 0.003) {
        const player = this.selectRandomPlayer([...homeTeam.players, ...awayTeam.players]);
        const teamId = homeTeam.players.includes(player) ? homeTeam.id : awayTeam.id;
        
        player.redCards++;
        match.events.push({
          minute,
          type: 'red_card',
          playerId: player.id,
          teamId,
          description: `🟥 ${player.name} sent off! (Straight red)`,
        });
      }

      // Offsides
      if (Math.random() < 0.04) {
        const player = this.selectRandomAttacker(homeTeam.players);
        match.events.push({
          minute,
          type: 'offside',
          playerId: player.id,
          teamId: homeTeam.id,
          description: `🚩 ${player.name} caught offside`,
        });
      }
      if (Math.random() < 0.03) {
        const player = this.selectRandomAttacker(awayTeam.players);
        match.events.push({
          minute,
          type: 'offside',
          playerId: player.id,
          teamId: awayTeam.id,
          description: `🚩 ${player.name} caught offside`,
        });
      }

      // Penalties (rare)
      if (Math.random() < 0.008) {
        const scorer = this.selectRandomAttacker(homeTeam.players);
        const penaltySuccess = Math.random() > 0.2; // 80% conversion rate
        
        if (penaltySuccess) {
          match.homeScore++;
          stats.homeShotsOnTarget++;
          scorer.goals++;
          match.events.push({
            minute,
            type: 'goal',
            playerId: scorer.id,
            teamId: homeTeam.id,
            description: `⚽ PENALTY! ${scorer.name} scores from the spot!`,
          });
        } else {
          match.events.push({
            minute,
            type: 'save',
            playerId: scorer.id,
            teamId: homeTeam.id,
            description: `🧤 PENALTY SAVED! ${scorer.name}'s penalty is saved!`,
          });
        }
      }

      if (Math.random() < 0.006) {
        const scorer = this.selectRandomAttacker(awayTeam.players);
        const penaltySuccess = Math.random() > 0.2;
        
        if (penaltySuccess) {
          match.awayScore++;
          stats.awayShotsOnTarget++;
          scorer.goals++;
          match.events.push({
            minute,
            type: 'goal',
            playerId: scorer.id,
            teamId: awayTeam.id,
            description: `⚽ PENALTY! ${scorer.name} scores from the spot!`,
          });
        } else {
          match.events.push({
            minute,
            type: 'save',
            playerId: scorer.id,
            teamId: awayTeam.id,
            description: `🧤 PENALTY SAVED! ${scorer.name}'s penalty is saved!`,
          });
        }
      }

      // Corners
      if (Math.random() < 0.08) {
        stats.homeCorners++;
      }
      if (Math.random() < 0.06) {
        stats.awayCorners++;
      }

      // Injuries (rare)
      if (Math.random() < 0.005) {
        const allPlayers = [...homeTeam.players, ...awayTeam.players];
        const player = this.selectRandomPlayer(allPlayers);
        const teamId = homeTeam.players.includes(player) ? homeTeam.id : awayTeam.id;
        
        player.injured = true;
        player.injuryDaysRemaining = Math.floor(Math.random() * 14) + 3; // 3-17 days
        
        match.events.push({
          minute,
          type: 'injury',
          playerId: player.id,
          teamId,
          description: `🚑 ${player.name} is injured`,
        });
      }
    }

    // Calculate pass accuracy based on team tactics and stats
    stats.homePassAccuracy = this.calculatePassAccuracy(homeTeam);
    stats.awayPassAccuracy = this.calculatePassAccuracy(awayTeam);

    // Update all players' games played and minutes
    this.updatePlayerStats(homeTeam, awayTeam);

    return match;
  }

  /**
   * Calculate overall team strength including chemistry
   */
  private static calculateTeamStrength(team: Team): number {
    const playerStrengths = team.players.map(p => p.overall * p.form / 10);
    const avgStrength = playerStrengths.reduce((sum, strength) => sum + strength, 0) / team.players.length;
    
    // Apply chemistry bonus (up to 10% boost)
    const chemistryBonus = 1 + (team.chemistry / 1000);
    return avgStrength * chemistryBonus;
  }

  /**
   * Calculate pass accuracy based on team passing stat and tactics
   */
  private static calculatePassAccuracy(team: Team): number {
    const avgPassing = team.players.reduce((sum, p) => sum + p.passing, 0) / team.players.length;
    const baseAccuracy = avgPassing * 0.8; // 80% of passing stat
    
    // Short passing style is more accurate
    const styleBonus = team.tactics.passingStyle === 'short' ? 5 : 
                       team.tactics.passingStyle === 'mixed' ? 2 : 0;
    
    return Math.min(95, Math.round(baseAccuracy + styleBonus));
  }

  /**
   * Update player statistics after match
   */
  private static updatePlayerStats(homeTeam: Team, awayTeam: Team): void {
    const allPlayers = [...homeTeam.players, ...awayTeam.players];
    allPlayers.forEach(player => {
      if (!player.injured) {
        player.minutesPlayed += 90;
        player.stamina = Math.max(20, player.stamina - Math.floor(Math.random() * 30 + 10));
      }
    });
  }

  /**
   * Select a random attacking player for scoring
   */
  private static selectRandomAttacker(players: Player[]): Player {
    if (!players || players.length === 0) {
      throw new Error('Cannot select a random attacker from an empty player array');
    }

    const attackers = players.filter(p => 
      ['ST', 'LW', 'RW', 'CAM'].includes(p.position) && !p.injured
    );
    
    if (attackers.length === 0) {
      const availablePlayers = players.filter(p => !p.injured);
      return availablePlayers.length > 0 ? 
        availablePlayers[Math.floor(Math.random() * availablePlayers.length)] :
        players[0];
    }

    // Weight by shooting ability and form
    const totalWeight = attackers.reduce((sum, p) => sum + (p.shooting * p.form / 10), 0);
    let random = Math.random() * totalWeight;
    
    for (const attacker of attackers) {
      random -= (attacker.shooting * attacker.form / 10);
      if (random <= 0) {
        return attacker;
      }
    }
    
    return attackers[0];
  }

  /**
   * Select a random midfielder for assists
   */
  private static selectRandomMidfielder(players: Player[]): Player | null {
    const midfielders = players.filter(p => 
      ['CM', 'CAM', 'CDM', 'LM', 'RM'].includes(p.position) && !p.injured
    );
    
    if (midfielders.length === 0) return null;
    
    // Weight by passing ability
    const totalPassing = midfielders.reduce((sum, p) => sum + p.passing, 0);
    let random = Math.random() * totalPassing;
    
    for (const midfielder of midfielders) {
      random -= midfielder.passing;
      if (random <= 0) {
        return midfielder;
      }
    }
    
    return midfielders[0];
  }

  /**
   * Select a random player
   */
  private static selectRandomPlayer(players: Player[]): Player {
    if (!players || players.length === 0) {
      throw new Error('Cannot select a random player from an empty array');
    }
    const availablePlayers = players.filter(p => !p.injured);
    const pool = availablePlayers.length > 0 ? availablePlayers : players;
    return pool[Math.floor(Math.random() * pool.length)];
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

