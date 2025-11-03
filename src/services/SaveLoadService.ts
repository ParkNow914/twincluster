import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState } from './GameState';

const SAVE_KEY = '@football_manager_save';

export class SaveLoadService {
  /**
   * Save the current game state
   */
  static async saveGame(): Promise<boolean> {
    try {
      const gameState = GameState.getInstance();
      const saveData = {
        teams: gameState.getAllTeams(),
        season: gameState.getCurrentSeason(),
        timestamp: new Date().toISOString(),
      };

      await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }

  /**
   * Load a saved game
   */
  static async loadGame(): Promise<boolean> {
    try {
      const savedData = await AsyncStorage.getItem(SAVE_KEY);
      
      if (!savedData) {
        return false;
      }

      const saveData = JSON.parse(savedData);
      const gameState = GameState.getInstance();
      
      // Restore teams
      saveData.teams.forEach((savedTeam: any, index: number) => {
        const team = gameState.getAllTeams()[index];
        if (team) {
          Object.assign(team, savedTeam);
        }
      });

      // Restore season
      if (saveData.season) {
        const season = gameState.getCurrentSeason();
        Object.assign(season, saveData.season);
      }

      return true;
    } catch (error) {
      console.error('Failed to load game:', error);
      return false;
    }
  }

  /**
   * Check if a save exists
   */
  static async hasSave(): Promise<boolean> {
    try {
      const savedData = await AsyncStorage.getItem(SAVE_KEY);
      return savedData !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Delete saved game
   */
  static async deleteSave(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(SAVE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to delete save:', error);
      return false;
    }
  }

  /**
   * Get save file info
   */
  static async getSaveInfo(): Promise<{ timestamp: string } | null> {
    try {
      const savedData = await AsyncStorage.getItem(SAVE_KEY);
      
      if (!savedData) {
        return null;
      }

      const saveData = JSON.parse(savedData);
      return {
        timestamp: saveData.timestamp,
      };
    } catch (error) {
      return null;
    }
  }
}
