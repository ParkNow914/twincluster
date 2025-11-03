import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { GameState } from '../services/GameState';
import { StaffMember } from '../models/Manager';
import { nanoid } from 'nanoid';

export const StaffManagementScreen = () => {
  const gameState = GameState.getInstance();
  const team = gameState.getPlayerTeam();
  
  // Staff would be in GameState in full implementation
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: nanoid(),
      name: 'John Smith',
      role: 'Assistant Manager',
      nationality: 'England',
      age: 42,
      rating: 16,
      wage: 15000,
      contract: { yearsRemaining: 2 },
      attributes: { tactics: 17, attacking: 15, defending: 16 },
    },
    {
      id: nanoid(),
      name: 'Carlos Rodriguez',
      role: 'Coach',
      nationality: 'Spain',
      age: 38,
      rating: 14,
      wage: 10000,
      contract: { yearsRemaining: 1 },
      attributes: { attacking: 16, defending: 12 },
    },
    {
      id: nanoid(),
      name: 'Pierre Dubois',
      role: 'Scout',
      nationality: 'France',
      age: 35,
      rating: 15,
      wage: 8000,
      contract: { yearsRemaining: 3 },
      attributes: { judgingPlayerPotential: 16, judgingPlayerAbility: 14 },
    },
  ]);

  const [availableStaff] = useState<StaffMember[]>([
    {
      id: nanoid(),
      name: 'Michael Johnson',
      role: 'Physio',
      nationality: 'USA',
      age: 40,
      rating: 17,
      wage: 12000,
      contract: { yearsRemaining: 2 },
      attributes: { fitness: 18 },
    },
    {
      id: nanoid(),
      name: 'Takeshi Yamamoto',
      role: 'Analyst',
      nationality: 'Japan',
      age: 30,
      rating: 16,
      wage: 9000,
      contract: { yearsRemaining: 2 },
      attributes: { tactics: 17 },
    },
  ]);

  const handleHireStaff = (member: StaffMember) => {
    const totalCost = member.wage * 52 * member.contract.yearsRemaining;
    
    if (team.budget < totalCost) {
      Alert.alert('Insufficient Budget', `You need $${totalCost.toLocaleString()} to hire this staff member.`);
      return;
    }

    Alert.alert(
      'Hire Staff Member',
      `Hire ${member.name} as ${member.role} for $${member.wage.toLocaleString()}/week (${member.contract.yearsRemaining} years)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Hire',
          onPress: () => {
            setStaff([...staff, member]);
            team.budget -= totalCost;
            Alert.alert('Success', `${member.name} has been hired!`);
          },
        },
      ]
    );
  };

  const handleFireStaff = (member: StaffMember) => {
    Alert.alert(
      'Fire Staff Member',
      `Are you sure you want to fire ${member.name}? This will cost $${(member.wage * 26).toLocaleString()} in compensation.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Fire',
          style: 'destructive',
          onPress: () => {
            setStaff(staff.filter(s => s.id !== member.id));
            team.budget -= member.wage * 26; // 6 months compensation
            Alert.alert('Staff Member Fired', `${member.name} has been released.`);
          },
        },
      ]
    );
  };

  const getRoleIcon = (role: StaffMember['role']) => {
    switch (role) {
      case 'Assistant Manager': return '👔';
      case 'Coach': return '🏋️';
      case 'Scout': return '🔍';
      case 'Physio': return '⚕️';
      case 'Analyst': return '📊';
      default: return '👤';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 17) return '#4CAF50';
    if (rating >= 14) return '#FFC107';
    return '#F44336';
  };

  const renderStaffCard = (member: StaffMember, isHired: boolean) => (
    <View key={member.id} style={styles.staffCard}>
      <View style={styles.staffHeader}>
        <Text style={styles.staffIcon}>{getRoleIcon(member.role)}</Text>
        <View style={styles.staffInfo}>
          <Text style={styles.staffName}>{member.name}</Text>
          <Text style={styles.staffRole}>{member.role}</Text>
        </View>
        <View style={styles.ratingBadge}>
          <Text style={[styles.rating, { color: getRatingColor(member.rating) }]}>
            {member.rating}/20
          </Text>
        </View>
      </View>

      <View style={styles.staffDetails}>
        <Text style={styles.detail}>🌍 {member.nationality} • {member.age} years old</Text>
        <Text style={styles.detail}>💰 ${member.wage.toLocaleString()}/week</Text>
        <Text style={styles.detail}>📄 {member.contract.yearsRemaining} years remaining</Text>
      </View>

      {member.attributes && (
        <View style={styles.attributes}>
          {Object.entries(member.attributes).map(([key, value]) => (
            <View key={key} style={styles.attributeRow}>
              <Text style={styles.attributeName}>
                {key.replace(/([A-Z])/g, ' $1').trim()}:
              </Text>
              <Text style={styles.attributeValue}>{value}</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, isHired ? styles.fireButton : styles.hireButton]}
        onPress={() => isHired ? handleFireStaff(member) : handleHireStaff(member)}
      >
        <Text style={styles.buttonText}>{isHired ? 'Fire' : 'Hire'}</Text>
      </TouchableOpacity>
    </View>
  );

  const totalStaffWages = staff.reduce((sum, s) => sum + s.wage, 0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Staff Management</Text>

      {/* Budget Info */}
      <View style={styles.budgetCard}>
        <Text style={styles.budgetLabel}>Available Budget</Text>
        <Text style={styles.budgetValue}>${team.budget.toLocaleString()}</Text>
        <Text style={styles.wagesInfo}>
          Weekly Staff Wages: ${totalStaffWages.toLocaleString()}
        </Text>
      </View>

      {/* Current Staff */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Staff ({staff.length})</Text>
        {staff.map(member => renderStaffCard(member, true))}
      </View>

      {/* Available Staff */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available for Hire</Text>
        {availableStaff.map(member => renderStaffCard(member, false))}
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
  budgetCard: {
    backgroundColor: '#2196F3',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 14,
    color: 'white',
    marginBottom: 8,
  },
  budgetValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  wagesInfo: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  staffCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  staffHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  staffIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  staffRole: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  ratingBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  staffDetails: {
    marginBottom: 12,
  },
  detail: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  attributes: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  attributeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  attributeName: {
    fontSize: 13,
    color: '#666',
    textTransform: 'capitalize',
  },
  attributeValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  hireButton: {
    backgroundColor: '#4CAF50',
  },
  fireButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
