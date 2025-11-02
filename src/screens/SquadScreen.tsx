import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { GameState } from '../services/GameState';

export const SquadScreen = () => {
  const [gameState] = useState(() => GameState.getInstance());
  const playerTeam = gameState.getPlayerTeam();

  if (!playerTeam) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>No team selected</Text>
      </SafeAreaView>
    );
  }

  // Group players by position
  const getPlayersByPosition = (positions: string[]) => {
    return playerTeam.players.filter(p => positions.includes(p.position));
  };

  const goalkeepers = getPlayersByPosition(['GK']);
  const defenders = getPlayersByPosition(['LB', 'CB', 'RB']);
  const midfielders = getPlayersByPosition(['LM', 'CM', 'RM', 'CAM', 'CDM']);
  const forwards = getPlayersByPosition(['LW', 'RW', 'ST']);

  const renderPlayer = (player: any) => (
    <View key={player.id} style={styles.playerCard}>
      <View style={styles.playerHeader}>
        <Text style={styles.playerName}>{player.name}</Text>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{player.overall}</Text>
        </View>
      </View>
      <View style={styles.playerInfo}>
        <Text style={styles.playerDetail}>
          {player.position} • Age: {player.age} • {player.nationality}
        </Text>
        <Text style={styles.playerForm}>
          Form: {'⭐'.repeat(Math.min(5, Math.floor(player.form / 2)))}
        </Text>
      </View>
      <View style={styles.statsRow}>
        <Text style={styles.stat}>PAC {player.pace}</Text>
        <Text style={styles.stat}>SHO {player.shooting}</Text>
        <Text style={styles.stat}>PAS {player.passing}</Text>
        <Text style={styles.stat}>DRI {player.dribbling}</Text>
        <Text style={styles.stat}>DEF {player.defending}</Text>
        <Text style={styles.stat}>PHY {player.physical}</Text>
      </View>
      {player.injured && (
        <Text style={styles.injuredText}>🚑 Injured</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{playerTeam.name} Squad</Text>
          <Text style={styles.subtitle}>
            Formation: {playerTeam.formation}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧤 Goalkeepers</Text>
          {goalkeepers.map(renderPlayer)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛡️ Defenders</Text>
          {defenders.map(renderPlayer)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Midfielders</Text>
          {midfielders.map(renderPlayer)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚔️ Forwards</Text>
          {forwards.map(renderPlayer)}
        </View>

        <View style={styles.teamStats}>
          <Text style={styles.teamStatsTitle}>Team Statistics</Text>
          <Text style={styles.teamStatText}>
            Squad Size: {playerTeam.players.length}
          </Text>
          <Text style={styles.teamStatText}>
            Average Age:{' '}
            {(
              playerTeam.players.reduce((sum, p) => sum + p.age, 0) /
              playerTeam.players.length
            ).toFixed(1)}
          </Text>
          <Text style={styles.teamStatText}>
            Average Rating:{' '}
            {(
              playerTeam.players.reduce((sum, p) => sum + p.overall, 0) /
              playerTeam.players.length
            ).toFixed(1)}
          </Text>
          <Text style={styles.teamStatText}>
            Total Market Value: $
            {(
              playerTeam.players.reduce((sum, p) => sum + p.marketValue, 0) /
              1000000
            ).toFixed(1)}
            M
          </Text>
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
  },
  subtitle: {
    fontSize: 16,
    color: '#b0bec5',
    marginTop: 5,
  },
  section: {
    margin: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5,
    color: '#333',
  },
  playerCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  ratingBadge: {
    backgroundColor: '#4caf50',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerInfo: {
    marginBottom: 8,
  },
  playerDetail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  playerForm: {
    fontSize: 12,
    color: '#ff9800',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  stat: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
  },
  injuredText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 8,
    fontWeight: 'bold',
  },
  teamStats: {
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
  teamStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  teamStatText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});
