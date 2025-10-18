import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Mock data for tracking information
const mockTrackingData = {
  user: {
    id: 'user_123',
    name: 'Hiten Anand',
    email: 'hiten.anand@example.com',
    status: 'Active',
    joinedDate: '2024-12-01',
    lastActivity: new Date().toISOString(),
  },
  analytics: {
    profileViews: 445,
    profileViewsToday: 12,
    profileViewsThisWeek: 89,
    likes: 120,
    likesToday: 8,
    likesThisWeek: 34,
    matches: 25,
    matchesToday: 2,
    matchesThisWeek: 7,
    messages: 156,
    messagesToday: 15,
    messagesThisWeek: 78,
    responseRate: 85,
    averageResponseTime: '2h 30m',
    profileCompleteness: 98,
  },
  activities: [
    {
      id: '1',
      type: 'match',
      title: 'New Match!',
      description: 'You matched with Emma Smith',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      icon: 'heart',
      color: '#FF6B6B',
    },
    {
      id: '2',
      type: 'message',
      title: 'New Message',
      description: 'You received a message from John Doe',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      icon: 'chatbubble',
      color: '#4ECDC4',
    },
    {
      id: '3',
      type: 'like',
      title: 'Someone Liked You!',
      description: 'Olivia Brown liked your profile',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      icon: 'heart-outline',
      color: '#FF9FF3',
    },
    {
      id: '4',
      type: 'view',
      title: 'Profile View',
      description: 'Liam Williams viewed your profile',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      icon: 'eye',
      color: '#95E1D3',
    },
    {
      id: '5',
      type: 'update',
      title: 'Profile Updated',
      description: 'You updated your profile photos',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      icon: 'camera',
      color: '#F38BA8',
    },
  ],
  insights: [
    {
      title: 'Peak Activity Time',
      value: '8:00 PM - 10:00 PM',
      description: 'You get the most likes during this time',
      icon: 'time',
    },
    {
      title: 'Most Popular Photo',
      value: 'Photo #2',
      description: 'Gets 40% more likes than others',
      icon: 'image',
    },
    {
      title: 'Profile Strength',
      value: 'Excellent',
      description: 'Your profile is in the top 5%',
      icon: 'trophy',
    },
    {
      title: 'Conversation Starter',
      value: 'Hiking & Adventure',
      description: 'Most conversations start about this topic',
      icon: 'chatbubbles',
    },
  ],
};

const TrackScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [trackingData, setTrackingData] = useState(mockTrackingData);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      // Update with new data (in real app, this would be an API call)
      setTrackingData({
        ...trackingData,
        analytics: {
          ...trackingData.analytics,
          profileViewsToday: Math.floor(Math.random() * 20) + 5,
          likesToday: Math.floor(Math.random() * 15) + 3,
          matchesToday: Math.floor(Math.random() * 5) + 1,
          messagesToday: Math.floor(Math.random() * 25) + 10,
        },
      });
      setRefreshing(false);
    }, 2000);
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const renderStatCard = (title: string, value: number, subtitle: string, icon: string) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <Ionicons name={icon as any} size={24} color="#4F0D50" />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </View>
  );

  const renderActivityItem = (activity: any) => (
    <View key={activity.id} style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: activity.color }]}>
        <Ionicons name={activity.icon as any} size={20} color="white" />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        <Text style={styles.activityTime}>{formatTime(activity.timestamp)}</Text>
      </View>
    </View>
  );

  const renderInsight = (insight: any, index: number) => (
    <View key={index} style={styles.insightItem}>
      <View style={styles.insightIcon}>
        <Ionicons name={insight.icon as any} size={24} color="#4F0D50" />
      </View>
      <View style={styles.insightContent}>
        <Text style={styles.insightTitle}>{insight.title}</Text>
        <Text style={styles.insightValue}>{insight.value}</Text>
        <Text style={styles.insightDescription}>{insight.description}</Text>
      </View>
    </View>
  );

  const renderOverview = () => (
    <ScrollView style={styles.tabContent}>
      {/* Quick Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Activity</Text>
        <View style={styles.statsGrid}>
          {renderStatCard('Views', trackingData.analytics.profileViewsToday, 'profile views', 'eye')}
          {renderStatCard('Likes', trackingData.analytics.likesToday, 'new likes', 'heart')}
          {renderStatCard('Matches', trackingData.analytics.matchesToday, 'new matches', 'people')}
          {renderStatCard('Messages', trackingData.analytics.messagesToday, 'messages sent', 'chatbubble')}
        </View>
      </View>

      {/* Profile Performance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Performance</Text>
        <View style={styles.performanceCard}>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Profile Completeness</Text>
            <Text style={styles.performanceValue}>{trackingData.analytics.profileCompleteness}%</Text>
          </View>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Response Rate</Text>
            <Text style={styles.performanceValue}>{trackingData.analytics.responseRate}%</Text>
          </View>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Avg Response Time</Text>
            <Text style={styles.performanceValue}>{trackingData.analytics.averageResponseTime}</Text>
          </View>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          {trackingData.activities.slice(0, 3).map(renderActivityItem)}
        </View>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => setSelectedTab('activity')}
        >
          <Text style={styles.viewAllText}>View All Activity</Text>
          <Ionicons name="chevron-forward" size={16} color="#4F0D50" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderAnalytics = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Time Stats</Text>
        <View style={styles.statsGrid}>
          {renderStatCard('Total Views', trackingData.analytics.profileViews, 'all time', 'eye')}
          {renderStatCard('Total Likes', trackingData.analytics.likes, 'received', 'heart')}
          {renderStatCard('Total Matches', trackingData.analytics.matches, 'connections', 'people')}
          {renderStatCard('Messages', trackingData.analytics.messages, 'exchanged', 'chatbubble')}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Trends</Text>
        <View style={styles.statsGrid}>
          {renderStatCard('Views', trackingData.analytics.profileViewsThisWeek, 'this week', 'trending-up')}
          {renderStatCard('Likes', trackingData.analytics.likesThisWeek, 'this week', 'trending-up')}
          {renderStatCard('Matches', trackingData.analytics.matchesThisWeek, 'this week', 'trending-up')}
          {renderStatCard('Messages', trackingData.analytics.messagesThisWeek, 'this week', 'trending-up')}
        </View>
      </View>
    </ScrollView>
  );

  const renderActivityTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Activity</Text>
        <View style={styles.activityList}>
          {trackingData.activities.map(renderActivityItem)}
        </View>
      </View>
    </ScrollView>
  );

  const renderInsights = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Insights</Text>
        <Text style={styles.sectionSubtitle}>
          Understand how your profile performs and get tips to improve
        </Text>
        <View style={styles.insightsList}>
          {trackingData.insights.map(renderInsight)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Improvement Tips</Text>
        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={24} color="#FFA500" />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Add More Photos</Text>
            <Text style={styles.tipDescription}>
              Profiles with 3+ photos get 30% more matches
            </Text>
          </View>
        </View>
        <View style={styles.tipCard}>
          <Ionicons name="time" size={24} color="#4ECDC4" />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Be Active During Peak Hours</Text>
            <Text style={styles.tipDescription}>
              Most activity happens between 8-10 PM on weekdays
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const tabs = [
    { id: 'overview', title: 'Overview', icon: 'analytics' },
    { id: 'analytics', title: 'Analytics', icon: 'bar-chart' },
    { id: 'activity', title: 'Activity', icon: 'list' },
    { id: 'insights', title: 'Insights', icon: 'bulb' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity Tracking</Text>
        <TouchableOpacity onPress={() => Alert.alert('Settings', 'Tracking settings coming soon!')}>
          <Ionicons name="settings" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, selectedTab === tab.id && styles.activeTab]}
              onPress={() => setSelectedTab(tab.id)}
            >
              <Ionicons 
                name={tab.icon as any} 
                size={20} 
                color={selectedTab === tab.id ? '#4F0D50' : '#666'} 
              />
              <Text style={[
                styles.tabText, 
                selectedTab === tab.id && styles.activeTabText
              ]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {selectedTab === 'overview' && (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {renderOverview()}
          </ScrollView>
        )}
        {selectedTab === 'analytics' && renderAnalytics()}
        {selectedTab === 'activity' && renderActivityTab()}
        {selectedTab === 'insights' && renderInsights()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  tabContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginRight: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4F0D50',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#4F0D50',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: (width - 50) / 2,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  performanceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  performanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  performanceLabel: {
    fontSize: 16,
    color: '#333',
  },
  performanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F0D50',
  },
  activityList: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 12,
  },
  viewAllText: {
    fontSize: 16,
    color: '#4F0D50',
    fontWeight: '500',
    marginRight: 5,
  },
  insightsList: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4F0D50',
    marginBottom: 2,
  },
  insightDescription: {
    fontSize: 12,
    color: '#666',
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default TrackScreen;