import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { GameState } from '../services/GameState';

export const ManagerProfileScreen = () => {
  const gameState = GameState.getInstance();
  const team = gameState.getPlayerTeam();
  
  // Manager profile data (would be in GameState in full implementation)
  const manager = {
    name: 'Your Name',
    nationality: 'Your Country',
    age: 35,
    reputation: 75,
    experience: 3,
    careerStats: {
      matchesManaged: 156,
      wins: 89,
      draws: 34,
      losses: 33,
      trophiesWon: 2,
      clubsManaged: 2,
    },
    seasonStats: {
      matchesPlayed: gameState.getCurrentSeason().matches.filter(m => m.played && (m.homeTeamId === team.id || m.awayTeamId === team.id)).length,
      wins: gameState.getCurrentSeason().matches.filter(m => m.played && (
        (m.homeTeamId === team.id && m.homeScore! > m.awayScore!) ||
        (m.awayTeamId === team.id && m.awayScore! > m.homeScore!)
      )).length,
      draws: gameState.getCurrentSeason().matches.filter(m => m.played && (m.homeTeamId === team.id || m.awayTeamId === team.id) && m.homeScore === m.awayScore).length,
      losses: gameState.getCurrentSeason().matches.filter(m => m.played && (
        (m.homeTeamId === team.id && m.homeScore! < m.awayScore!) ||
        (m.awayTeamId === team.id && m.awayScore! < m.homeScore!)
      )).length,
    },
    preferredFormation: team.formation,
    managementStyle: 'Balanced' as const,
  };

  const winRate = manager.careerStats.matchesManaged > 0 
    ? (manager.careerStats.wins / manager.careerStats.matchesManaged * 100).toFixed(1) 
    : '0.0';

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Manager Profile</Text>
      
      {/* Basic Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{manager.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Nationality:</Text>
          <Text style={styles.value}>{manager.nationality}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>{manager.age} years</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Experience:</Text>
          <Text style={styles.value}>{manager.experience} years</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Reputation:</Text>
          <Text style={styles.value}>{manager.reputation}/100</Text>
        </View>
      </View>

      {/* Career Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Career Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{manager.careerStats.matchesManaged}</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, {color: '#4CAF50'}]}>{manager.careerStats.wins}</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, {color: '#FFC107'}]}>{manager.careerStats.draws}</Text>
            <Text style={styles.statLabel}>Draws</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, {color: '#F44336'}]}>{manager.careerStats.losses}</Text>
            <Text style={styles.statLabel}>Losses</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{winRate}%</Text>
            <Text style={styles.statLabel}>Win Rate</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, {color: '#FFD700'}]}>{manager.careerStats.trophiesWon}</Text>
            <Text style={styles.statLabel}>Trophies</Text>
          </View>
        </View>
      </View>

      {/* Season Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Season</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{manager.seasonStats.matchesPlayed}</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, {color: '#4CAF50'}]}>{manager.seasonStats.wins}</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, {color: '#FFC107'}]}>{manager.seasonStats.draws}</Text>
            <Text style={styles.statLabel}>Draws</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, {color: '#F44336'}]}>{manager.seasonStats.losses}</Text>
            <Text style={styles.statLabel}>Losses</Text>
          </View>
        </View>
      </View>

      {/* Management Style */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Management Style</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Preferred Formation:</Text>
          <Text style={styles.value}>{manager.preferredFormation}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Style:</Text>
          <Text style={styles.value}>{manager.managementStyle}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Current Club:</Text>
          <Text style={styles.value}>{team.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Clubs Managed:</Text>
          <Text style={styles.value}>{manager.careerStats.clubsManaged}</Text>
        </View>
      </View>

      {/* Achievements Highlight */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Career Highlights</Text>
        <Text style={styles.highlight}>🏆 {manager.careerStats.trophiesWon} Trophies Won</Text>
        <Text style={styles.highlight}>⚽ {manager.careerStats.wins} Career Victories</Text>
        <Text style={styles.highlight}>📊 {winRate}% Career Win Rate</Text>
        <Text style={styles.highlight}>🎖️ Reputation: {manager.reputation}/100</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2196F3',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    width: '30%',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  highlight: {
    fontSize: 16,
    paddingVertical: 8,
    color: '#333',
  },
});
