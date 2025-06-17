import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { format } from 'date-fns';
import { 
  Home, 
  Calendar, 
  DollarSign, 
  Wrench, 
  Bell, 
  Search,
  Sun,
  Moon,
  ChevronRight,
  MapPin
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const currentDate = new Date();

  const quickActions = [
    { icon: DollarSign, label: 'Pay Rent', color: '#3b82f6', bgColor: '#dbeafe' },
    { icon: Wrench, label: 'Maintenance', color: '#f59e0b', bgColor: '#fef3c7' },
    { icon: Calendar, label: 'Schedule', color: '#10b981', bgColor: '#d1fae5' },
    { icon: Bell, label: 'Notifications', color: '#8b5cf6', bgColor: '#ede9fe' },
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'Payment',
      description: 'Rent payment processed',
      timeAgo: '2 hours ago',
      icon: DollarSign,
      color: '#10b981',
    },
    {
      id: '2',
      type: 'Maintenance',
      description: 'AC repair scheduled',
      timeAgo: '1 day ago',
      icon: Wrench,
      color: '#f59e0b',
    },
    {
      id: '3',
      type: 'Notice',
      description: 'Building announcement',
      timeAgo: '2 days ago',
      icon: Bell,
      color: '#3b82f6',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.date}>
              {format(currentDate, 'EEEE, MMMM d, yyyy')}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Search size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Bell size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Residence Card */}
        <View style={styles.residenceCard}>
          <View style={styles.residenceHeader}>
            <View style={styles.residenceIcon}>
              <Home size={32} color="#3b82f6" />
            </View>
            <View style={styles.residenceInfo}>
              <Text style={styles.residenceTitle}>Unit 301</Text>
              <Text style={styles.residenceSubtitle}>Sandton City Towers</Text>
              <View style={styles.locationContainer}>
                <MapPin size={14} color="#6b7280" />
                <Text style={styles.locationText}>Sandton, Johannesburg</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.residenceStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Lease Start</Text>
              <Text style={styles.statValue}>Jan 2024</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Lease End</Text>
              <Text style={styles.statValue}>Dec 2024</Text>
            </View>
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.paymentSection}>
          <View style={styles.paymentCard}>
            <Text style={styles.paymentLabel}>Next Payment</Text>
            <Text style={styles.paymentAmount}>R 440,450</Text>
            <Text style={styles.paymentDue}>Due March 1, 2024</Text>
          </View>
          <View style={styles.paymentCard}>
            <Text style={styles.paymentLabel}>Last Payment</Text>
            <Text style={styles.paymentAmount}>R 440,450</Text>
            <Text style={styles.paymentStatus}>Paid Feb 1, 2024</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.quickActionItem}>
                <View style={[styles.quickActionIcon, { backgroundColor: action.bgColor }]}>
                  <action.icon size={24} color={action.color} />
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activityList}>
            {recentActivities.map((activity) => (
              <TouchableOpacity key={activity.id} style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: `${activity.color}20` }]}>
                  <activity.icon size={18} color={activity.color} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityType}>{activity.type}</Text>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                  <Text style={styles.activityTime}>{activity.timeAgo}</Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Weather Widget */}
        <View style={styles.weatherCard}>
          <View style={styles.weatherHeader}>
            <Text style={styles.weatherTitle}>Today's Weather</Text>
            <Sun size={24} color="#f59e0b" />
          </View>
          <Text style={styles.weatherTemp}>24°C</Text>
          <Text style={styles.weatherDesc}>Sunny with clear skies</Text>
          <Text style={styles.weatherLocation}>Sandton, Johannesburg</Text>
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
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#bfdbfe',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#bfdbfe',
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -20,
  },
  residenceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  residenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  residenceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  residenceInfo: {
    flex: 1,
  },
  residenceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  residenceSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#6b7280',
  },
  residenceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#f3f4f6',
  },
  paymentSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  paymentCard: {
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
  paymentLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  paymentDue: {
    fontSize: 12,
    color: '#f59e0b',
  },
  paymentStatus: {
    fontSize: 12,
    color: '#10b981',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  viewAllText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionItem: {
    width: (width - 64) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    textAlign: 'center',
  },
  activityList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  weatherCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weatherTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  weatherTemp: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  weatherDesc: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  weatherLocation: {
    fontSize: 12,
    color: '#9ca3af',
  },
});