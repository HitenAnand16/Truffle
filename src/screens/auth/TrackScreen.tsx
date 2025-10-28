import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';


interface ApplicationStatus {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  date?: string;
}

const TrackScreen = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [applicationStatuses, setApplicationStatuses] = useState<
    ApplicationStatus[]
  >([]);
  const navigation = useNavigation();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleTrackApplication = async () => {
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with your actual API endpoint
      // const response = await fetch(`https://your-api.com/track/${email}`)
      // const data = await response.json()

      // Simulated response for demo - replace with actual API call
      setTimeout(() => {
        const mockTrackingData = [
          {
            id: 1,
            title: 'Application Submitted',
            description: 'Your application has been successfully submitted',
            isCompleted: true,
            isActive: false,
            date: '2024-10-15',
          },
          {
            id: 2,
            title: 'In Review',
            description:
              'Your application is currently being reviewed by our team',
            isCompleted: true,
            isActive: true,
            date: '2024-10-18',
          },
          {
            id: 3,
            title: 'Processing',
            description: 'Your application is being processed',
            isCompleted: false,
            isActive: false,
          },
          {
            id: 4,
            title: 'Accepted',
            description: 'Your application has been accepted',
            isCompleted: false,
            isActive: false,
          },
        ];

        setApplicationStatuses(mockTrackingData);
        setShowTracking(true);
        setIsLoading(false);
      }, 1500);
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
              status.isCompleted && styles.statusDotCompleted,
              status.isActive && styles.statusDotActive,
            ]}
          />
          {!isLast && (
            <View
              style={[
                styles.statusLine,
                status.isCompleted && styles.statusLineCompleted,
              ]}
            />
          )}
        </View>

        <View style={styles.statusContent}>
          <Text
            style={[
              styles.statusTitle,
              status.isCompleted && styles.statusTitleCompleted,
              status.isActive && styles.statusTitleActive,
            ]}
          >
            {status.title}
          </Text>
          <Text
            style={[
              styles.statusDescription,
              status.isCompleted && styles.statusDescriptionCompleted,
            ]}
          >
            {status.description}
          </Text>
          {status.date && <Text style={styles.statusDate}>{status.date}</Text>}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
        </View>
        {!showTracking ? (
          // Email Input Form
          <>
            <Text style={styles.header}>Track Your Application</Text>
            <Text style={styles.subHeader}>
              Enter your registered email to check application status
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.emailInput}
                placeholder="Enter your registered email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity
                style={[
                  styles.trackButton,
                  isLoading && styles.trackButtonDisabled,
                ]}
                onPress={handleTrackApplication}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.trackButtonText}>Track Application</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          // Tracking Results
          <>
            <View style={styles.trackingHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackToSearch}
              >
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.header}>Application Status</Text>
              <Text style={styles.subHeader}>Tracking for: {email}</Text>
            </View>

            <View style={styles.progressContainer}>
              {applicationStatuses.map((status, index) =>
                renderStatusItem(status, index),
              )}
            </View>
          </>
        )}
      </ScrollView>
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
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
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
    width: 3,
    height: 60,
    backgroundColor: '#e0e0e0',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#999999',
    marginBottom: 4,
  },
  statusTitleCompleted: {
    color: '#4caf50',
  },
  statusTitleActive: {
    color: '#2196f3',
    fontWeight: 'bold',
  },
  statusDescription: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
  },
  statusDescriptionCompleted: {
    color: '#666666',
  },
  statusDate: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
    fontStyle: 'italic',
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
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4F0D50',
    fontWeight: '500',
  },
});

export default TrackScreen;
