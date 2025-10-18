import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Switch, 
  StyleSheet, 
  Alert,
  Linking 
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
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // Add logout logic here
            console.log('User logged out');
          }
        }
      ]
    );
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
          }
        }
      ]
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
    rightContent 
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
      {rightContent || (showArrow && (
        <Ionicons name="chevron-forward" size={20} color="#999" />
      ))}
    </TouchableOpacity>
  );

  const SwitchItem = ({ 
    title, 
    subtitle, 
    value, 
    onValueChange 
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

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <SettingItem
            title="Edit Profile"
            subtitle="Update your photos, bio, and preferences"
            onPress={() => console.log('Edit Profile')}
          />
          
          <SettingItem
            title="Subscription"
            subtitle="Manage your Premium membership"
            onPress={() => console.log('Subscription')}
          />
          
          <SwitchItem
            title="Pause Profile"
            subtitle="Hide your profile from new people. You can still chat with matches."
            value={isPaused}
            onValueChange={setIsPaused}
          />
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location & Discovery</Text>
          
          <SettingItem
            title="Current Location"
            subtitle="New Delhi, IN"
            onPress={() => console.log('Change Location')}
          />
          
          <SettingItem
            title="Discovery Preferences"
            subtitle="Age range, distance, and more"
            onPress={() => console.log('Discovery Preferences')}
          />
          
          <SwitchItem
            title="Show Distance"
            subtitle="Display distance on profiles"
            value={showDistance}
            onValueChange={setShowDistance}
          />
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Safety</Text>
          
          <SettingItem
            title="Selfie Verification"
            subtitle="✓ You're verified"
            onPress={() => console.log('Verification')}
          />
          
          <SettingItem
            title="Block List"
            subtitle="Manage blocked users"
            onPress={() => console.log('Block List')}
          />
          
          <SwitchItem
            title="Show Online Status"
            subtitle="Let others see when you're active"
            value={showOnlineStatus}
            onValueChange={setShowOnlineStatus}
          />
          
          <SwitchItem
            title="Private Mode"
            subtitle="Only people you like can see your profile"
            value={privateMode}
            onValueChange={setPrivateMode}
          />
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <SwitchItem
            title="Push Notifications"
            subtitle="Receive notifications on this device"
            value={pushNotifications}
            onValueChange={setPushNotifications}
          />
          
          <SwitchItem
            title="New Messages"
            subtitle="Get notified of new messages"
            value={messageNotifications}
            onValueChange={setMessageNotifications}
          />
          
          <SwitchItem
            title="New Matches"
            subtitle="Get notified of new matches"
            value={matchNotifications}
            onValueChange={setMatchNotifications}
          />
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <SettingItem
            title="Phone Number"
            subtitle="Update your phone number"
            onPress={() => console.log('Phone Number')}
          />
          
          <SettingItem
            title="Email Address"
            subtitle="Update your email address"
            onPress={() => console.log('Email')}
          />
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Legal</Text>
          
          <SettingItem
            title="Help & Support"
            subtitle="Get help with your account"
            onPress={() => openURL('https://help.truffle.com')}
          />
          
          <SettingItem
            title="Safety Guidelines"
            subtitle="Learn how to stay safe"
            onPress={() => openURL('https://truffle.com/safety')}
          />
          
          <SettingItem
            title="Community Guidelines"
            subtitle="Rules for using Truffle"
            onPress={() => openURL('https://truffle.com/community')}
          />
          
          <SettingItem
            title="Privacy Policy"
            subtitle="How we handle your data"
            onPress={() => openURL('https://truffle.com/privacy')}
          />
          
          <SettingItem
            title="Terms of Service"
            subtitle="Legal terms and conditions"
            onPress={() => openURL('https://truffle.com/terms')}
          />
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <SettingItem
            title="App Version"
            subtitle="1.0.0"
            showArrow={false}
          />
          
          <SettingItem
            title="Rate Truffle"
            subtitle="Share your feedback"
            onPress={() => console.log('Rate App')}
          />
          
          <SettingItem
            title="Share Truffle"
            subtitle="Tell your friends about us"
            onPress={() => console.log('Share App')}
          />
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom:60
  },
  scrollContent: {
    // paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    // paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: 15,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
});

export default Settings;
