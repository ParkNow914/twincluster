import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { GameState } from '../services/GameState';

export const StandingsScreen = () => {
  const [gameState] = useState(() => GameState.getInstance());
  const playerTeam = gameState.getPlayerTeam();

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
          <Text style={styles.title}>League Standings</Text>
          <Text style={styles.subtitle}>Season {gameState.season.year}</Text>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.headerPos}>#</Text>
          <Text style={styles.headerTeam}>Team</Text>
          <Text style={styles.headerStat}>P</Text>
          <Text style={styles.headerStat}>W</Text>
          <Text style={styles.headerStat}>D</Text>
          <Text style={styles.headerStat}>L</Text>
          <Text style={styles.headerStat}>GF</Text>
          <Text style={styles.headerStat}>GA</Text>
          <Text style={styles.headerStat}>GD</Text>
          <Text style={styles.headerPts}>Pts</Text>
        </View>

        <View style={styles.table}>
          {gameState.season.standings.map((standing, index) => {
            const team = gameState.getTeamById(standing.teamId);
            const goalDiff = standing.goalsFor - standing.goalsAgainst;
            const isPlayerTeam = team?.id === playerTeam.id;

            return (
              <View
                key={standing.teamId}
                style={[
                  styles.tableRow,
                  isPlayerTeam && styles.playerTeamRow,
                  index < 4 && styles.championsLeagueRow,
                  index >= gameState.season.standings.length - 3 &&
                    styles.relegationRow,
                ]}
              >
                <Text style={styles.cellPos}>{index + 1}</Text>
                <Text style={styles.cellTeam} numberOfLines={1}>
                  {team?.shortName}
                </Text>
                <Text style={styles.cellStat}>{standing.played}</Text>
                <Text style={styles.cellStat}>{standing.won}</Text>
                <Text style={styles.cellStat}>{standing.drawn}</Text>
                <Text style={styles.cellStat}>{standing.lost}</Text>
                <Text style={styles.cellStat}>{standing.goalsFor}</Text>
                <Text style={styles.cellStat}>{standing.goalsAgainst}</Text>
                <Text
                  style={[
                    styles.cellStat,
                    goalDiff > 0 && styles.positiveGD,
                    goalDiff < 0 && styles.negativeGD,
                  ]}
                >
                  {goalDiff > 0 ? '+' : ''}
                  {goalDiff}
                </Text>
                <Text style={styles.cellPts}>{standing.points}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Legend</Text>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#e8f5e9' }]} />
            <Text style={styles.legendText}>Champions League</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#ffebee' }]} />
            <Text style={styles.legendText}>Relegation Zone</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#e3f2fd' }]} />
            <Text style={styles.legendText}>Your Team</Text>
          </View>
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
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginTop: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#1a237e',
  },
  headerPos: {
    width: 30,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  headerTeam: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  headerStat: {
    width: 30,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  headerPts: {
    width: 40,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  table: {
    backgroundColor: '#fff',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  playerTeamRow: {
    backgroundColor: '#e3f2fd',
  },
  championsLeagueRow: {
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
    backgroundColor: '#e8f5e9',
  },
  relegationRow: {
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
    backgroundColor: '#ffebee',
  },
  cellPos: {
    width: 30,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  cellTeam: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  cellStat: {
    width: 30,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  cellPts: {
    width: 40,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a237e',
    textAlign: 'center',
  },
  positiveGD: {
    color: '#4caf50',
    fontWeight: '600',
  },
  negativeGD: {
    color: '#f44336',
    fontWeight: '600',
  },
  legend: {
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
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 30,
    height: 20,
    borderRadius: 3,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
});
