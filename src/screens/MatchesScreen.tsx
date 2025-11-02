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

export const MatchesScreen = () => {
  const [gameState] = useState(() => GameState.getInstance());
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [, forceUpdate] = useState(0);

  const playerTeam = gameState.getPlayerTeam();
  const upcomingMatches = gameState.getUpcomingMatches(10);
  const recentMatches = gameState.getRecentMatches(10);

  const handleSimulateMatch = () => {
    const result = gameState.simulateNextMatch();
    if (result) {
      setSelectedMatch(result);
    }
    forceUpdate(prev => prev + 1);
  };

  const renderMatchCard = (match: any, showScore: boolean) => {
    const homeTeam = gameState.getTeamById(match.homeTeamId);
    const awayTeam = gameState.getTeamById(match.awayTeamId);

    return (
      <TouchableOpacity
        key={match.id}
        style={styles.matchCard}
        onPress={() => showScore && setSelectedMatch(match)}
      >
        <View style={styles.matchHeader}>
          <Text style={styles.competition}>{match.competition}</Text>
          {showScore && <Text style={styles.playedBadge}>✓ Played</Text>}
        </View>
        <View style={styles.matchContent}>
          <View style={styles.teamContainer}>
            <Text style={styles.teamName}>{homeTeam?.name}</Text>
            <Text style={styles.teamShort}>{homeTeam?.shortName}</Text>
          </View>
          {showScore ? (
            <View style={styles.scoreContainer}>
              <Text style={styles.score}>
                {match.homeScore} - {match.awayScore}
              </Text>
            </View>
          ) : (
            <View style={styles.vsContainer}>
              <Text style={styles.vsText}>VS</Text>
            </View>
          )}
          <View style={styles.teamContainer}>
            <Text style={styles.teamName}>{awayTeam?.name}</Text>
            <Text style={styles.teamShort}>{awayTeam?.shortName}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!playerTeam) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>No team selected</Text>
      </SafeAreaView>
    );
  }

  if (selectedMatch) {
    const homeTeam = gameState.getTeamById(selectedMatch.homeTeamId);
    const awayTeam = gameState.getTeamById(selectedMatch.awayTeamId);

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setSelectedMatch(null)}
              style={styles.backButton}
            >
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Match Report</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.competition}>{selectedMatch.competition}</Text>
            <View style={styles.resultTeams}>
              <View style={styles.resultTeam}>
                <Text style={styles.resultTeamName}>{homeTeam?.shortName}</Text>
                <Text style={styles.resultScore}>{selectedMatch.homeScore}</Text>
              </View>
              <Text style={styles.resultDash}>-</Text>
              <View style={styles.resultTeam}>
                <Text style={styles.resultScore}>{selectedMatch.awayScore}</Text>
                <Text style={styles.resultTeamName}>{awayTeam?.shortName}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚽ Match Events</Text>
            {selectedMatch.events.length === 0 ? (
              <Text style={styles.emptyText}>No events recorded</Text>
            ) : (
              selectedMatch.events.map((event: any, index: number) => (
                <View key={index} style={styles.eventCard}>
                  <Text style={styles.eventMinute}>{event.minute}'</Text>
                  <Text style={styles.eventDescription}>{event.description}</Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Matches</Text>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.simulateButton}
            onPress={handleSimulateMatch}
          >
            <Text style={styles.simulateButtonText}>⚡ Simulate Next Match</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Upcoming Fixtures</Text>
          {upcomingMatches.length === 0 ? (
            <Text style={styles.emptyText}>No upcoming matches</Text>
          ) : (
            upcomingMatches.map(match => renderMatchCard(match, false))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Recent Results</Text>
          {recentMatches.length === 0 ? (
            <Text style={styles.emptyText}>No recent matches</Text>
          ) : (
            recentMatches.map(match => renderMatchCard(match, true))
          )}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
  },
  actionSection: {
    padding: 10,
  },
  simulateButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  simulateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  matchCard: {
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
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  competition: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  playedBadge: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: 'bold',
  },
  matchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  teamShort: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  scoreContainer: {
    paddingHorizontal: 20,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  vsContainer: {
    paddingHorizontal: 20,
  },
  vsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  resultCard: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  resultTeam: {
    alignItems: 'center',
  },
  resultTeamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  resultScore: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  resultDash: {
    fontSize: 24,
    color: '#999',
    marginHorizontal: 20,
  },
  eventCard: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4caf50',
  },
  eventMinute: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a237e',
    width: 40,
  },
  eventDescription: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
});
