import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Animated,
} from 'react-native';
import { OptimizedImage, OptimizedImageBackground } from '../../components/OptimizedImage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import { currentUser } from '../../../user';

const { width, height } = Dimensions.get('window');

const UserProfileScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [translateY] = useState(new Animated.Value(0));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // All images (profile + additional)
  const allImages = [currentUser.profilePicture, ...(currentUser.additionalPhotos || [])];

  // Gesture handler for swipe up/down
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  // Handle gesture state change
  const onHandlerStateChange = ({ nativeEvent }: any) => {
    if (nativeEvent.translationY < -100) { // Swipe up
      setModalVisible(true);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else if (nativeEvent.translationY > 100 && modalVisible) { // Swipe down when modal is open
      setModalVisible(false);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      // Reset position
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  // Navigate through images
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);
  const renderSection = (title: string, content: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {content}
    </View>
  );

  const renderInfoItem = (label: string, value: string | number) => (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const renderTags = (items: string[]) => {
    return (
      <View style={styles.tagsContainer}>
        {items.map((item, index) => {
          const ViewComponent = View as any;
          return (
            <ViewComponent key={index} style={styles.tag}>
              <Text style={styles.tagText}>{item}</Text>
            </ViewComponent>
          );
        })}
      </View>
    );
  };

  const renderModalContent = () => (
    <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
      {/* Header Info */}
      <View style={styles.modalHeader}>
        <Text style={styles.modalName}>
          {currentUser.firstName} {currentUser.lastName}
        </Text>
        <Text style={styles.modalAge}>{currentUser.age} years old</Text>
        <View style={styles.modalBadges}>
          {currentUser.isVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
          <View style={styles.subscriptionBadge}>
            <Text style={styles.subscriptionText}>{currentUser.subscription}</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      {renderSection('Profile Stats', 
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentUser.likes}</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentUser.matches}</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentUser.views}</Text>
            <Text style={styles.statLabel}>Views</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentUser.profileCompleteness}%</Text>
            <Text style={styles.statLabel}>Complete</Text>
          </View>
        </View>
      )}

      {/* About */}
      {renderSection('About Me', 
        <Text style={styles.aboutText}>{currentUser.about}</Text>
      )}

      {/* Description */}
      {renderSection('Description', 
        <Text style={styles.descriptionText}>{currentUser.description}</Text>
      )}

      {/* Personal Details */}
      {renderSection('Personal Details', 
        <View>
          {renderInfoItem('Occupation', currentUser.occupation)}
          {renderInfoItem('Education', currentUser.education)}
          {renderInfoItem('Height', currentUser.height)}
          {renderInfoItem('Body Type', currentUser.bodyType)}
          {renderInfoItem('Smoking', currentUser.smokingStatus)}
          {renderInfoItem('Drinking', currentUser.drinkingStatus)}
          {renderInfoItem('Religion', currentUser.religion)}
          {renderInfoItem('Political Views', currentUser.politicalViews)}
        </View>
      )}

      {/* Contact Info */}
      {renderSection('Contact Information', 
        <View>
          {renderInfoItem('Email', currentUser.email)}
          {renderInfoItem('Phone', currentUser.phone)}
          {renderInfoItem('Location', `${currentUser.location.city}, ${currentUser.location.state}`)}
        </View>
      )}

      {/* Interests */}
      {renderSection('Interests', renderTags(currentUser.interests))}

      {/* Strengths */}
      {renderSection('Strengths', renderTags(currentUser.strengths))}

      {/* Languages */}
      {renderSection('Languages', renderTags(currentUser.languages))}

      {/* Looking For */}
      {renderSection('What I\'m Looking For', 
        <View>
          {renderInfoItem('Relationship Type', currentUser.whatAmILookingFor.relationshipType)}
          {renderInfoItem('Communication Style', currentUser.whatAmILookingFor.communicationStyle)}
          {renderInfoItem('Physical Attraction', currentUser.whatAmILookingFor.physicalAttraction)}
          <Text style={styles.subsectionTitle}>Desired Personality Traits:</Text>
          {renderTags(currentUser.whatAmILookingFor.personality)}
          <Text style={styles.subsectionTitle}>Preferred Activities:</Text>
          {renderTags(currentUser.whatAmILookingFor.activities)}
          <Text style={styles.subsectionTitle}>Important Qualities:</Text>
          {renderTags(currentUser.whatAmILookingFor.qualities)}
        </View>
      )}

      {/* Preferences */}
      {renderSection('Dating Preferences', 
        <View style={styles.preferencesContainer}>
          <Text style={styles.preferenceText}>
            Looking for {currentUser.preferences.gender} • 
            Ages {currentUser.preferences.ageRange.min}-{currentUser.preferences.ageRange.max} • 
            Within {currentUser.preferences.distance} miles
          </Text>
        </View>
      )}

      {/* Social Media */}
      {renderSection('Social Media', 
        <View style={styles.socialContainer}>
          {Object.entries(currentUser.socialMediaLinks).map(([platform, url]) => (
            <TouchableOpacity key={platform} style={styles.socialButton}>
              <Ionicons 
                name={platform === 'instagram' ? 'logo-instagram' : 
                      platform === 'facebook' ? 'logo-facebook' :
                      platform === 'linkedin' ? 'logo-linkedin' : 
                      platform === 'twitter' ? 'logo-twitter' : 'link-outline'} 
                size={20} 
                color="#4F0D50" 
              />
              <Text style={styles.socialText}>{platform}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Account Status */}
      {renderSection('Account Information', 
        <View>
          {renderInfoItem('Account Status', currentUser.accountStatus)}
          {renderInfoItem('Subscription', currentUser.subscription)}
          {renderInfoItem('Joined', new Date(currentUser.joinedDate).toLocaleDateString())}
          {renderInfoItem('Last Online', new Date(currentUser.lastOnline).toLocaleString())}
          {renderInfoItem('Email Verified', currentUser.isEmailVerified ? 'Yes' : 'No')}
          {renderInfoItem('Phone Verified', currentUser.isPhoneVerified ? 'Yes' : 'No')}
        </View>
      )}
    </ScrollView>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <OptimizedImageBackground
        source={{ uri: allImages[currentImageIndex] }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Image navigation dots */}
        <View style={styles.imageIndicators}>
          {allImages.map((_, index) => {
            const ViewComponent = View as any;
            return (
              <ViewComponent
                key={index}
                style={[
                  styles.indicator,
                  index === currentImageIndex && styles.activeIndicator,
                ]}
              />
            );
          })}
        </View>

        {/* Left/Right tap areas for image navigation */}
        <TouchableOpacity style={styles.leftTapArea} onPress={prevImage} />
        <TouchableOpacity style={styles.rightTapArea} onPress={nextImage} />

        {/* Basic info overlay at bottom */}
        <View style={styles.basicInfoOverlay}>
          <Text style={styles.overlayName}>
            {currentUser.firstName} {currentUser.lastName}
          </Text>
          <Text style={styles.overlayAge}>{currentUser.age} years old</Text>
          <Text style={styles.swipeUpHint}>Swipe up for more details</Text>
        </View>

        {/* Swipe gesture handler */}
        <PanGestureHandler 
          onGestureEvent={onGestureEvent} 
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View
            style={[
              styles.gestureArea,
              { transform: [{ translateY: translateY }] }
            ]}
          />
        </PanGestureHandler>

        {/* Detail Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Modal Header with Close Button */}
              <View style={styles.modalHeaderBar}>
                <View style={styles.modalHandle} />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              {renderModalContent()}
            </View>
          </View>
        </Modal>
      </OptimizedImageBackground>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  imageIndicators: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: 'white',
  },
  leftTapArea: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '40%',
    zIndex: 5,
  },
  rightTapArea: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '40%',
    zIndex: 5,
  },
  basicInfoOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  overlayName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    textAlign: 'center',
  },
  overlayAge: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 10,
  },
  swipeUpHint: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  gestureArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: height * 0.85,
    minHeight: height * 0.5,
  },
  modalHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  modalScrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  modalAge: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  modalBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    gap: 5,
  },
  verifiedText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  subscriptionBadge: {
    backgroundColor: '#4F0D50',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  subscriptionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F0D50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  aboutText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#4F0D50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  preferencesContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  preferenceText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  socialContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  socialText: {
    fontSize: 14,
    color: '#4F0D50',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});

export default UserProfileScreen;