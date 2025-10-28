import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { OptimizedImageBackground } from '../../components/OptimizedImage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import { useUserActions } from '../../context/UserActionsContext';

const { width, height } = Dimensions.get('window');

const UserDetails = ({ route, navigation }: any) => {
  const { user } = route.params; // Get user data passed via navigation
  const { addLikedUser, addDislikedUser } = useUserActions();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  // All images (profile + additional)
  const allImages = [user.profilePicture, ...(user.additionalPhotos || [])];

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

  return (
    <View style={styles.container}>
      {/* Full Screen Background Image */}
      <OptimizedImageBackground
        source={{ uri: allImages[currentImageIndex] }}
        style={styles.fullScreenBackground}
        resizeMode="cover"
      >
        {/* Fixed Header Section with Navigation */}
        <View style={styles.headerSection}>
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
              {allImages.map((_, index) => (
                <View
                  key={`indicator-${index}`}
                  style={[
                    styles.indicator,
                    index === currentImageIndex && styles.activeIndicator,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Left/Right tap areas for image navigation */}
          {allImages.length > 1 && (
            <>
              <TouchableOpacity
                style={styles.leftTapArea}
                onPress={prevImage}
              />
              <TouchableOpacity
                style={styles.rightTapArea}
                onPress={nextImage}
              />
            </>
          )}
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* First screen is just the image - add empty space equal to screen height minus bottom section */}
          <View style={styles.firstScreenSpacer} />

          {/* Bottom Action Section - scrollable */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)']}
            style={styles.bottomActionSection}
          >
            <View style={styles.userInfoContainer}>
              <Text style={styles.overlayName}>
                {user.firstName}, {user.age}
              </Text>
              <Text style={styles.overlayAge}>{user.location.city}</Text>
            </View>
          </LinearGradient>

          {/* Content Sections with Blur Background */}
          <View style={styles.contentContainer}>
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
                {user.occupation &&
                  renderInfoItem('Occupation', user.occupation)}
                {user.education && renderInfoItem('Education', user.education)}
                {user.height && renderInfoItem('Height', user.height)}
                {user.bodyType && renderInfoItem('Body Type', user.bodyType)}
                {user.smokingStatus &&
                  renderInfoItem('Smoking', user.smokingStatus)}
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
                  {Object.entries(user.socialMediaLinks).map(
                    ([platform, url]) => (
                      <TouchableOpacity
                        key={platform}
                        style={styles.socialButton}
                      >
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
                          color="#fff"
                        />
                        <Text style={styles.socialText}>{platform}</Text>
                      </TouchableOpacity>
                    ),
                  )}
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
          </View>
        </ScrollView>

        {/* Sticky Action Buttons */}
        <View style={styles.stickyActionButtons}>
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              onPress={handleDislike}
              style={styles.actionButton}
            >
              <SimpleLineIcons name="dislike" size={22} color={'white'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <Ionicons name="heart-outline" size={30} color={'white'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Entypo name="dots-three-horizontal" size={30} color={'white'} />
            </TouchableOpacity>
          </View>
        </View>
      </OptimizedImageBackground>

      {/* Action Modal for like/dislike feedback */}
      {isActionModalVisible && (
        <View style={styles.actionModalContainer}>
          <View style={styles.actionModalContent}>
            <Text style={styles.actionModalText}>{actionMessage}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullScreenBackground: {
    flex: 1,
    width: width,
    height: height,
  },
  scrollView: {
    flex: 1,
  },
  headerSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 100,
  },
  firstScreenSpacer: {
    height: height - 250, // Reduced to make room for bottom section
    paddingBottom: 20,
  },
  bottomActionSection: {},
  backButton: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: 100,
    left: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
  },
  imageIndicators: {
    position: 'absolute',
    top: 80,
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
    height: height - 500,
  },
  rightTapArea: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '40%',
    zIndex: 5,
    height: height - 500,
  },
  userInfoContainer: {
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    width: width - 40,
    marginTop: '5%',
    paddingBottom: '15%',
    marginBottom: '15%',
  },
  stickyActionButtons: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 200,
  },
  overlayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  overlayAge: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  actionButtonsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderRadius: 50,
    width: '70%',
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  actionButton: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  contentContainer: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  section: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 15,
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  aboutText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  descriptionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#fff',
    flex: 2,
    textAlign: 'right',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tagText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  preferencesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  preferenceText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  socialContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  socialText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'capitalize',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  actionModalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  actionModalContent: {
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  actionModalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default UserDetails;
