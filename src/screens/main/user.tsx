import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {
  OptimizedImage,
  OptimizedImageBackground,
} from '../../components/OptimizedImage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import { currentUser } from '../../../user';
import { userProfileStyles } from '../../styles/userProfileStyles';

const { width, height } = Dimensions.get('window');

const UserProfileScreen = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'buttons' | 'view' | 'edit'>(
    'buttons',
  );

  // All images (profile + additional)
  const allImages = [
    currentUser.profilePicture,
    ...(currentUser.additionalPhotos || []),
  ];

  // Navigate through images
  const nextImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex(
      prev => (prev - 1 + allImages.length) % allImages.length,
    );
  }, [allImages.length]);
  const renderSection = (title: string, content: React.ReactNode) => (
    <View style={userProfileStyles.section}>
      <Text style={userProfileStyles.sectionTitle}>{title}</Text>
      {content}
    </View>
  );

  const renderInfoItem = (label: string, value: string | number) => (
    <View style={userProfileStyles.infoItem}>
      <Text style={userProfileStyles.infoLabel}>{label}:</Text>
      <Text style={userProfileStyles.infoValue}>{value}</Text>
    </View>
  );

  const renderTags = (items: string[]) => {
    return (
      <View style={userProfileStyles.tagsContainer}>
        {items.map((item, index) => (
          <View key={index} style={userProfileStyles.tag}>
            <Text style={userProfileStyles.tagText}>{item}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Render buttons screen
  const renderButtonsScreen = () => (
    <OptimizedImageBackground
      source={{ uri: currentUser.profilePicture }}
      style={userProfileStyles.fullScreenBackground}
      resizeMode="cover"
      blurRadius={17}
    >
      <View style={styles.centerContent}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 20,
            marginLeft: 20,
          }}
        >
          Profile
        </Text>
        <ImageBackground
          source={{ uri: currentUser.profilePicture }}
          resizeMode="cover"
          imageStyle={{ borderRadius: 43 }}
          style={styles.profileBackground}
        >
          <LinearGradient
            colors={['transparent', '#0000009f']}
            style={styles.buttonsContainer}
          >
            <View style={styles.buttonsSection}>
              <View style={styles.userInfoContainer}>
                <Text style={styles.overlayName}>
                  {currentUser.firstName}, {currentUser.age}
                </Text>
                <Text style={styles.overlayLocation}>
                  {currentUser.location.city}
                </Text>

                {/* Action Buttons */}
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setViewMode('edit')}
                  >
                    <Text style={styles.actionButtonText}>Edit Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setViewMode('view')}
                  >
                    <Text style={styles.actionButtonText}>View Profile</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    </OptimizedImageBackground>
  );

  // Render view profile screen (same as userDetail.tsx)
  const renderViewProfileScreen = () => (
    <View style={userProfileStyles.container}>
      <OptimizedImageBackground
        source={{ uri: allImages[currentImageIndex] }}
        style={userProfileStyles.fullScreenBackground}
        resizeMode="cover"
      >
        {/* Fixed Header Section with Navigation */}
        <View style={userProfileStyles.headerSection}>
          {/* Back button */}
          <TouchableOpacity
            onPress={() => setViewMode('buttons')}
            style={userProfileStyles.backButton}
          >
            <Ionicons name="chevron-back" size={30} color={'white'} />
          </TouchableOpacity>

          {/* Image navigation dots */}
          {allImages.length > 1 && (
            <View style={userProfileStyles.imageIndicators}>
              {allImages.map((_, index) => (
                <View
                  key={`indicator-${index}`}
                  style={[
                    userProfileStyles.indicator,
                    index === currentImageIndex && userProfileStyles.activeIndicator,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Left/Right tap areas for image navigation */}
          {allImages.length > 1 && (
            <>
              <TouchableOpacity
                style={userProfileStyles.leftTapArea}
                onPress={prevImage}
              />
              <TouchableOpacity
                style={userProfileStyles.rightTapArea}
                onPress={nextImage}
              />
            </>
          )}
        </View>

        <ScrollView
          style={userProfileStyles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* First screen is just the image - add empty space equal to screen height minus bottom section */}
          <View style={userProfileStyles.firstScreenSpacer} />

          {/* Bottom Action Section - scrollable */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)']}
            style={userProfileStyles.bottomActionSection}
          >
            <View style={userProfileStyles.userInfoContainer}>
              <Text style={userProfileStyles.overlayName}>
                {currentUser.firstName} {currentUser.lastName}
              </Text>
              <Text style={userProfileStyles.overlayAge}>{currentUser.location.city}</Text>
            </View>
          </LinearGradient>

          {/* Content Sections with Blur Background */}
          <View style={userProfileStyles.contentContainer}>
            {/* About */}
            {currentUser.about &&
              renderSection(
                'About Me',
                <Text style={userProfileStyles.aboutText}>{currentUser.about}</Text>,
              )}

            {/* Description */}
            {currentUser.description &&
              renderSection(
                'Description',
                <Text style={userProfileStyles.descriptionText}>
                  {currentUser.description}
                </Text>,
              )}

            {/* Personal Details */}
            {renderSection(
              'Personal Details',
              <View>
                {currentUser.occupation &&
                  renderInfoItem('Occupation', currentUser.occupation)}
                {currentUser.education &&
                  renderInfoItem('Education', currentUser.education)}
                {currentUser.height &&
                  renderInfoItem('Height', currentUser.height)}
                {currentUser.bodyType &&
                  renderInfoItem('Body Type', currentUser.bodyType)}
                {currentUser.smokingStatus &&
                  renderInfoItem('Smoking', currentUser.smokingStatus)}
                {currentUser.drinkingStatus &&
                  renderInfoItem('Drinking', currentUser.drinkingStatus)}
                {currentUser.religion &&
                  renderInfoItem('Religion', currentUser.religion)}
                {currentUser.politicalViews &&
                  renderInfoItem('Political Views', currentUser.politicalViews)}
              </View>,
            )}

            {/* Contact Info */}
            {renderSection(
              'Contact Information',
              <View>
                {currentUser.email &&
                  renderInfoItem('Email', currentUser.email)}
                {currentUser.phone &&
                  renderInfoItem('Phone', currentUser.phone)}
                {currentUser.location &&
                  renderInfoItem(
                    'Location',
                    `${currentUser.location.city || ''}, ${
                      currentUser.location.state || ''
                    }`,
                  )}
              </View>,
            )}

            {/* Interests */}
            {currentUser.interests &&
              currentUser.interests.length > 0 &&
              renderSection('Interests', renderTags(currentUser.interests))}

            {/* Strengths */}
            {currentUser.strengths &&
              currentUser.strengths.length > 0 &&
              renderSection('Strengths', renderTags(currentUser.strengths))}

            {/* Languages */}
            {currentUser.languages &&
              currentUser.languages.length > 0 &&
              renderSection('Languages', renderTags(currentUser.languages))}

            {/* Looking For */}
            {currentUser.whatAmILookingFor &&
              renderSection(
                "What I'm Looking For",
                <View>
                  {currentUser.whatAmILookingFor.relationshipType &&
                    renderInfoItem(
                      'Relationship Type',
                      currentUser.whatAmILookingFor.relationshipType,
                    )}
                  {currentUser.whatAmILookingFor.communicationStyle &&
                    renderInfoItem(
                      'Communication Style',
                      currentUser.whatAmILookingFor.communicationStyle,
                    )}
                  {currentUser.whatAmILookingFor.physicalAttraction &&
                    renderInfoItem(
                      'Physical Attraction',
                      currentUser.whatAmILookingFor.physicalAttraction,
                    )}
                  {currentUser.whatAmILookingFor.personality &&
                    currentUser.whatAmILookingFor.personality.length > 0 && (
                      <>
                        <Text style={userProfileStyles.subsectionTitle}>
                          Desired Personality Traits:
                        </Text>
                        {renderTags(currentUser.whatAmILookingFor.personality)}
                      </>
                    )}
                  {currentUser.whatAmILookingFor.activities &&
                    currentUser.whatAmILookingFor.activities.length > 0 && (
                      <>
                        <Text style={userProfileStyles.subsectionTitle}>
                          Preferred Activities:
                        </Text>
                        {renderTags(currentUser.whatAmILookingFor.activities)}
                      </>
                    )}
                  {currentUser.whatAmILookingFor.qualities &&
                    currentUser.whatAmILookingFor.qualities.length > 0 && (
                      <>
                        <Text style={userProfileStyles.subsectionTitle}>
                          Important Qualities:
                        </Text>
                        {renderTags(currentUser.whatAmILookingFor.qualities)}
                      </>
                    )}
                </View>,
              )}

            {/* Preferences */}
            {currentUser.preferences &&
              renderSection(
                'Dating Preferences',
                <View style={userProfileStyles.preferencesContainer}>
                  <Text style={userProfileStyles.preferenceText}>
                    Looking for {currentUser.preferences.gender || 'anyone'} •
                    Ages {currentUser.preferences.ageRange?.min || 18}-
                    {currentUser.preferences.ageRange?.max || 99} • Within{' '}
                    {currentUser.preferences.distance || 50} miles
                  </Text>
                </View>,
              )}

            {/* Social Media */}
            {currentUser.socialMediaLinks &&
              Object.keys(currentUser.socialMediaLinks).length > 0 &&
              renderSection(
                'Social Media',
                <View style={userProfileStyles.socialContainer}>
                  {Object.entries(currentUser.socialMediaLinks).map(
                    ([platform, url]) => (
                      <TouchableOpacity
                        key={platform}
                        style={userProfileStyles.socialButton}
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
                        <Text style={userProfileStyles.socialText}>{platform}</Text>
                      </TouchableOpacity>
                    ),
                  )}
                </View>,
              )}

            {/* Account Status */}
            {(currentUser.accountStatus ||
              currentUser.subscription ||
              currentUser.joinedDate) &&
              renderSection(
                'Account Information',
                <View>
                  {currentUser.accountStatus &&
                    renderInfoItem('Account Status', currentUser.accountStatus)}
                  {currentUser.subscription &&
                    renderInfoItem('Subscription', currentUser.subscription)}
                  {currentUser.joinedDate &&
                    renderInfoItem(
                      'Joined',
                      new Date(currentUser.joinedDate).toLocaleDateString(),
                    )}
                  {currentUser.lastOnline &&
                    renderInfoItem(
                      'Last Online',
                      new Date(currentUser.lastOnline).toLocaleString(),
                    )}
                  {currentUser.isEmailVerified !== undefined &&
                    renderInfoItem(
                      'Email Verified',
                      currentUser.isEmailVerified ? 'Yes' : 'No',
                    )}
                  {currentUser.isPhoneVerified !== undefined &&
                    renderInfoItem(
                      'Phone Verified',
                      currentUser.isPhoneVerified ? 'Yes' : 'No',
                    )}
                </View>,
              )}
          </View>
        </ScrollView>
      </OptimizedImageBackground>
    </View>
  );

  // Render edit profile screen (placeholder for now)
  const renderEditProfileScreen = () => (
    <View style={userProfileStyles.container}>
      <SafeAreaView style={styles.editContainer}>
        <View style={styles.editHeader}>
          <TouchableOpacity onPress={() => setViewMode('buttons')}>
            <Ionicons name="chevron-back" size={30} color="#333" />
          </TouchableOpacity>
          <Text style={styles.editTitle}>Edit Profile</Text>
          <TouchableOpacity>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.editContent}>
          <Text style={styles.placeholderText}>
            Edit Profile functionality coming soon...
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );

  // Main render based on view mode
  if (viewMode === 'view') {
    return renderViewProfileScreen();
  } else if (viewMode === 'edit') {
    return renderEditProfileScreen();
  } else {
    return renderButtonsScreen();
  }
};

const styles = StyleSheet.create({
  // Buttons screen styles - specific to this component
  centerContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  profileBackground: {
    // width: '100%',
    // borderRadius: 40,
    // alignSelf: 'flex-end',
    // justifyContent: 'flex-end',
  },
  buttonsContainer: {
    width: '100%',
    // paddingVertical: 20,
    alignItems: 'center',
    marginTop: '130%',
    overflow: 'hidden',
    borderBottomLeftRadius: 43,
    borderBottomRightRadius: 43,
  },
  buttonsSection: {
    alignItems: 'center',
  },
  userInfoContainer: {
    // alignItems: 'center',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    width: width - 40,
  },
  overlayName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  overlayAge: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  overlayLocation: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
    alignSelf: 'center',
  },
  actionButton: {
    backgroundColor: '#D9D9D9', // More opaque background
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'black',
    fontSize: 12,
    fontWeight: '600',
  },
  // Edit profile screen styles
  editContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  editTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  saveText: {
    fontSize: 16,
    color: '#4F0D50',
    fontWeight: '600',
  },
  editContent: {
    flex: 1,
    padding: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default UserProfileScreen;
