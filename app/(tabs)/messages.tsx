import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { 
  MessageCircle, 
  Users, 
  Search, 
  Plus, 
  Wrench, 
  Building,
  User,
  Clock,
  CheckCircle
} from 'lucide-react-native';

export default function MessagesScreen() {
  const [activeTab, setActiveTab] = useState('conversations');
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = [
    {
      id: '1',
      name: 'Maintenance Team',
      lastMessage: 'Your AC repair has been scheduled for tomorrow at 2 PM',
      time: '10:30 AM',
      unread: 2,
      type: 'maintenance',
    },
    {
      id: '2',
      name: 'Building Manager',
      lastMessage: 'Thank you for your payment. Receipt has been sent to your email.',
      time: '9:15 AM',
      unread: 0,
      type: 'management',
    },
    {
      id: '3',
      name: 'Security',
      lastMessage: 'Your visitor pass for tomorrow has been approved.',
      time: 'Yesterday',
      unread: 1,
      type: 'security',
    },
  ];

  const groups = [
    {
      id: '1',
      name: 'Building Announcements',
      members: 'All residents',
      lastMessage: 'Water shut-off scheduled for Friday from 9 AM to 12 PM',
      time: '2 hours ago',
      unread: 3,
    },
    {
      id: '2',
      name: 'Floor 3 Residents',
      members: '12 people',
      lastMessage: 'Anyone interested in organizing a floor meetup this weekend?',
      time: 'Yesterday',
      unread: 0,
    },
    {
      id: '3',
      name: 'Fitness Center Group',
      members: '28 people',
      lastMessage: 'New equipment arrives next week! 🎉',
      time: '2 days ago',
      unread: 0,
    },
  ];

  const maintenanceRequests = [
    {
      id: '1',
      title: 'AC Repair',
      status: 'In Progress',
      date: 'Mar 18',
      statusColor: '#f59e0b',
    },
    {
      id: '2',
      title: 'Plumbing Issue',
      status: 'Scheduled',
      date: 'Mar 20',
      statusColor: '#3b82f6',
    },
    {
      id: '3',
      title: 'Light Bulb Replacement',
      status: 'Completed',
      date: 'Mar 15',
      statusColor: '#10b981',
    },
  ];

  const getConversationIcon = (type: string) => {
    switch (type) {
      case 'maintenance':
        return <Wrench size={24} color="#f59e0b" />;
      case 'management':
        return <Building size={24} color="#3b82f6" />;
      case 'security':
        return <User size={24} color="#10b981" />;
      default:
        return <MessageCircle size={24} color="#6b7280" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle size={16} color="#10b981" />;
      case 'In Progress':
        return <Clock size={16} color="#f59e0b" />;
      case 'Scheduled':
        return <Clock size={16} color="#3b82f6" />;
      default:
        return <Clock size={16} color="#6b7280" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Messages</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Search size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Plus size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'conversations' && styles.activeTab]}
          onPress={() => setActiveTab('conversations')}
        >
          <MessageCircle size={18} color={activeTab === 'conversations' ? '#3b82f6' : '#6b7280'} />
          <Text style={[styles.tabText, activeTab === 'conversations' && styles.activeTabText]}>
            Conversations
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'groups' && styles.activeTab]}
          onPress={() => setActiveTab('groups')}
        >
          <Users size={18} color={activeTab === 'groups' ? '#3b82f6' : '#6b7280'} />
          <Text style={[styles.tabText, activeTab === 'groups' && styles.activeTabText]}>
            Groups
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'conversations' ? (
          <View style={styles.conversationsList}>
            {conversations.map((conversation) => (
              <TouchableOpacity key={conversation.id} style={styles.conversationItem}>
                <View style={styles.conversationIcon}>
                  {getConversationIcon(conversation.type)}
                  {conversation.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{conversation.unread}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.conversationContent}>
                  <View style={styles.conversationHeader}>
                    <Text style={styles.conversationName}>{conversation.name}</Text>
                    <Text style={styles.conversationTime}>{conversation.time}</Text>
                  </View>
                  <Text style={styles.conversationMessage} numberOfLines={2}>
                    {conversation.lastMessage}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.groupsList}>
            {groups.map((group) => (
              <TouchableOpacity key={group.id} style={styles.groupItem}>
                <View style={styles.groupIcon}>
                  <Users size={24} color="#10b981" />
                  {group.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{group.unread}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.groupContent}>
                  <View style={styles.groupHeader}>
                    <Text style={styles.groupName}>{group.name}</Text>
                    <Text style={styles.groupTime}>{group.time}</Text>
                  </View>
                  <Text style={styles.groupMembers}>{group.members}</Text>
                  <Text style={styles.groupMessage} numberOfLines={1}>
                    {group.lastMessage}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Wrench size={24} color="#f59e0b" />
              </View>
              <Text style={styles.actionText}>Maintenance Request</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <MessageCircle size={24} color="#3b82f6" />
              </View>
              <Text style={styles.actionText}>New Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Maintenance Requests */}
        <View style={styles.maintenanceSection}>
          <Text style={styles.sectionTitle}>Maintenance Requests</Text>
          <View style={styles.maintenanceList}>
            {maintenanceRequests.map((request) => (
              <TouchableOpacity key={request.id} style={styles.maintenanceItem}>
                <View style={styles.maintenanceIcon}>
                  <Wrench size={20} color="#f59e0b" />
                </View>
                <View style={styles.maintenanceContent}>
                  <Text style={styles.maintenanceTitle}>{request.title}</Text>
                  <View style={styles.maintenanceStatus}>
                    {getStatusIcon(request.status)}
                    <Text style={[styles.statusText, { color: request.statusColor }]}>
                      {request.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.maintenanceDate}>{request.date}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#3b82f6',
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#dbeafe',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  conversationsList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  conversationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  conversationTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  conversationMessage: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  groupsList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  groupContent: {
    flex: 1,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  groupTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  groupMembers: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  groupMessage: {
    fontSize: 14,
    color: '#6b7280',
  },
  quickActions: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    textAlign: 'center',
  },
  maintenanceSection: {
    marginBottom: 20,
  },
  maintenanceList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  maintenanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  maintenanceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  maintenanceContent: {
    flex: 1,
  },
  maintenanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  maintenanceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  maintenanceDate: {
    fontSize: 12,
    color: '#6b7280',
  },
});