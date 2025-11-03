import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { GameState } from '../services/GameState';
import { SaveLoadService } from '../services/SaveLoadService';

export const HomeScreen = () => {
  const [gameState] = useState(() => GameState.getInstance());
  const [, forceUpdate] = useState(0);
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    checkForSave();
  }, []);

  const checkForSave = async () => {
    const saveExists = await SaveLoadService.hasSave();
    setHasSave(saveExists);
  };

  const handleSave = async () => {
    const success = await SaveLoadService.saveGame();
    if (success) {
      Alert.alert('Success', 'Game saved successfully!', [{ text: 'OK' }]);
      setHasSave(true);
    } else {
      Alert.alert('Error', 'Failed to save game', [{ text: 'OK' }]);
    }
  };

  const handleLoad = async () => {
    Alert.alert(
      'Load Game',
      'This will overwrite your current progress. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Load',
          onPress: async () => {
            const success = await SaveLoadService.loadGame();
            if (success) {
              Alert.alert('Success', 'Game loaded successfully!', [{ text: 'OK' }]);
              forceUpdate(prev => prev + 1);
            } else {
              Alert.alert('Error', 'Failed to load game', [{ text: 'OK' }]);
            }
          },
        },
      ]
    );
  };

  const playerTeam = gameState.getPlayerTeam();
  const upcomingMatches = gameState.getUpcomingMatches(3);
  const recentMatches = gameState.getRecentMatches(3);
  const topPlayers = gameState.getTeamTopPlayers();

  const handleSimulateMatch = () => {
    gameState.simulateNextMatch();
    forceUpdate(prev => prev + 1);
  };

  if (!playerTeam) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>No team selected</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{playerTeam.name}</Text>
          <Text style={styles.subtitle}>{playerTeam.league}</Text>
          <Text style={styles.budget}>
            Budget: ${(playerTeam.budget / 1000000).toFixed(1)}M
          </Text>
          <Text style={styles.chemistry}>
            Team Chemistry: {playerTeam.chemistry}/100 ⚡
          </Text>
        </View>

        <View style={styles.saveLoadSection}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>💾 Save Game</Text>
          </TouchableOpacity>
          {hasSave && (
            <TouchableOpacity
              style={styles.loadButton}
              onPress={handleLoad}
            >
              <Text style={styles.loadButtonText}>📂 Load Game</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSimulateMatch}
          >
            <Text style={styles.actionButtonText}>
              ▶️ Simulate Next Match
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Upcoming Matches</Text>
          {upcomingMatches.length === 0 ? (
            <Text style={styles.emptyText}>No upcoming matches</Text>
          ) : (
            upcomingMatches.map((match) => {
              const homeTeam = gameState.getTeamById(match.homeTeamId);
              const awayTeam = gameState.getTeamById(match.awayTeamId);
              return (
                <View key={match.id} style={styles.matchCard}>
                  <Text style={styles.matchText}>
                    {homeTeam?.shortName} vs {awayTeam?.shortName}
                  </Text>
                  <Text style={styles.matchCompetition}>
                    {match.competition}
                  </Text>
                </View>
              );
            })
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Recent Results</Text>
          {recentMatches.length === 0 ? (
            <Text style={styles.emptyText}>No recent matches</Text>
          ) : (
            recentMatches.map((match) => {
              const homeTeam = gameState.getTeamById(match.homeTeamId);
              const awayTeam = gameState.getTeamById(match.awayTeamId);
              return (
                <View key={match.id} style={styles.matchCard}>
                  <Text style={styles.matchText}>
                    {homeTeam?.shortName} {match.homeScore} - {match.awayScore}{' '}
                    {awayTeam?.shortName}
                  </Text>
                  <Text style={styles.matchCompetition}>
                    {match.competition}
                  </Text>
                </View>
              );
            })
          )}
        </View>

        {(topPlayers.scorers.length > 0 || topPlayers.assisters.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⭐ Top Performers</Text>
            {topPlayers.scorers.length > 0 && (
              <View style={styles.topPlayersCard}>
                <Text style={styles.topPlayersTitle}>Top Scorers</Text>
                {topPlayers.scorers.slice(0, 3).map((player) => (
                  <Text key={player.id} style={styles.topPlayerText}>
                    ⚽ {player.name}: {player.goals} goals
                  </Text>
                ))}
              </View>
            )}
            {topPlayers.assisters.length > 0 && (
              <View style={styles.topPlayersCard}>
                <Text style={styles.topPlayersTitle}>Top Assisters</Text>
                {topPlayers.assisters.slice(0, 3).map((player) => (
                  <Text key={player.id} style={styles.topPlayerText}>
                    👟 {player.name}: {player.assists} assists
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 League Standings (Top 6)</Text>
          {gameState.season.standings.slice(0, 6).map((standing, index) => {
            const team = gameState.getTeamById(standing.teamId);
            return (
              <View
                key={standing.teamId}
                style={[
                  styles.standingRow,
                  team?.id === playerTeam.id && styles.playerTeamRow,
                ]}
              >
                <Text style={styles.standingPosition}>{index + 1}</Text>
                <Text style={styles.standingTeam}>{team?.shortName}</Text>
                <Text style={styles.standingStats}>
                  {standing.played}
                </Text>
                <Text style={styles.standingStats}>
                  {standing.won}-{standing.drawn}-{standing.lost}
                </Text>
                <Text style={styles.standingPoints}>{standing.points}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1a237e',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#b0bec5',
    marginTop: 5,
  },
  budget: {
    fontSize: 14,
    color: '#4caf50',
    marginTop: 5,
  },
  chemistry: {
    fontSize: 14,
    color: '#ff9800',
    marginTop: 5,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  saveLoadSection: {
    flexDirection: 'row',
    gap: 10,
    margin: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadButton: {
    flex: 1,
    backgroundColor: '#ff9800',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  matchCard: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#1a237e',
  },
  matchText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  matchCompetition: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  standingRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  playerTeamRow: {
    backgroundColor: '#e3f2fd',
  },
  standingPosition: {
    width: 30,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  standingTeam: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  standingStats: {
    width: 60,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  standingPoints: {
    width: 40,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a237e',
    textAlign: 'center',
  },
  topPlayersCard: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4caf50',
  },
  topPlayersTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  topPlayerText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
});
