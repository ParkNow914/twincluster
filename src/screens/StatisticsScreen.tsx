import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { GameState } from '../services/GameState';
import { Player } from '../models/Player';

export const StatisticsScreen = () => {
  const gameState = GameState.getInstance();
  const playerTeam = gameState.getPlayerTeam();
  const season = gameState.getCurrentSeason();
  const allTeams = gameState.getAllTeams();

  // Get all players across all teams for league-wide stats
  const allPlayers: Player[] = [];
  allTeams.forEach(team => {
    allPlayers.push(...team.players);
  });

  // Top Scorers (League-wide)
  const topScorers = [...allPlayers]
    .filter(p => p.goals > 0)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 10);

  // Top Assisters (League-wide)
  const topAssisters = [...allPlayers]
    .filter(p => p.assists > 0)
    .sort((a, b) => b.assists - a.assists)
    .slice(0, 10);

  // Most Disciplined (Fewest cards)
  const leastCards = [...allPlayers]
    .filter(p => p.gamesPlayed > 5)
    .sort((a, b) => (a.yellowCards + a.redCards * 2) - (b.yellowCards + b.redCards * 2))
    .slice(0, 5);

  // Most Active (Most minutes)
  const mostMinutes = [...allPlayers]
    .filter(p => p.minutesPlayed > 0)
    .sort((a, b) => b.minutesPlayed - a.minutesPlayed)
    .slice(0, 10);

  // Team Statistics
  const teamStats = {
    totalGoals: playerTeam.players.reduce((sum, p) => sum + p.goals, 0),
    totalAssists: playerTeam.players.reduce((sum, p) => sum + p.assists, 0),
    avgAge: Math.round(playerTeam.players.reduce((sum, p) => sum + p.age, 0) / playerTeam.players.length),
    avgMorale: Math.round(playerTeam.players.reduce((sum, p) => sum + p.morale, 0) / playerTeam.players.length),
    avgForm: (playerTeam.players.reduce((sum, p) => sum + p.form, 0) / playerTeam.players.length).toFixed(1),
    totalValue: playerTeam.players.reduce((sum, p) => sum + p.marketValue, 0),
    avgHappiness: Math.round(playerTeam.players.reduce((sum, p) => sum + (p.happiness || 75), 0) / playerTeam.players.length),
  };

  // Get team standing
  const teamStanding = season.standings.find(s => s.teamId === playerTeam.id);
  const position = season.standings
    .sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst))
    .findIndex(s => s.teamId === playerTeam.id) + 1;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 Season Statistics</Text>

      {/* Team Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Team</Text>
        <View style={styles.card}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>League Position:</Text>
            <Text style={styles.statValue}>#{position}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Points:</Text>
            <Text style={styles.statValue}>{teamStanding?.points || 0}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Goals Scored:</Text>
            <Text style={styles.statValue}>{teamStats.totalGoals}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Assists:</Text>
            <Text style={styles.statValue}>{teamStats.totalAssists}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Average Age:</Text>
            <Text style={styles.statValue}>{teamStats.avgAge} years</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Team Morale:</Text>
            <Text style={styles.statValue}>{teamStats.avgMorale}/100</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Average Form:</Text>
            <Text style={styles.statValue}>{teamStats.avgForm}/10</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Squad Happiness:</Text>
            <Text style={styles.statValue}>{teamStats.avgHappiness}%</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Squad Value:</Text>
            <Text style={styles.statValue}>${(teamStats.totalValue / 1000000).toFixed(1)}M</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Team Chemistry:</Text>
            <Text style={styles.statValue}>{playerTeam.chemistry}/100</Text>
          </View>
        </View>
      </View>

      {/* League Top Scorers */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚽ Top Scorers (League)</Text>
        {topScorers.map((player, index) => (
          <View key={player.id} style={styles.playerRow}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.playerStat}>{player.goals} goals</Text>
          </View>
        ))}
      </View>

      {/* League Top Assisters */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Top Assisters (League)</Text>
        {topAssisters.map((player, index) => (
          <View key={player.id} style={styles.playerRow}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.playerStat}>{player.assists} assists</Text>
          </View>
        ))}
      </View>

      {/* Most Minutes Played */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⏱️ Most Minutes Played</Text>
        {mostMinutes.map((player, index) => (
          <View key={player.id} style={styles.playerRow}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.playerStat}>{player.minutesPlayed} min</Text>
          </View>
        ))}
      </View>

      {/* Fair Play */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏆 Fair Play Leaders</Text>
        {leastCards.map((player, index) => (
          <View key={player.id} style={styles.playerRow}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.playerStat}>
              {player.yellowCards}🟨 {player.redCards}🟥
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    width: 40,
  },
  playerName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  playerStat: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});
