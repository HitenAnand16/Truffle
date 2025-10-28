import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Settings = ({ navigation }: any) => {
  const [isPaused, setIsPaused] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [matchNotifications, setMatchNotifications] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [privateMode, setPrivateMode] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          // Add logout logic here
          console.log('User logged out');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Account deletion requested');
          },
        },
      ],
    );
  };

  const openURL = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open link');
    });
  };

  const SettingItem = ({
    title,
    subtitle,
    onPress,
    showArrow = true,
    rightContent,
  }: {
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showArrow?: boolean;
    rightContent?: React.ReactNode;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightContent ||
        (showArrow && (
          <Ionicons name="chevron-forward" size={20} color="#999" />
        ))}
    </TouchableOpacity>
  );

  const SwitchItem = ({
    title,
    subtitle,
    value,
    onValueChange,
  }: {
    title: string;
    subtitle?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#e0e0e0', true: '#4F0D50' }}
        thumbColor={value ? '#fff' : '#fff'}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Location Section */}
        <View style={[styles.section, { marginTop: 30 }]}>
          <Text style={styles.sectionTitle}>Location</Text>

          <SettingItem
            title="Current location"
            subtitle="Heading to a new city? Change your location"
            rightContent={
              <Text style={styles.locationText}>New Delhi, IN</Text>
            }
            onPress={() => console.log('Change Location')}
          />
        </View>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>

          <SettingItem
            title="Contact number"
            onPress={() => console.log('Contact Number')}
          />

          <SettingItem title="Email" onPress={() => console.log('Email')} />

          <SwitchItem
            title="Pause"
            subtitle="Pausing prevents your profile from being shown to new people. You can still chat with your current matches."
            value={isPaused}
            onValueChange={setIsPaused}
          />
        </View>

        {/* Safety Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Selfie verification</Text>
              <Text style={styles.verifiedText}>You're verified</Text>
            </View>
          </View>

          <SettingItem
            title="Block List"
            subtitle="Block people you know. They won't see you and you won't see them on Truffle."
            onPress={() => console.log('Block List')}
          />
        </View>

        {/* Notifications Section */}
        <View
          style={[
            styles.section,
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 10,
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </View>

        {/* Legal Section */}
        <View
          style={[
            styles.section,
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 10,
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Legal</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </View>

        {/* Contact and FAQ Section */}
        <View
          style={[
            styles.section,
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 10,
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Contact and FAQ</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 60,
  },
  scrollContent: {
    // paddingBottom: 40,
  },
  header: {
    // flexDirection: 'row',
    // alignItems: 'center',
    paddingHorizontal: 20,
    // paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0,
  },
  settingContent: {
    flex: 1,
    marginRight: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4F0D50',
    borderRadius: 25,
    paddingVertical: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F0D50',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ff4757',
    borderRadius: 25,
    paddingVertical: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff4757',
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  verifiedText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default Settings;
