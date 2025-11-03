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
import { Formation } from '../models/Team';

export const TacticsScreen = () => {
  const [gameState] = useState(() => GameState.getInstance());
  const [, forceUpdate] = useState(0);
  const playerTeam = gameState.getPlayerTeam();

  if (!playerTeam) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>No team selected</Text>
      </SafeAreaView>
    );
  }

  const formations = Object.values(Formation);
  const mentalities = ['defensive', 'balanced', 'attacking'] as const;
  const pressingStyles = ['low', 'medium', 'high'] as const;
  const passingStyles = ['short', 'mixed', 'long'] as const;

  const handleFormationChange = (formation: Formation) => {
    playerTeam.formation = formation;
    forceUpdate(prev => prev + 1);
  };

  const handleMentalityChange = (mentality: typeof mentalities[number]) => {
    playerTeam.tactics.mentality = mentality;
    forceUpdate(prev => prev + 1);
  };

  const handlePressingChange = (pressing: typeof pressingStyles[number]) => {
    playerTeam.tactics.pressing = pressing;
    forceUpdate(prev => prev + 1);
  };

  const handlePassingChange = (passing: typeof passingStyles[number]) => {
    playerTeam.tactics.passingStyle = passing;
    forceUpdate(prev => prev + 1);
  };

  const handleWidthChange = (change: number) => {
    playerTeam.tactics.width = Math.max(1, Math.min(10, playerTeam.tactics.width + change));
    forceUpdate(prev => prev + 1);
  };

  const handleTempoChange = (change: number) => {
    playerTeam.tactics.tempo = Math.max(1, Math.min(10, playerTeam.tactics.tempo + change));
    forceUpdate(prev => prev + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Team Tactics</Text>
          <Text style={styles.subtitle}>{playerTeam.name}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Formation</Text>
          <Text style={styles.currentValue}>Current: {playerTeam.formation}</Text>
          <View style={styles.optionsGrid}>
            {formations.map((formation) => (
              <TouchableOpacity
                key={formation}
                style={[
                  styles.optionButton,
                  playerTeam.formation === formation && styles.selectedOption,
                ]}
                onPress={() => handleFormationChange(formation)}
              >
                <Text
                  style={[
                    styles.optionText,
                    playerTeam.formation === formation && styles.selectedOptionText,
                  ]}
                >
                  {formation}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Mentality</Text>
          <Text style={styles.currentValue}>Current: {playerTeam.tactics.mentality}</Text>
          <View style={styles.optionsRow}>
            {mentalities.map((mentality) => (
              <TouchableOpacity
                key={mentality}
                style={[
                  styles.optionButton,
                  playerTeam.tactics.mentality === mentality && styles.selectedOption,
                ]}
                onPress={() => handleMentalityChange(mentality)}
              >
                <Text
                  style={[
                    styles.optionText,
                    playerTeam.tactics.mentality === mentality && styles.selectedOptionText,
                  ]}
                >
                  {mentality}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Pressing Intensity</Text>
          <Text style={styles.currentValue}>Current: {playerTeam.tactics.pressing}</Text>
          <View style={styles.optionsRow}>
            {pressingStyles.map((pressing) => (
              <TouchableOpacity
                key={pressing}
                style={[
                  styles.optionButton,
                  playerTeam.tactics.pressing === pressing && styles.selectedOption,
                ]}
                onPress={() => handlePressingChange(pressing)}
              >
                <Text
                  style={[
                    styles.optionText,
                    playerTeam.tactics.pressing === pressing && styles.selectedOptionText,
                  ]}
                >
                  {pressing}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚽ Passing Style</Text>
          <Text style={styles.currentValue}>Current: {playerTeam.tactics.passingStyle}</Text>
          <View style={styles.optionsRow}>
            {passingStyles.map((passing) => (
              <TouchableOpacity
                key={passing}
                style={[
                  styles.optionButton,
                  playerTeam.tactics.passingStyle === passing && styles.selectedOption,
                ]}
                onPress={() => handlePassingChange(passing)}
              >
                <Text
                  style={[
                    styles.optionText,
                    playerTeam.tactics.passingStyle === passing && styles.selectedOptionText,
                  ]}
                >
                  {passing}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📏 Team Width</Text>
          <Text style={styles.currentValue}>Current: {playerTeam.tactics.width}/10</Text>
          <View style={styles.sliderContainer}>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => handleWidthChange(-1)}
            >
              <Text style={styles.sliderButtonText}>-</Text>
            </TouchableOpacity>
            <View style={styles.sliderBar}>
              <View style={[styles.sliderFill, { width: `${playerTeam.tactics.width * 10}%` }]} />
            </View>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => handleWidthChange(1)}
            >
              <Text style={styles.sliderButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sliderHint}>
            {playerTeam.tactics.width < 4 ? 'Narrow (defensive)' :
             playerTeam.tactics.width < 7 ? 'Balanced' : 'Wide (offensive)'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Tempo</Text>
          <Text style={styles.currentValue}>Current: {playerTeam.tactics.tempo}/10</Text>
          <View style={styles.sliderContainer}>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => handleTempoChange(-1)}
            >
              <Text style={styles.sliderButtonText}>-</Text>
            </TouchableOpacity>
            <View style={styles.sliderBar}>
              <View style={[styles.sliderFill, { width: `${playerTeam.tactics.tempo * 10}%` }]} />
            </View>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => handleTempoChange(1)}
            >
              <Text style={styles.sliderButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sliderHint}>
            {playerTeam.tactics.tempo < 4 ? 'Slow (patient)' :
             playerTeam.tactics.tempo < 7 ? 'Moderate' : 'High (fast-paced)'}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>💡 Tactical Tips</Text>
          <Text style={styles.infoText}>• High pressing increases fouls but wins the ball higher up the pitch</Text>
          <Text style={styles.infoText}>• Short passing is more accurate but slower</Text>
          <Text style={styles.infoText}>• Wide formations create more space but leave gaps</Text>
          <Text style={styles.infoText}>• Fast tempo drains stamina quicker</Text>
          <Text style={styles.infoText}>• Attacking mentality scores more but concedes more</Text>
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
  currentValue: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    flex: 1,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#1a237e',
    borderColor: '#1a237e',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  selectedOptionText: {
    color: '#fff',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sliderButton: {
    width: 40,
    height: 40,
    backgroundColor: '#1a237e',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sliderBar: {
    flex: 1,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
  sliderHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: '#fff3cd',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 13,
    color: '#856404',
    marginBottom: 5,
    lineHeight: 20,
  },
});
