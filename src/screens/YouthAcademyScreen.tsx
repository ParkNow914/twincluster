import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { GameState } from '../services/GameState';
import { Player, Position } from '../models/Player';
import { nanoid } from 'nanoid';

export const YouthAcademyScreen = () => {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const gameState = GameState.getInstance();
  const playerTeam = gameState.getPlayerTeam();

  // Initialize youth academy if not exists
  if (!playerTeam.youthPlayers) {
    playerTeam.youthPlayers = generateYouthPlayers(3);
  }

  const promotePlayer = (player: Player) => {
    Alert.alert(
      'Promote Player',
      `Promote ${player.name} to first team? This will cost $${(player.marketValue / 1000000).toFixed(1)}M in development fees.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Promote',
          onPress: () => {
            const cost = player.marketValue;
            if (playerTeam.budget < cost) {
              Alert.alert('Insufficient Budget', `You need $${(cost / 1000000).toFixed(1)}M to promote this player.`);
              return;
            }

            if (playerTeam.players.length >= 20) {
              Alert.alert('Squad Full', 'You have reached the maximum squad size of 20 players.');
              return;
            }

            playerTeam.budget -= cost;
            playerTeam.players.push(player);
            playerTeam.youthPlayers = playerTeam.youthPlayers?.filter(p => p.id !== player.id);
            
            Alert.alert('Success', `${player.name} has been promoted to the first team!`);
            setRefreshKey(prev => prev + 1);
          },
        },
      ]
    );
  };

  const scoutNewTalent = () => {
    const cost = 5000000; // $5M scouting cost
    if (playerTeam.budget < cost) {
      Alert.alert('Insufficient Budget', `You need $${cost / 1000000}M to scout new talent.`);
      return;
    }

    if ((playerTeam.youthPlayers?.length || 0) >= 10) {
      Alert.alert('Academy Full', 'Your youth academy is at maximum capacity (10 players).');
      return;
    }

    playerTeam.budget -= cost;
    const newYouthPlayer = generateYouthPlayers(1)[0];
    playerTeam.youthPlayers?.push(newYouthPlayer);
    
    Alert.alert(
      'New Talent Discovered!',
      `Your scouts have found ${newYouthPlayer.name}, a ${newYouthPlayer.age}-year-old ${newYouthPlayer.position} with ${newYouthPlayer.overall} overall rating and ${newYouthPlayer.potential} potential!`
    );
    setRefreshKey(prev => prev + 1);
  };

  const trainYouth = (player: Player) => {
    const cost = 1000000; // $1M training cost
    if (playerTeam.budget < cost) {
      Alert.alert('Insufficient Budget', `You need $${cost / 1000000}M to train this player.`);
      return;
    }

    playerTeam.budget -= cost;
    
    // Improve random attributes
    const improvements = Math.floor(Math.random() * 3) + 1; // 1-3 points
    const canImprove = player.overall < player.potential;
    
    if (canImprove) {
      const attrs = ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'];
      const attr = attrs[Math.floor(Math.random() * attrs.length)] as keyof Player;
      
      if (typeof player[attr] === 'number') {
        (player[attr] as number) = Math.min(99, (player[attr] as number) + improvements);
        player.overall = Math.min(player.potential, player.overall + 1);
        player.morale = Math.min(100, player.morale + 5);
      }
    }

    Alert.alert('Training Complete', `${player.name} has improved through training!`);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🎓 Youth Academy</Text>

      {/* Budget Display */}
      <View style={styles.budgetCard}>
        <Text style={styles.budgetLabel}>Available Budget:</Text>
        <Text style={styles.budgetValue}>${(playerTeam.budget / 1000000).toFixed(1)}M</Text>
      </View>

      {/* Scout Button */}
      <TouchableOpacity style={styles.scoutButton} onPress={scoutNewTalent}>
        <Text style={styles.scoutButtonText}>🔍 Scout New Talent ($5M)</Text>
      </TouchableOpacity>

      {/* Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          💡 Develop young talents in your academy. Train them to improve their skills, and promote the best ones to your first team!
        </Text>
      </View>

      {/* Youth Players */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Youth Players ({playerTeam.youthPlayers?.length || 0}/10)</Text>
        {(!playerTeam.youthPlayers || playerTeam.youthPlayers.length === 0) ? (
          <Text style={styles.emptyText}>No youth players. Scout some talent!</Text>
        ) : (
          playerTeam.youthPlayers.map(player => (
            <View key={player.id} style={styles.playerCard}>
              <View style={styles.playerHeader}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerPosition}>{player.position}</Text>
              </View>
              
              <View style={styles.playerInfo}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Age:</Text>
                  <Text style={styles.value}>{player.age}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Overall:</Text>
                  <Text style={styles.value}>{player.overall}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Potential:</Text>
                  <Text style={[styles.value, styles.potential]}>{player.potential}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Nationality:</Text>
                  <Text style={styles.value}>{player.nationality}</Text>
                </View>
              </View>

              {/* Attributes */}
              <View style={styles.attributes}>
                <View style={styles.attrRow}>
                  <Text style={styles.attrLabel}>PAC: {player.pace}</Text>
                  <Text style={styles.attrLabel}>SHO: {player.shooting}</Text>
                  <Text style={styles.attrLabel}>PAS: {player.passing}</Text>
                </View>
                <View style={styles.attrRow}>
                  <Text style={styles.attrLabel}>DRI: {player.dribbling}</Text>
                  <Text style={styles.attrLabel}>DEF: {player.defending}</Text>
                  <Text style={styles.attrLabel}>PHY: {player.physical}</Text>
                </View>
              </View>

              <View style={styles.playerFooter}>
                <Text style={styles.valueText}>
                  Value: ${(player.marketValue / 1000000).toFixed(1)}M
                </Text>
                <View style={styles.actions}>
                  <TouchableOpacity 
                    style={styles.trainButton}
                    onPress={() => trainYouth(player)}
                  >
                    <Text style={styles.trainButtonText}>Train ($1M)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.promoteButton}
                    onPress={() => promotePlayer(player)}
                  >
                    <Text style={styles.promoteButtonText}>Promote</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

// Generate youth players
function generateYouthPlayers(count: number): Player[] {
  const firstNames = ['Marcus', 'Oliver', 'Lucas', 'James', 'Thomas', 'Daniel', 'Samuel', 'Alexander', 'William', 'Benjamin'];
  const lastNames = ['Silva', 'Johnson', 'Martinez', 'Brown', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Moore', 'Garcia'];
  const nationalities = ['England', 'Spain', 'Germany', 'France', 'Italy', 'Brazil', 'Argentina', 'Portugal', 'Netherlands', 'Belgium'];
  const positions = [Position.ST, Position.CAM, Position.CM, Position.CB, Position.LB, Position.RB, Position.LW, Position.RW, Position.CDM];

  const players: Player[] = [];
  
  for (let i = 0; i < count; i++) {
    const age = Math.floor(Math.random() * 5) + 16; // 16-20 years old
    const baseRating = Math.floor(Math.random() * 20) + 45; // 45-65 base rating
    const potential = Math.floor(Math.random() * 25) + baseRating + 10; // +10 to +35 potential

    const pace = Math.floor(Math.random() * 30) + 50;
    const shooting = Math.floor(Math.random() * 30) + 40;
    const passing = Math.floor(Math.random() * 30) + 40;
    const dribbling = Math.floor(Math.random() * 30) + 45;
    const defending = Math.floor(Math.random() * 30) + 35;
    const physical = Math.floor(Math.random() * 30) + 40;

    const overall = Math.floor((pace + shooting + passing + dribbling + defending + physical) / 6);

    players.push({
      id: nanoid(),
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      age,
      position: positions[Math.floor(Math.random() * positions.length)],
      nationality: nationalities[Math.floor(Math.random() * nationalities.length)],
      overall,
      potential: Math.min(99, potential),
      pace,
      shooting,
      passing,
      dribbling,
      defending,
      physical,
      stamina: 90,
      maxStamina: 90,
      morale: 75,
      form: 5,
      injured: false,
      injuryDaysRemaining: 0,
      marketValue: overall * 100000, // Based on rating
      gamesPlayed: 0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      minutesPlayed: 0,
      wage: overall * 5000, // Lower wages for youth
      contractYears: 3,
      happiness: 80,
    });
  }

  return players;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  budgetCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  budgetLabel: {
    fontSize: 16,
    color: '#666',
  },
  budgetValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  scoutButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  scoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    padding: 32,
  },
  playerCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
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
    marginBottom: 12,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  playerPosition: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  playerInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
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
  potential: {
    color: '#4CAF50',
  },
  attributes: {
    marginBottom: 12,
  },
  attrRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 4,
  },
  attrLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  playerFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  valueText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  trainButton: {
    flex: 1,
    backgroundColor: '#FF9800',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
  },
  trainButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  promoteButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
  },
  promoteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
