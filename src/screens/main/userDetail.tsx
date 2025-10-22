import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  Animated,
  ScrollView,
} from 'react-native';
import { OptimizedImageBackground } from '../../components/OptimizedImage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { useUserActions } from '../../context/UserActionsContext';

const { width, height } = Dimensions.get('window');

const UserDetails = ({ route, navigation }: any) => {
  const { user } = route.params; // Get user data passed via navigation
  const { addLikedUser, addDislikedUser } = useUserActions();
  const [modalVisible, setModalVisible] = useState(false);
  const [translateY] = useState(new Animated.Value(0));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  // All images (profile + additional)
  const allImages = [user.profilePicture, ...(user.additionalPhotos || [])];

  // Gesture handler for swipe up/down
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true },
  );

  // Handle gesture state change
  const onHandlerStateChange = ({ nativeEvent }: any) => {
    if (nativeEvent.translationY < -100) {
      // Swipe up
      setModalVisible(true);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else if (nativeEvent.translationY > 100 && modalVisible) {
      // Swipe down when modal is open
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
    setCurrentImageIndex(prev => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex(
      prev => (prev - 1 + allImages.length) % allImages.length,
    );
  }, [allImages.length]);

  // Handle like and dislike actions
  const handleLike = useCallback(() => {
    addLikedUser(user.id); // Add to context
    setActionMessage('Liked!');
    setIsActionModalVisible(true);
    setTimeout(() => {
      setIsActionModalVisible(false);
      navigation.goBack(); // Go back to home screen after like
    }, 1500);
  }, [addLikedUser, user.id, navigation]);

  const handleDislike = useCallback(() => {
    addDislikedUser(user.id); // Add to context
    setActionMessage('Disliked!');
    setIsActionModalVisible(true);
    setTimeout(() => {
      setIsActionModalVisible(false);
      navigation.goBack(); // Go back to home screen after dislike
    }, 1500);
  }, [addDislikedUser, user.id, navigation]);

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

  const renderTags = (items: string[]) => (
    <View style={styles.tagsContainer}>
      {items.map((item, index) => (
        <View style={styles.tag} key={`tag-${index}`} {...({} as any)}>
          <Text style={styles.tagText}>{item}</Text>
        </View>
      ))}
    </View>
  );

  const renderModalContent = () => (
    <ScrollView
      style={styles.modalScrollView}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Info */}
      <View style={styles.modalHeader}>
        <Text style={styles.modalName}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={styles.modalAge}>{user.age} years </Text>
        <View style={styles.modalBadges}>
          {user.isVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
          {user.subscription && (
            <View style={styles.subscriptionBadge}>
              <Text style={styles.subscriptionText}>{user.subscription}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Stats */}
      {user.likes !== undefined &&
        renderSection(
          'Profile Stats',
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.likes || 0}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.matches || 0}</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.views || 0}</Text>
              <Text style={styles.statLabel}>Views</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {user.profileCompleteness || 0}%
              </Text>
              <Text style={styles.statLabel}>Complete</Text>
            </View>
          </View>,
        )}

      {/* About */}
      {user.about &&
        renderSection(
          'About Me',
          <Text style={styles.aboutText}>{user.about}</Text>,
        )}

      {/* Description */}
      {user.description &&
        renderSection(
          'Description',
          <Text style={styles.descriptionText}>{user.description}</Text>,
        )}

      {/* Personal Details */}
      {renderSection(
        'Personal Details',
        <View>
          {user.occupation && renderInfoItem('Occupation', user.occupation)}
          {user.education && renderInfoItem('Education', user.education)}
          {user.height && renderInfoItem('Height', user.height)}
          {user.bodyType && renderInfoItem('Body Type', user.bodyType)}
          {user.smokingStatus && renderInfoItem('Smoking', user.smokingStatus)}
          {user.drinkingStatus &&
            renderInfoItem('Drinking', user.drinkingStatus)}
          {user.religion && renderInfoItem('Religion', user.religion)}
          {user.politicalViews &&
            renderInfoItem('Political Views', user.politicalViews)}
        </View>,
      )}

      {/* Contact Info */}
      {renderSection(
        'Contact Information',
        <View>
          {user.email && renderInfoItem('Email', user.email)}
          {user.phone && renderInfoItem('Phone', user.phone)}
          {user.location &&
            renderInfoItem(
              'Location',
              `${user.location.city || ''}, ${user.location.state || ''}`,
            )}
        </View>,
      )}

      {/* Interests */}
      {user.interests &&
        user.interests.length > 0 &&
        renderSection('Interests', renderTags(user.interests))}

      {/* Strengths */}
      {user.strengths &&
        user.strengths.length > 0 &&
        renderSection('Strengths', renderTags(user.strengths))}

      {/* Languages */}
      {user.languages &&
        user.languages.length > 0 &&
        renderSection('Languages', renderTags(user.languages))}

      {/* Looking For */}
      {user.whatAmILookingFor &&
        renderSection(
          "What I'm Looking For",
          <View>
            {user.whatAmILookingFor.relationshipType &&
              renderInfoItem(
                'Relationship Type',
                user.whatAmILookingFor.relationshipType,
              )}
            {user.whatAmILookingFor.communicationStyle &&
              renderInfoItem(
                'Communication Style',
                user.whatAmILookingFor.communicationStyle,
              )}
            {user.whatAmILookingFor.physicalAttraction &&
              renderInfoItem(
                'Physical Attraction',
                user.whatAmILookingFor.physicalAttraction,
              )}
            {user.whatAmILookingFor.personality &&
              user.whatAmILookingFor.personality.length > 0 && (
                <>
                  <Text style={styles.subsectionTitle}>
                    Desired Personality Traits:
                  </Text>
                  {renderTags(user.whatAmILookingFor.personality)}
                </>
              )}
            {user.whatAmILookingFor.activities &&
              user.whatAmILookingFor.activities.length > 0 && (
                <>
                  <Text style={styles.subsectionTitle}>
                    Preferred Activities:
                  </Text>
                  {renderTags(user.whatAmILookingFor.activities)}
                </>
              )}
            {user.whatAmILookingFor.qualities &&
              user.whatAmILookingFor.qualities.length > 0 && (
                <>
                  <Text style={styles.subsectionTitle}>
                    Important Qualities:
                  </Text>
                  {renderTags(user.whatAmILookingFor.qualities)}
                </>
              )}
          </View>,
        )}

      {/* Preferences */}
      {user.preferences &&
        renderSection(
          'Dating Preferences',
          <View style={styles.preferencesContainer}>
            <Text style={styles.preferenceText}>
              Looking for {user.preferences.gender || 'anyone'} • Ages{' '}
              {user.preferences.ageRange?.min || 18}-
              {user.preferences.ageRange?.max || 99} • Within{' '}
              {user.preferences.distance || 50} miles
            </Text>
          </View>,
        )}

      {/* Social Media */}
      {user.socialMediaLinks &&
        Object.keys(user.socialMediaLinks).length > 0 &&
        renderSection(
          'Social Media',
          <View style={styles.socialContainer}>
            {Object.entries(user.socialMediaLinks).map(([platform, url]) => (
              <TouchableOpacity key={platform} style={styles.socialButton}>
                <Ionicons
                  name={
                    platform === 'instagram'
                      ? 'logo-instagram'
                      : platform === 'facebook'
                      ? 'logo-facebook'
                      : platform === 'linkedin'
                      ? 'logo-linkedin'
                      : platform === 'twitter'
                      ? 'logo-twitter'
                      : 'link-outline'
                  }
                  size={20}
                  color="#4F0D50"
                />
                <Text style={styles.socialText}>{platform}</Text>
              </TouchableOpacity>
            ))}
          </View>,
        )}

      {/* Account Status */}
      {(user.accountStatus || user.subscription || user.joinedDate) &&
        renderSection(
          'Account Information',
          <View>
            {user.accountStatus &&
              renderInfoItem('Account Status', user.accountStatus)}
            {user.subscription &&
              renderInfoItem('Subscription', user.subscription)}
            {user.joinedDate &&
              renderInfoItem(
                'Joined',
                new Date(user.joinedDate).toLocaleDateString(),
              )}
            {user.lastOnline &&
              renderInfoItem(
                'Last Online',
                new Date(user.lastOnline).toLocaleString(),
              )}
            {user.isEmailVerified !== undefined &&
              renderInfoItem(
                'Email Verified',
                user.isEmailVerified ? 'Yes' : 'No',
              )}
            {user.isPhoneVerified !== undefined &&
              renderInfoItem(
                'Phone Verified',
                user.isPhoneVerified ? 'Yes' : 'No',
              )}
          </View>,
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
        {/* Back button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={30} color={'white'} />
        </TouchableOpacity>

        {/* Image navigation dots */}
        {allImages.length > 1 && (
          <View style={styles.imageIndicators}>
            {allImages.map((_, index) => {
              const ViewComponent = View as any;
              return (
                <ViewComponent
                  key={`indicator-${index}`}
                  style={[
                    styles.indicator,
                    index === currentImageIndex && styles.activeIndicator,
                  ]}
                />
              );
            })}
          </View>
        )}

        {/* Left/Right tap areas for image navigation */}
        {allImages.length > 1 && (
          <>
            <TouchableOpacity style={styles.leftTapArea} onPress={prevImage} />
            <TouchableOpacity style={styles.rightTapArea} onPress={nextImage} />
          </>
        )}

        {/* Basic info overlay at bottom */}
        <LinearGradient
          colors={['transparent', '#000000a8']}
          style={styles.basicInfoOverlay}
        >
          <Text style={styles.overlayName}>
            {user.firstName} {user.age}
          </Text>
          <Text style={styles.overlayAge}>{user.location.city}</Text>

          <View
            style={{
              backgroundColor: '#ffffff39',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 5,
              borderRadius: 100,
              alignSelf: 'center',
              marginTop: 10,
              width: '60%',
              paddingHorizontal: 20,
              paddingVertical: 15,
            }}
          >
            <TouchableOpacity
              onPress={handleDislike}
              style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SimpleLineIcons name="dislike" size={22} color={'white'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={handleLike}
            >
              <Ionicons name="heart-outline" size={30} color={'white'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={handleLike}
            >
              <Entypo name="dots-three-horizontal" size={30} color={'white'} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Swipe gesture handler */}
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View
            style={[
              styles.gestureArea,
              { transform: [{ translateY: translateY }] },
            ]}
          />
        </PanGestureHandler>

        {/* Action Modal */}
        <Modal
          visible={isActionModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsActionModalVisible(false)}
        >
          <View style={styles.actionModalContainer}>
            <View style={styles.actionModalContent}>
              <Text style={styles.actionModalText}>{actionMessage}</Text>
            </View>
          </View>
        </Modal>

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
  backButton: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: 90,
    left: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 25,
  },
  imageIndicators: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 10,
  },
  indicator: {
    width: 80,
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#4F0D50',
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
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },
  overlayName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    paddingTop: 120,
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
    marginBottom: 20,
  },
  gestureArea: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    height: "80%",
    // backgroundColor:"red"
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
  actionButtonsContainer: {
    position: 'absolute',
    right: 15,
    bottom: 120,
    zIndex: 10,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 100,
    borderColor: '#ffffff8d',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff2b',
  },
  actionModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  actionModalContent: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionModalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default UserDetails;
