import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

interface ApplicationStatus {
  id: number
  title: string
  description: string
  isCompleted: boolean
  isActive: boolean
  date?: string
}

const TrackScreen = () => {
  const [applicationStatuses] = useState<ApplicationStatus[]>([
    {
      id: 1,
      title: 'Application Submitted',
      description: 'Your application has been successfully submitted',
      isCompleted: true,
      isActive: false,
      date: '2024-10-15'
    },
    {
      id: 2,
      title: 'In Review',
      description: 'Your application is currently being reviewed by our team',
      isCompleted: true,
      isActive: true,
      date: '2024-10-18'
    },
    {
      id: 3,
      title: 'Processing',
      description: 'Your application is being processed',
      isCompleted: false,
      isActive: false
    },
    {
      id: 4,
      title: 'Accepted',
      description: 'Your application has been accepted',
      isCompleted: false,
      isActive: false
    }
  ])

  const renderStatusItem = (status: ApplicationStatus, index: number) => {
    const isLast = index === applicationStatuses.length - 1
    
    return (
      <View key={status.id} style={styles.statusContainer}>
        <View style={styles.statusLeftSection}>
          <View style={[
            styles.statusDot,
            status.isCompleted && styles.statusDotCompleted,
            status.isActive && styles.statusDotActive
          ]} />
          {!isLast && (
            <View style={[
              styles.statusLine,
              status.isCompleted && styles.statusLineCompleted
            ]} />
          )}
        </View>
        
        <View style={styles.statusContent}>
          <Text style={[
            styles.statusTitle,
            status.isCompleted && styles.statusTitleCompleted,
            status.isActive && styles.statusTitleActive
          ]}>
            {status.title}
          </Text>
          <Text style={[
            styles.statusDescription,
            status.isCompleted && styles.statusDescriptionCompleted
          ]}>
            {status.description}
          </Text>
          {status.date && (
            <Text style={styles.statusDate}>{status.date}</Text>
          )}
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Track Your Application</Text>
        <Text style={styles.subHeader}>Monitor the progress of your application status</Text>
        
        <View style={styles.progressContainer}>
          {applicationStatuses.map((status, index) => 
            renderStatusItem(status, index)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center'
  },
  subHeader: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40
  },
  progressContainer: {
    paddingHorizontal: 20
  },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: 20
  },
  statusLeftSection: {
    alignItems: 'center',
    marginRight: 16
  },
  statusDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    borderWidth: 3,
    borderColor: '#f0f0f0',
    zIndex: 1
  },
  statusDotCompleted: {
    backgroundColor: '#4caf50',
    borderColor: '#4caf50'
  },
  statusDotActive: {
    backgroundColor: '#2196f3',
    borderColor: '#2196f3',
    shadowColor: '#2196f3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5
  },
  statusLine: {
    width: 3,
    height: 60,
    backgroundColor: '#e0e0e0',
    marginTop: 4
  },
  statusLineCompleted: {
    backgroundColor: '#4caf50'
  },
  statusContent: {
    flex: 1,
    paddingTop: 2
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999999',
    marginBottom: 4
  },
  statusTitleCompleted: {
    color: '#4caf50'
  },
  statusTitleActive: {
    color: '#2196f3',
    fontWeight: 'bold'
  },
  statusDescription: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20
  },
  statusDescriptionCompleted: {
    color: '#666666'
  },
  statusDate: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
    fontStyle: 'italic'
  }
})

export default TrackScreen