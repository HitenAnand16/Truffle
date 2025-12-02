import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';


interface ApplicationStatus {
  id: number;
  title: string;
  date?: string;
  isCompleted: boolean;
  isActive: boolean;
  dotColor?: string;
}

function formatDate(iso?: string) {
  if (!iso) return undefined;
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return iso;
  }
}

function normalizeStatus(raw?: string) {
  const s = (raw || '').trim().toUpperCase();
  if (['APPROVED', 'REJECTED', 'UNDER_REVIEW', 'SUBMITTED', 'PENDING'].includes(s)) return s;
  // Fallbacks for common variants
  if (['IN_REVIEW', 'REVIEW'].includes(s)) return 'UNDER_REVIEW';
  if (['PENDING_APPROVAL', 'WAITING', 'QUEUED'].includes(s)) return 'PENDING';
  return s || 'PENDING';
}

const TrackScreen = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [applicationStatuses, setApplicationStatuses] = useState<
    ApplicationStatus[]
  >([]);
  const [appName, setAppName] = useState<string | null>(null);
  const navigation = useNavigation();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleTrackApplication = async () => {
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const encoded = encodeURIComponent(email.trim());
      const url = `https://truffle-0ol8.onrender.com/api/invite/track/email?email=${encoded}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const json = await res.json();

      if (!json || !json.application) {
        throw new Error('Application not found');
      }

      const application = json.application;
      setAppName(application.name || null);

      // Map API status to the three-step timeline
      const status = normalizeStatus(application.status);
      const createdAt = application.createdAt;
      const updatedAt = application.updatedAt;

      const timeline: ApplicationStatus[] = [
        {
          id: 1,
          title: 'Application Submitted',
          date: createdAt ? formatDate(createdAt) : undefined,
          isCompleted: ['PENDING', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(status),
          isActive: status === 'PENDING' || status === 'SUBMITTED',
          dotColor: '#2CC84E',
        },
        {
          id: 2,
          title: 'Application Under Review',
          date: status === 'UNDER_REVIEW' || status === 'APPROVED' || status === 'REJECTED' ? (updatedAt ? formatDate(updatedAt) : undefined) : undefined,
          isCompleted: ['UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(status),
          isActive: status === 'UNDER_REVIEW',
          dotColor: '#F9D74A',
        },
        {
          id: 3,
          title: status === 'REJECTED' ? 'Approval/ Rejection' : 'Approval/ Rejection',
          date: (status === 'APPROVED' || status === 'REJECTED') && updatedAt ? formatDate(updatedAt) : undefined,
          isCompleted: ['APPROVED', 'REJECTED'].includes(status),
          isActive: ['APPROVED', 'REJECTED'].includes(status),
          dotColor: '#000000',
        },
      ];

      setApplicationStatuses(timeline);
      setShowTracking(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tracking data:', error);
      Alert.alert(
        'Error',
        'Failed to fetch tracking information. Please try again.',
      );
      setIsLoading(false);
    }
  };

  const handleBackToSearch = () => {
    setShowTracking(false);
    setEmail('');
    setApplicationStatuses([]);
  };

  const renderStatusItem = (status: ApplicationStatus, index: number) => {
    const isLast = index === applicationStatuses.length - 1;

    return (
      <View key={status.id} style={styles.statusContainer}>
        <View style={styles.statusLeftSection}>
          <View
            style={[
              styles.statusDot,
              status.isCompleted && { backgroundColor: status.dotColor || '#4caf50', borderColor: status.dotColor || '#4caf50' },
              status.isActive && styles.statusDotActive,
            ]}
          />
          {!isLast && (
            <View
              style={[
                styles.statusLine,
                status.isCompleted && { backgroundColor: status.dotColor || '#4caf50' },
              ]}
            />
          )}
        </View>

        <View style={styles.statusContent}>
          <Text
            style={[
              styles.statusTitle,
              status.isActive && styles.statusTitleActive,
            ]}
          >
            {status.title}
          </Text>
          {status.date && <Text style={styles.statusDate}>{status.date}</Text>}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex:1}}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.iconBack}>
              <Ionicons name="chevron-back" size={26} color="#333" />
            </TouchableOpacity>
            <Text style={styles.screenTitle}>Track Your Invite</Text>
          </View>

          {!showTracking ? (
            <>
              <Text style={styles.sectionLabel}>Enter Email</Text>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.emailInput}
                  placeholder="Youremail@mail.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.bottomButtonWrap}>
                <TouchableOpacity
                  style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
                  onPress={handleTrackApplication}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Next</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.statusHeader}>Status</Text>
              <View style={styles.progressContainer}>
                {applicationStatuses.map((s, i) => renderStatusItem(s, i))}
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoBoxText}>
                  You are in the queue. We'll keep you updated and notify you when you are up next.
                </Text>
              </View>

              <View style={styles.bottomButtonWrap}>
                <TouchableOpacity style={styles.primaryButton} onPress={() => {/* invite friends action */}}>
                  <Text style={styles.primaryButtonText}>Invite Friends</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  subHeader: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
  },
  progressContainer: {
    paddingHorizontal: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statusLeftSection: {
    alignItems: 'center',
    marginRight: 16,
  },
  statusDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    borderWidth: 3,
    borderColor: '#f0f0f0',
    zIndex: 1,
  },
  statusDotCompleted: {
    backgroundColor: '#4caf50',
    borderColor: '#4caf50',
  },
  statusDotActive: {
    backgroundColor: '#2196f3',
    borderColor: '#2196f3',
    shadowColor: '#2196f3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  statusLine: {
    width: 2,
    height: 60,
    backgroundColor: '#E8DFF1',
    marginTop: 4,
  },
  statusLineCompleted: {
    backgroundColor: '#4caf50',
  },
  statusContent: {
    flex: 1,
    paddingTop: 2,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  statusTitleActive: {
    color: '#2196f3',
    fontWeight: 'bold',
  },
  statusDate: {
    fontSize: 12,
    color: '#6E57A3',
    marginTop: 2,
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emailInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  trackButton: {
    backgroundColor: '#4F0D50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  trackButtonDisabled: {
    backgroundColor: '#ccc',
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  trackingHeader: {
    marginBottom: 30,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4F0D50',
    fontWeight: '500',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  iconBack: {
    padding: 6,
    marginRight: 8,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
  },
  sectionLabel: {
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginTop: 20,
  },
  inputWrapper: {
    paddingHorizontal: 20,
    marginTop: 12,
  },
  bottomButtonWrap: {
    paddingHorizontal: 20,
    marginTop: 30,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#4F0D50',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 28,
    minWidth: 160,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  statusHeader: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 18,
  },
  infoBox: {
    backgroundColor: '#F6EEF1',
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 6,
    marginTop: 18,
  },
  infoBoxText: {
    color: '#6b6b6b',
    textAlign: 'center',
  },
});

export default TrackScreen;
