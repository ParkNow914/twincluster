import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { GameState } from '../services/GameState';
import { Player } from '../models/Player';
import { Team } from '../models/Team';

export const TransferMarketScreen = () => {
  const [gameState] = useState(() => GameState.getInstance());
  const [, forceUpdate] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const playerTeam = gameState.getPlayerTeam();

  if (!playerTeam) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>No team selected</Text>
      </SafeAreaView>
    );
  }

  // Get all players from other teams
  const availablePlayers: Array<{ player: Player; team: Team }> = [];
  gameState.getAllTeams().forEach(team => {
    if (team.id !== playerTeam.id) {
      team.players.forEach(player => {
        availablePlayers.push({ player, team });
      });
    }
  });

  // Sort by overall rating
  availablePlayers.sort((a, b) => b.player.overall - a.player.overall);

  const handleBuyPlayer = (player: Player, fromTeam: Team) => {
    if (playerTeam.budget < player.marketValue) {
      Alert.alert(
        'Insufficient Funds',
        `You need $${player.marketValue.toLocaleString()} but only have $${playerTeam.budget.toLocaleString()}.`,
        [{ text: 'OK' }]
      );
      return;
    }

    if (playerTeam.players.length >= 20) {
      Alert.alert(
        'Squad Full',
        'Your squad is full. Sell a player first.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Confirm Transfer',
      `Buy ${player.name} for $${player.marketValue.toLocaleString()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy',
          onPress: () => {
            // Remove from original team
            fromTeam.players = fromTeam.players.filter(p => p.id !== player.id);
            
            // Add to player team
            playerTeam.players.push(player);
            playerTeam.budget -= player.marketValue;
            fromTeam.budget += player.marketValue;

            Alert.alert(
              'Transfer Complete!',
              `${player.name} has joined ${playerTeam.name}!`,
              [{ text: 'OK' }]
            );

            forceUpdate(prev => prev + 1);
          },
        },
      ]
    );
  };

  const handleSellPlayer = (player: Player) => {
    Alert.alert(
      'Confirm Sale',
      `Sell ${player.name} for $${player.marketValue.toLocaleString()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sell',
          onPress: () => {
            // Remove from player team
            playerTeam.players = playerTeam.players.filter(p => p.id !== player.id);
            playerTeam.budget += player.marketValue;

            Alert.alert(
              'Player Sold!',
              `${player.name} has been sold for $${player.marketValue.toLocaleString()}`,
              [{ text: 'OK' }]
            );

            setSelectedPlayer(null);
            forceUpdate(prev => prev + 1);
          },
        },
      ]
    );
  };

  const renderPlayerCard = (player: Player, team: Team, isMyPlayer: boolean) => (
    <TouchableOpacity
      key={player.id}
      style={[styles.playerCard, isMyPlayer && styles.myPlayerCard]}
      onPress={() => setSelectedPlayer(player)}
    >
      <View style={styles.playerHeader}>
        <Text style={styles.playerName}>{player.name}</Text>
        <Text style={styles.playerRating}>{player.overall}</Text>
      </View>
      <View style={styles.playerInfo}>
        <Text style={styles.playerDetail}>{player.position}</Text>
        <Text style={styles.playerDetail}>{player.age} yrs</Text>
        <Text style={styles.playerDetail}>{player.nationality}</Text>
      </View>
      <View style={styles.playerStats}>
        <Text style={styles.stat}>PAC {player.pace}</Text>
        <Text style={styles.stat}>SHO {player.shooting}</Text>
        <Text style={styles.stat}>PAS {player.passing}</Text>
        <Text style={styles.stat}>DRI {player.dribbling}</Text>
        <Text style={styles.stat}>DEF {player.defending}</Text>
        <Text style={styles.stat}>PHY {player.physical}</Text>
      </View>
      <View style={styles.playerFooter}>
        <Text style={styles.teamName}>{team.name}</Text>
        <Text style={styles.marketValue}>${(player.marketValue / 1000000).toFixed(1)}M</Text>
      </View>
      {isMyPlayer ? (
        <TouchableOpacity
          style={styles.sellButton}
          onPress={() => handleSellPlayer(player)}
        >
          <Text style={styles.sellButtonText}>Sell</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => handleBuyPlayer(player, team)}
        >
          <Text style={styles.buyButtonText}>Buy</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Transfer Market</Text>
          <Text style={styles.budget}>Budget: ${(playerTeam.budget / 1000000).toFixed(1)}M</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Your Squad (Sell)</Text>
          <Text style={styles.sectionSubtitle}>
            {playerTeam.players.length} players • Tap to sell
          </Text>
          {playerTeam.players.map(player => 
            renderPlayerCard(player, playerTeam, true)
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛒 Available Players (Buy)</Text>
          <Text style={styles.sectionSubtitle}>
            {availablePlayers.length} players available
          </Text>
          {availablePlayers.slice(0, 30).map(({ player, team }) => 
            renderPlayerCard(player, team, false)
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
  budget: {
    fontSize: 18,
    color: '#4caf50',
    marginTop: 5,
    fontWeight: 'bold',
  },
  section: {
    margin: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  playerCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  myPlayerCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
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
  playerRating: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  playerInfo: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 10,
  },
  playerDetail: {
    fontSize: 12,
    color: '#666',
  },
  playerStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  stat: {
    fontSize: 11,
    color: '#666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  playerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  teamName: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  marketValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  buyButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sellButton: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  sellButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
