import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { GameState } from '../services/GameState';

interface Question {
  question: string;
  answers: { text: string; morale: number; reputation: number }[];
}

export default function PressConferenceScreen() {
  const gameState = GameState.getInstance();
  const playerTeam = gameState.getPlayerTeam();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const questions: Question[] = [
    {
      question: "How do you feel about the team's recent performances?",
      answers: [
        { text: "We're very satisfied with our progress.", morale: 5, reputation: 3 },
        { text: "There's room for improvement.", morale: 0, reputation: 2 },
        { text: "The players need to step up.", morale: -5, reputation: -2 }
      ]
    },
    {
      question: "What are your thoughts on the upcoming match?",
      answers: [
        { text: "We're confident and ready to win!", morale: 8, reputation: 5 },
        { text: "It will be a tough challenge.", morale: 3, reputation: 3 },
        { text: "I'm concerned about our form.", morale: -3, reputation: -3 }
      ]
    },
    {
      question: "How do you rate your squad's depth?",
      answers: [
        { text: "We have excellent depth.", morale: 5, reputation: 4 },
        { text: "We could use more options.", morale: 0, reputation: 1 },
        { text: "The squad needs reinforcements.", morale: -3, reputation: -1 }
      ]
    },
    {
      question: "What's your opinion on the transfer market activity?",
      answers: [
        { text: "We've made smart investments.", morale: 7, reputation: 6 },
        { text: "We're being strategic.", morale: 3, reputation: 3 },
        { text: "We needed to spend more.", morale: -2, reputation: -2 }
      ]
    },
    {
      question: "How is the team chemistry?",
      answers: [
        { text: "The dressing room atmosphere is fantastic!", morale: 10, reputation: 5 },
        { text: "We're building good relationships.", morale: 5, reputation: 3 },
        { text: "We have some issues to address.", morale: -5, reputation: -4 }
      ]
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    const question = questions[currentQuestionIndex];
    const answer = question.answers[answerIndex];

    // Apply morale change to all players
    playerTeam.players.forEach(player => {
      player.morale = Math.max(0, Math.min(100, player.morale + answer.morale));
    });

    // Apply reputation change
    playerTeam.reputation = Math.max(0, Math.min(100, playerTeam.reputation + answer.reputation));

    setQuestionsAnswered(prev => prev + 1);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      Alert.alert(
        'Press Conference Complete',
        `You answered ${questionsAnswered + 1} questions. Team morale and your reputation have been updated!`,
        [
          {
            text: 'OK',
            onPress: () => {
              setCurrentQuestionIndex(0);
              setQuestionsAnswered(0);
            }
          }
        ]
      );
    }
  };

  const skipConference = () => {
    Alert.alert(
      'Skip Press Conference',
      'Skipping the press conference will have a neutral effect on team morale and reputation.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => {
            setCurrentQuestionIndex(0);
            setQuestionsAnswered(0);
            Alert.alert('Press Conference Skipped', 'You declined to comment.');
          }
        }
      ]
    );
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎤 Press Conference</Text>
        <Text style={styles.subtitle}>Question {currentQuestionIndex + 1} of {questions.length}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>
          💡 Your answers affect team morale and your reputation
        </Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Team Morale</Text>
          <Text style={styles.statValue}>
            {Math.round(playerTeam.players.reduce((sum, p) => sum + p.morale, 0) / playerTeam.players.length)}%
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Your Reputation</Text>
          <Text style={styles.statValue}>{playerTeam.reputation}/100</Text>
        </View>
      </View>

      <View style={styles.questionCard}>
        <View style={styles.reporter}>
          <Text style={styles.reporterIcon}>📰</Text>
          <Text style={styles.reporterName}>Reporter</Text>
        </View>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      <View style={styles.answersContainer}>
        <Text style={styles.answersTitle}>Your Response:</Text>
        {currentQuestion.answers.map((answer, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.answerButton,
              answer.morale > 5 && styles.positiveAnswer,
              answer.morale < 0 && styles.negativeAnswer
            ]}
            onPress={() => handleAnswer(index)}
          >
            <Text style={styles.answerText}>{answer.text}</Text>
            <View style={styles.answerEffects}>
              <Text style={[styles.effectText, answer.morale >= 0 ? styles.positiveEffect : styles.negativeEffect]}>
                Morale: {answer.morale > 0 ? '+' : ''}{answer.morale}
              </Text>
              <Text style={[styles.effectText, answer.reputation >= 0 ? styles.positiveEffect : styles.negativeEffect]}>
                Reputation: {answer.reputation > 0 ? '+' : ''}{answer.reputation}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.skipButton} onPress={skipConference}>
        <Text style={styles.skipButtonText}>Skip Conference</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#9C27B0',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
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
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  statBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9C27B0',
  },
  questionCard: {
    backgroundColor: 'white',
    margin: 10,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reporter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  reporterIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  reporterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  questionText: {
    fontSize: 18,
    lineHeight: 26,
    color: '#333',
  },
  answersContainer: {
    padding: 10,
  },
  answersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5,
  },
  answerButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  positiveAnswer: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  negativeAnswer: {
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  answerText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  answerEffects: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  effectText: {
    fontSize: 12,
    fontWeight: '600',
  },
  positiveEffect: {
    color: '#4CAF50',
  },
  negativeEffect: {
    color: '#f44336',
  },
  skipButton: {
    backgroundColor: '#757575',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  skipButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
