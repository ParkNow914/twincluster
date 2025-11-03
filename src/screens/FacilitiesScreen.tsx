import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { GameState } from '../services/GameState';

interface Facility {
  name: string;
  level: number;
  maxLevel: number;
  upgradeCost: number;
  description: string;
  effect: string;
}

export default function FacilitiesScreen() {
  const gameState = GameState.getInstance();
  const playerTeam = gameState.getPlayerTeam();
  
  const [facilities, setFacilities] = useState<Facility[]>([
    {
      name: '🏟️ Stadium',
      level: 3,
      maxLevel: 5,
      upgradeCost: 50000000,
      description: 'Increase stadium capacity and matchday revenue',
      effect: '+15% matchday income per level'
    },
    {
      name: '🏋️ Training Center',
      level: 4,
      maxLevel: 5,
      upgradeCost: 30000000,
      description: 'Better facilities improve player development',
      effect: '+10% training effectiveness per level'
    },
    {
      name: '🏥 Medical Center',
      level: 3,
      maxLevel: 5,
      upgradeCost: 20000000,
      description: 'Reduce injury recovery time',
      effect: '-15% injury duration per level'
    },
    {
      name: '🔍 Scouting Network',
      level: 2,
      maxLevel: 5,
      upgradeCost: 15000000,
      description: 'Discover better youth talent',
      effect: '+20% youth potential per level'
    },
    {
      name: '📊 Analytics Department',
      level: 2,
      maxLevel: 5,
      upgradeCost: 10000000,
      description: 'Better match analysis and tactics',
      effect: '+5% tactical effectiveness per level'
    }
  ]);

  const upgradeFacility = (index: number) => {
    const facility = facilities[index];
    
    if (facility.level >= facility.maxLevel) {
      Alert.alert('Max Level', `${facility.name} is already at maximum level!`);
      return;
    }

    if (playerTeam.budget < facility.upgradeCost) {
      Alert.alert('Insufficient Funds', `You need $${(facility.upgradeCost / 1000000).toFixed(1)}M to upgrade ${facility.name}`);
      return;
    }

    Alert.alert(
      'Upgrade Facility',
      `Upgrade ${facility.name} to Level ${facility.level + 1} for $${(facility.upgradeCost / 1000000).toFixed(1)}M?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Upgrade',
          onPress: () => {
            playerTeam.budget -= facility.upgradeCost;
            const updatedFacilities = [...facilities];
            updatedFacilities[index].level++;
            updatedFacilities[index].upgradeCost = Math.floor(updatedFacilities[index].upgradeCost * 1.5);
            setFacilities(updatedFacilities);
            Alert.alert('Success', `${facility.name} upgraded to Level ${facility.level + 1}!`);
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Club Facilities</Text>
        <Text style={styles.budget}>Budget: ${(playerTeam.budget / 1000000).toFixed(1)}M</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>
          💡 Upgrade facilities to gain competitive advantages
        </Text>
      </View>

      {facilities.map((facility, index) => (
        <View key={index} style={styles.facilityCard}>
          <View style={styles.facilityHeader}>
            <Text style={styles.facilityName}>{facility.name}</Text>
            <Text style={styles.facilityLevel}>
              Level {facility.level}/{facility.maxLevel}
            </Text>
          </View>
          
          <Text style={styles.description}>{facility.description}</Text>
          <Text style={styles.effect}>Effect: {facility.effect}</Text>
          
          <View style={styles.progressBar}>
            {[...Array(facility.maxLevel)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.progressSegment,
                  i < facility.level && styles.progressFilled
                ]}
              />
            ))}
          </View>

          {facility.level < facility.maxLevel && (
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => upgradeFacility(index)}
            >
              <Text style={styles.upgradeButtonText}>
                Upgrade - ${(facility.upgradeCost / 1000000).toFixed(1)}M
              </Text>
            </TouchableOpacity>
          )}
          
          {facility.level >= facility.maxLevel && (
            <View style={styles.maxLevelBadge}>
              <Text style={styles.maxLevelText}>✅ MAX LEVEL</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  budget: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  info: {
    backgroundColor: '#fff3cd',
    padding: 15,
    margin: 10,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#856404',
  },
  facilityCard: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  facilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  facilityName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  facilityLevel: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  effect: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '500',
    marginBottom: 10,
  },
  progressBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    marginBottom: 15,
  },
  progressSegment: {
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  progressFilled: {
    backgroundColor: '#4CAF50',
  },
  upgradeButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  maxLevelBadge: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  maxLevelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
