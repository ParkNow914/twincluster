import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { GameState } from '../services/GameState';
import { Trophy, ClubObjective, Achievement, NewsItem, TrainingFocus } from '../models/Club';

export default function ClubManagementScreen({ navigation }: any) {
  const [gameState] = useState(GameState.getInstance());
  const [, forceUpdate] = useState({});
  const playerTeam = gameState.getPlayerTeam();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      forceUpdate({});
    });
    return unsubscribe;
  }, [navigation]);

  // Initialize club data if not present
  if (!playerTeam.trophyList) playerTeam.trophyList = [];
  if (!playerTeam.objectives) initializeObjectives();
  if (!playerTeam.achievements) initializeAchievements();
  if (!playerTeam.news) playerTeam.news = [];
  if (!playerTeam.sponsorship) initializeSponsorship();
  if (!playerTeam.loanDeals) playerTeam.loanDeals = [];

  function initializeObjectives() {
    playerTeam.objectives = [
      {
        id: '1',
        title: 'League Position',
        description: 'Finish in top 4',
        target: 4,
        current: getCurrentLeaguePosition(),
        completed: false,
        reward: 20000000,
      },
      {
        id: '2',
        title: 'Win Matches',
        description: 'Win 15 matches this season',
        target: 15,
        current: getWins(),
        completed: false,
        reward: 10000000,
      },
      {
        id: '3',
        title: 'Youth Development',
        description: 'Promote 2 youth players',
        target: 2,
        current: 0,
        completed: false,
        reward: 5000000,
      },
    ];
  }

  function initializeAchievements() {
    playerTeam.achievements = [
      {
        id: '1',
        title: '🏆 First Victory',
        description: 'Win your first match',
        unlocked: getWins() > 0,
        icon: '⚽',
      },
      {
        id: '2',
        title: '💰 Big Spender',
        description: 'Spend $50M on transfers',
        unlocked: false,
        icon: '💵',
      },
      {
        id: '3',
        title: '🎓 Youth Developer',
        description: 'Promote 5 youth players',
        unlocked: false,
        icon: '👶',
      },
      {
        id: '4',
        title: '📊 Statistician',
        description: 'Score 50 goals in a season',
        unlocked: false,
        icon: '📈',
      },
      {
        id: '5',
        title: '🛡️ Defensive Wall',
        description: 'Keep 10 clean sheets',
        unlocked: false,
        icon: '🧱',
      },
      {
        id: '6',
        title: '💪 Unbeatable',
        description: 'Win 10 matches in a row',
        unlocked: false,
        icon: '🔥',
      },
    ];
  }

  function initializeSponsorship() {
    playerTeam.sponsorship = {
      id: '1',
      name: 'Global Sports Inc.',
      weeklyIncome: 500000,
      bonusPerWin: 100000,
      bonusPerGoal: 25000,
    };
  }

  function getCurrentLeaguePosition(): number {
    const standings = gameState.getCurrentSeason().standings;
    const teamStanding = standings.find(s => s.teamId === playerTeam.id);
    return teamStanding ? standings.indexOf(teamStanding) + 1 : 6;
  }

  function getWins(): number {
    const standings = gameState.getCurrentSeason().standings;
    const teamStanding = standings.find(s => s.teamId === playerTeam.id);
    return teamStanding ? teamStanding.wins : 0;
  }

  function setTrainingFocus(focus: TrainingFocus) {
    playerTeam.trainingProgram = {
      focus,
      weeksRemaining: 4,
      effectiveness: 75 + Math.random() * 25,
    };
    addNews('Training', `New training program: ${focus.toUpperCase()} focus for 4 weeks`);
    Alert.alert('Training Program Set', `${focus.toUpperCase()} focus training started for 4 weeks`);
    forceUpdate({});
  }

  function addNews(type: string, description: string) {
    if (!playerTeam.news) playerTeam.news = [];
    playerTeam.news.unshift({
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      title: type,
      description,
      type: 'match',
    });
    if (playerTeam.news.length > 20) playerTeam.news.pop();
  }

  function collectSponsorshipIncome() {
    if (!playerTeam.sponsorship) return;
    const income = playerTeam.sponsorship.weeklyIncome;
    playerTeam.budget += income;
    addNews('Sponsorship', `Received $${(income / 1000000).toFixed(1)}M from ${playerTeam.sponsorship.name}`);
    Alert.alert('Sponsorship Income', `Received $${(income / 1000000).toFixed(1)}M`);
    forceUpdate({});
  }

  const completedObjectives = playerTeam.objectives?.filter(o => o.completed).length || 0;
  const totalObjectives = playerTeam.objectives?.length || 0;
  const unlockedAchievements = playerTeam.achievements?.filter(a => a.unlocked).length || 0;
  const totalAchievements = playerTeam.achievements?.length || 0;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Club Management</Text>
      
      {/* Club Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Club Overview</Text>
        <View style={styles.card}>
          <Text style={styles.clubName}>{playerTeam.name}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Budget</Text>
              <Text style={styles.statValue}>${(playerTeam.budget / 1000000).toFixed(1)}M</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Trophies</Text>
              <Text style={styles.statValue}>{playerTeam.trophyList?.length || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Reputation</Text>
              <Text style={styles.statValue}>{'⭐'.repeat(playerTeam.reputation || 3)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Sponsorship */}
      {playerTeam.sponsorship && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sponsorship</Text>
          <View style={styles.card}>
            <Text style={styles.sponsorName}>{playerTeam.sponsorship.name}</Text>
            <Text style={styles.text}>Weekly Income: ${(playerTeam.sponsorship.weeklyIncome / 1000).toFixed(0)}K</Text>
            <Text style={styles.text}>Win Bonus: ${(playerTeam.sponsorship.bonusPerWin / 1000).toFixed(0)}K</Text>
            <Text style={styles.text}>Goal Bonus: ${(playerTeam.sponsorship.bonusPerGoal / 1000).toFixed(0)}K</Text>
            <TouchableOpacity style={styles.button} onPress={collectSponsorshipIncome}>
              <Text style={styles.buttonText}>Collect Weekly Income</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Training Program */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Training Program</Text>
        <View style={styles.card}>
          {playerTeam.trainingProgram ? (
            <>
              <Text style={styles.text}>
                Current Focus: <Text style={styles.highlight}>{playerTeam.trainingProgram.focus.toUpperCase()}</Text>
              </Text>
              <Text style={styles.text}>Weeks Remaining: {playerTeam.trainingProgram.weeksRemaining}</Text>
              <Text style={styles.text}>Effectiveness: {playerTeam.trainingProgram.effectiveness.toFixed(0)}%</Text>
            </>
          ) : (
            <Text style={styles.text}>No active training program</Text>
          )}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.smallButton} onPress={() => setTrainingFocus('attacking')}>
              <Text style={styles.smallButtonText}>⚔️ Attack</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallButton} onPress={() => setTrainingFocus('defending')}>
              <Text style={styles.smallButtonText}>🛡️ Defense</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallButton} onPress={() => setTrainingFocus('physical')}>
              <Text style={styles.smallButtonText}>💪 Physical</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.smallButton} onPress={() => setTrainingFocus('technical')}>
              <Text style={styles.smallButtonText}>⚽ Technical</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallButton} onPress={() => setTrainingFocus('balanced')}>
              <Text style={styles.smallButtonText}>⚖️ Balanced</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Season Objectives */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Season Objectives ({completedObjectives}/{totalObjectives})
        </Text>
        {playerTeam.objectives?.map((objective) => (
          <View key={objective.id} style={[styles.card, objective.completed && styles.completedCard]}>
            <Text style={styles.objectiveTitle}>
              {objective.completed ? '✅ ' : '⏳ '}{objective.title}
            </Text>
            <Text style={styles.text}>{objective.description}</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min((objective.current / objective.target) * 100, 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.smallText}>
              Progress: {objective.current}/{objective.target}
            </Text>
            <Text style={styles.reward}>Reward: ${(objective.reward / 1000000).toFixed(1)}M</Text>
          </View>
        ))}
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Achievements ({unlockedAchievements}/{totalAchievements})
        </Text>
        <View style={styles.achievementsGrid}>
          {playerTeam.achievements?.map((achievement) => (
            <View
              key={achievement.id}
              style={[styles.achievementCard, !achievement.unlocked && styles.lockedAchievement]}
            >
              <Text style={styles.achievementIcon}>{achievement.unlocked ? achievement.icon : '🔒'}</Text>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.smallText}>{achievement.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* News Feed */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Club News</Text>
        {playerTeam.news && playerTeam.news.length > 0 ? (
          playerTeam.news.slice(0, 10).map((newsItem) => (
            <View key={newsItem.id} style={styles.newsCard}>
              <Text style={styles.newsDate}>{newsItem.date}</Text>
              <Text style={styles.newsTitle}>{newsItem.title}</Text>
              <Text style={styles.newsText}>{newsItem.description}</Text>
            </View>
          ))
        ) : (
          <View style={styles.card}>
            <Text style={styles.text}>No recent news</Text>
          </View>
        )}
      </View>

      {/* Trophies */}
      {playerTeam.trophyList && playerTeam.trophyList.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trophy Cabinet</Text>
          {playerTeam.trophyList.map((trophy) => (
            <View key={trophy.id} style={styles.card}>
              <Text style={styles.trophyName}>🏆 {trophy.name}</Text>
              <Text style={styles.smallText}>Season {trophy.season} - {trophy.date}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: '#2196F3',
    color: 'white',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clubName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  smallText: {
    fontSize: 12,
    color: '#666',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  sponsorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  smallButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 5,
  },
  smallButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  objectiveTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  reward: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 5,
  },
  completedCard: {
    backgroundColor: '#e8f5e9',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lockedAchievement: {
    backgroundColor: '#f0f0f0',
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  newsCard: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  newsDate: {
    fontSize: 11,
    color: '#999',
    marginBottom: 3,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  newsText: {
    fontSize: 13,
    color: '#666',
  },
  trophyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
});
