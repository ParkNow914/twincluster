import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface Message {
  id: string;
  from: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  type: 'board' | 'agent' | 'media' | 'fan' | 'staff';
}

export default function MessagesScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      from: 'Board of Directors',
      subject: 'Season Objectives Review',
      body: 'We are pleased with the team\'s progress this season. Continue to focus on developing young talent and maintaining our league position. The board has confidence in your abilities.',
      date: '2 days ago',
      read: false,
      type: 'board'
    },
    {
      id: '2',
      from: 'Player Agent - Jorge Mendes',
      subject: 'Contract Renewal Discussion',
      body: 'My client is very happy at the club and would like to discuss a contract extension. He has received interest from other clubs, but prefers to stay. Can we arrange a meeting?',
      date: '5 days ago',
      read: false,
      type: 'agent'
    },
    {
      id: '3',
      from: 'Sports Media Outlet',
      subject: 'Interview Request',
      body: 'We would like to feature you in our monthly magazine. The interview would cover your tactical approach and plans for the future. Would you be interested?',
      date: '1 week ago',
      read: true,
      type: 'media'
    },
    {
      id: '4',
      from: 'Supporters Club',
      subject: 'Fan Appreciation',
      body: 'The supporters want to express their gratitude for the exciting football this season! The atmosphere at home matches has been electric. Keep up the great work!',
      date: '1 week ago',
      read: true,
      type: 'fan'
    },
    {
      id: '5',
      from: 'Assistant Manager',
      subject: 'Training Session Feedback',
      body: 'Today\'s training session went very well. The players responded positively to the new tactical drills. I noticed some players need extra work on set pieces.',
      date: '2 weeks ago',
      read: true,
      type: 'staff'
    }
  ]);

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const markAsRead = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
  };

  const getTypeIcon = (type: Message['type']) => {
    switch (type) {
      case 'board': return '🏢';
      case 'agent': return '💼';
      case 'media': return '📺';
      case 'fan': return '⚽';
      case 'staff': return '👔';
      default: return '✉️';
    }
  };

  const getTypeColor = (type: Message['type']) => {
    switch (type) {
      case 'board': return '#f44336';
      case 'agent': return '#9C27B0';
      case 'media': return '#FF9800';
      case 'fan': return '#4CAF50';
      case 'staff': return '#2196F3';
      default: return '#757575';
    }
  };

  if (selectedMessage) {
    return (
      <View style={styles.container}>
        <View style={[styles.messageHeader, { backgroundColor: getTypeColor(selectedMessage.type) }]}>
          <TouchableOpacity onPress={() => setSelectedMessage(null)} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.messageHeaderTitle}>Message</Text>
        </View>

        <ScrollView style={styles.messageContent}>
          <View style={styles.messageDetail}>
            <View style={styles.messageDetailHeader}>
              <Text style={styles.messageDetailIcon}>{getTypeIcon(selectedMessage.type)}</Text>
              <View style={styles.messageDetailInfo}>
                <Text style={styles.messageDetailFrom}>{selectedMessage.from}</Text>
                <Text style={styles.messageDetailDate}>{selectedMessage.date}</Text>
              </View>
            </View>

            <Text style={styles.messageDetailSubject}>{selectedMessage.subject}</Text>
            <Text style={styles.messageDetailBody}>{selectedMessage.body}</Text>

            <View style={styles.messageActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>📧 Reply</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>🗑️ Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📬 Messages</Text>
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>
            {messages.filter(m => !m.read).length} Unread
          </Text>
        </View>
      </View>

      <ScrollView style={styles.messagesList}>
        {messages.map((message) => (
          <TouchableOpacity
            key={message.id}
            style={[styles.messageItem, !message.read && styles.unreadMessage]}
            onPress={() => {
              markAsRead(message.id);
              setSelectedMessage(message);
            }}
          >
            <View style={styles.messageIcon}>
              <Text style={styles.messageIconText}>{getTypeIcon(message.type)}</Text>
            </View>
            <View style={styles.messageInfo}>
              <View style={styles.messageTop}>
                <Text style={[styles.messageFrom, !message.read && styles.unreadText]}>
                  {message.from}
                </Text>
                <Text style={styles.messageDate}>{message.date}</Text>
              </View>
              <Text style={[styles.messageSubject, !message.read && styles.unreadText]}>
                {message.subject}
              </Text>
              <Text style={styles.messagePreview} numberOfLines={1}>
                {message.body}
              </Text>
            </View>
            {!message.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
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
  unreadBadge: {
    backgroundColor: '#f44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  messagesList: {
    flex: 1,
  },
  messageItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  unreadMessage: {
    backgroundColor: '#e3f2fd',
  },
  messageIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  messageIconText: {
    fontSize: 24,
  },
  messageInfo: {
    flex: 1,
  },
  messageTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  messageFrom: {
    fontSize: 16,
    color: '#666',
  },
  messageDate: {
    fontSize: 12,
    color: '#999',
  },
  messageSubject: {
    fontSize: 16,
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: 'bold',
    color: '#000',
  },
  messagePreview: {
    fontSize: 14,
    color: '#999',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2196F3',
    marginLeft: 10,
  },
  messageHeader: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  messageContent: {
    flex: 1,
  },
  messageDetail: {
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
  messageDetailHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  messageDetailIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  messageDetailInfo: {
    flex: 1,
  },
  messageDetailFrom: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageDetailDate: {
    fontSize: 14,
    color: '#999',
  },
  messageDetailSubject: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  messageDetailBody: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
  },
  messageActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
