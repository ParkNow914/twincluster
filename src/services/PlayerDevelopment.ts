import { Player } from '../models/Player';
import { Team } from '../models/Team';

export class PlayerDevelopment {
  /**
   * Apply weekly player development based on age, training, and performance
   */
  static developPlayers(team: Team): void {
    team.players.forEach(player => {
      // Age-based development
      if (player.age < 23) {
        // Young players improve
        this.improvePlayer(player, 0.5);
      } else if (player.age > 30) {
        // Older players decline
        this.decllinePlayer(player, 0.3);
      } else if (player.age >= 23 && player.age <= 27) {
        // Peak age - small improvements
        this.improvePlayer(player, 0.2);
      }

      // Form affects morale
      if (player.form > 7) {
        player.morale = Math.min(100, player.morale + 2);
      } else if (player.form < 4) {
        player.morale = Math.max(20, player.morale - 2);
      }

      // Performance-based form changes
      if (player.goals > 0 || player.assists > 0) {
        player.form = Math.min(10, player.form + 0.5);
      }

      // Recover stamina between matches
      if (!player.injured) {
        player.stamina = Math.min(player.maxStamina, player.stamina + 20);
      }

      // Injury recovery
      if (player.injured && player.injuryDaysRemaining > 0) {
        player.injuryDaysRemaining--;
        if (player.injuryDaysRemaining === 0) {
          player.injured = false;
          player.morale = Math.max(20, player.morale - 10); // Morale drop after injury
        }
      }
    });

    // Update team chemistry based on nationality diversity
    this.updateTeamChemistry(team);
  }

  /**
   * Improve player stats
   */
  private static improvePlayer(player: Player, amount: number): void {
    const maxImprovement = Math.floor(amount);
    
    if (player.overall < 95) {
      player.overall = Math.min(99, player.overall + maxImprovement);
      
      // Improve random stats based on position
      const statsToImprove = this.getRelevantStats(player.position);
      statsToImprove.forEach(stat => {
        if (player[stat] < 95) {
          player[stat] = Math.min(99, player[stat] + maxImprovement);
        }
      });
    }

    player.marketValue = player.overall * 100000;
  }

  /**
   * Decline player stats
   */
  private static decllinePlayer(player: Player, amount: number): void {
    const maxDecline = Math.floor(amount);
    
    if (player.overall > 60) {
      player.overall = Math.max(50, player.overall - maxDecline);
      
      // Physical attributes decline faster
      player.pace = Math.max(40, player.pace - maxDecline * 1.5);
      player.physical = Math.max(50, player.physical - maxDecline);
      player.stamina = Math.max(60, player.stamina - maxDecline);
    }

    player.marketValue = player.overall * 100000;
  }

  /**
   * Get relevant stats for a position
   */
  private static getRelevantStats(position: string): Array<'pace' | 'shooting' | 'passing' | 'dribbling' | 'defending' | 'physical'> {
    const positionStats: Record<string, Array<'pace' | 'shooting' | 'passing' | 'dribbling' | 'defending' | 'physical'>> = {
      GK: ['defending', 'physical'],
      CB: ['defending', 'physical'],
      LB: ['defending', 'pace'],
      RB: ['defending', 'pace'],
      CDM: ['defending', 'passing'],
      CM: ['passing', 'physical'],
      CAM: ['passing', 'dribbling'],
      LM: ['pace', 'dribbling'],
      RM: ['pace', 'dribbling'],
      LW: ['pace', 'dribbling', 'shooting'],
      RW: ['pace', 'dribbling', 'shooting'],
      ST: ['shooting', 'physical'],
    };

    return positionStats[position] || ['passing', 'physical'];
  }

  /**
   * Update team chemistry based on player nationalities and time together
   */
  private static updateTeamChemistry(team: Team): void {
    const nationalities = new Set(team.players.map(p => p.nationality));
    const diversityPenalty = Math.max(0, (nationalities.size - 8) * 2); // Penalty for too diverse
    
    // Base chemistry starts at 70
    let chemistry = 70;
    
    // Same nationality players boost chemistry
    if (nationalities.size <= 5) {
      chemistry += 15;
    } else if (nationalities.size <= 8) {
      chemistry += 10;
    }
    
    // High morale players boost chemistry
    const avgMorale = team.players.reduce((sum, p) => sum + p.morale, 0) / team.players.length;
    chemistry += Math.floor((avgMorale - 50) / 5);
    
    team.chemistry = Math.max(40, Math.min(100, chemistry - diversityPenalty));
  }

  /**
   * Train a specific player in a specific attribute
   */
  static trainPlayer(player: Player, attribute: 'pace' | 'shooting' | 'passing' | 'dribbling' | 'defending' | 'physical'): void {
    if (player.injured) {
      return; // Can't train injured players
    }

    // Training improves the stat slightly
    const currentValue = player[attribute];
    if (currentValue < 99) {
      const improvement = Math.floor(Math.random() * 2 + 1);
      player[attribute] = Math.min(99, currentValue + improvement);
      
      // Update overall rating based on improvements
      const avgStat = (player.pace + player.shooting + player.passing + 
                       player.dribbling + player.defending + player.physical) / 6;
      player.overall = Math.round(avgStat);
      player.marketValue = player.overall * 100000;
    }

    // Training costs stamina
    player.stamina = Math.max(30, player.stamina - 15);
    
    // Training improves morale slightly
    player.morale = Math.min(100, player.morale + 2);
  }

  /**
   * Team training session - trains all players
   */
  static teamTrainingSession(team: Team, focusAttribute?: 'pace' | 'shooting' | 'passing' | 'dribbling' | 'defending' | 'physical'): void {
    team.players.forEach(player => {
      if (!player.injured) {
        if (focusAttribute) {
          this.trainPlayer(player, focusAttribute);
        } else {
          // Random attribute training
          const attributes: Array<'pace' | 'shooting' | 'passing' | 'dribbling' | 'defending' | 'physical'> = [
            'pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'
          ];
          const randomAttr = attributes[Math.floor(Math.random() * attributes.length)];
          this.trainPlayer(player, randomAttr);
        }
      }
    });
  }

  /**
   * Reset season stats for all players
   */
  static resetSeasonStats(team: Team): void {
    team.players.forEach(player => {
      player.gamesPlayed = 0;
      player.goals = 0;
      player.assists = 0;
      player.yellowCards = 0;
      player.redCards = 0;
      player.minutesPlayed = 0;
    });
  }
}
