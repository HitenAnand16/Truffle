import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { OptimizedImage, OptimizedImageBackground } from '../../components/OptimizedImage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import { currentUser } from '../../../user';

const { width, height } = Dimensions.get('window');

const UserProfileScreens = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'buttons' | 'view' | 'edit'>('buttons');

  // All images (profile + additional)
  const allImages = [currentUser.profilePicture, ...(currentUser.additionalPhotos || [])];

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
        {items.map((item, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{item}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Render buttons screen
  const renderButtonsScreen = () => (
    <View style={styles.container}>
      <OptimizedImageBackground
        source={{ uri: allImages[currentImageIndex] }}
        style={styles.fullScreenBackground}
        resizeMode="cover"
      >
        {/* Image navigation for buttons screen */}
        <View style={styles.imageIndicators}>
          {allImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentImageIndex && styles.activeIndicator,
              ]}
            />
          ))}
        </View>

        {/* Left/Right tap areas for image navigation */}
        {allImages.length > 1 && (
          <>
            <TouchableOpacity style={styles.leftTapArea} onPress={prevImage} />
            <TouchableOpacity style={styles.rightTapArea} onPress={nextImage} />
          </>
        )}

        {/* User Info and Buttons */}
        <View style={styles.buttonsContainer}>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
            style={styles.buttonsSection}
          >
            <View style={styles.userInfoContainer}>
              <Text style={styles.overlayName}>
                {currentUser.firstName} {currentUser.lastName}
              </Text>
              <Text style={styles.overlayAge}>{currentUser.age} years old</Text>
              <Text style={styles.overlayLocation}>{currentUser.location.city}</Text>

              {/* Action Buttons */}
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setViewMode('edit')}
                >
                  <Ionicons name="create-outline" size={24} color={'white'} />
                  <Text style={styles.actionButtonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setViewMode('view')}
                >
                  <Ionicons name="eye-outline" size={24} color={'white'} />
                  <Text style={styles.actionButtonText}>View Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      </OptimizedImageBackground>
    </View>
  );

  // Render view profile screen (same as userDetail.tsx)
  const renderViewProfileScreen = () => (
    <View style={styles.container}>
      <OptimizedImageBackground
        source={{ uri: allImages[currentImageIndex] }}
        style={styles.fullScreenBackground}
        resizeMode="cover"
      >
        {/* Fixed Header Section with Navigation */}
        <View style={styles.headerSection}>
          {/* Back button */}
          <TouchableOpacity
            onPress={() => setViewMode('buttons')}
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
              <TouchableOpacity style={styles.leftTapArea} onPress={prevImage} />
              <TouchableOpacity style={styles.rightTapArea} onPress={nextImage} />
            </>
          )}
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* First screen is just the image - add empty space equal to screen height minus bottom section */}
          <View style={styles.firstScreenSpacer} />

          {/* Bottom Action Section - scrollable */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)']}
            style={styles.bottomActionSection}
          >
            <View style={styles.userInfoContainer}>
              <Text style={styles.overlayName}>
                {currentUser.firstName} {currentUser.lastName}
              </Text>
              <Text style={styles.overlayAge}>{currentUser.location.city}</Text>
            </View>
          </LinearGradient>

          {/* Content Sections with Blur Background */}
          <View style={styles.contentContainer}>
            {/* About */}
            {currentUser.about &&
              renderSection(
                'About Me',
                <Text style={styles.aboutText}>{currentUser.about}</Text>,
              )}

            {/* Description */}
            {currentUser.description &&
              renderSection(
                'Description',
                <Text style={styles.descriptionText}>{currentUser.description}</Text>,
              )}

            {/* Personal Details */}
            {renderSection(
              'Personal Details',
              <View>
                {currentUser.occupation && renderInfoItem('Occupation', currentUser.occupation)}
                {currentUser.education && renderInfoItem('Education', currentUser.education)}
                {currentUser.height && renderInfoItem('Height', currentUser.height)}
                {currentUser.bodyType && renderInfoItem('Body Type', currentUser.bodyType)}
                {currentUser.smokingStatus && renderInfoItem('Smoking', currentUser.smokingStatus)}
                {currentUser.drinkingStatus && renderInfoItem('Drinking', currentUser.drinkingStatus)}
                {currentUser.religion && renderInfoItem('Religion', currentUser.religion)}
                {currentUser.politicalViews && renderInfoItem('Political Views', currentUser.politicalViews)}
              </View>,
            )}

            {/* Contact Info */}
            {renderSection(
              'Contact Information',
              <View>
                {currentUser.email && renderInfoItem('Email', currentUser.email)}
                {currentUser.phone && renderInfoItem('Phone', currentUser.phone)}
                {currentUser.location &&
                  renderInfoItem(
                    'Location',
                    `${currentUser.location.city || ''}, ${currentUser.location.state || ''}`,
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
                        <Text style={styles.subsectionTitle}>
                          Desired Personality Traits:
                        </Text>
                        {renderTags(currentUser.whatAmILookingFor.personality)}
                      </>
                    )}
                  {currentUser.whatAmILookingFor.activities &&
                    currentUser.whatAmILookingFor.activities.length > 0 && (
                      <>
                        <Text style={styles.subsectionTitle}>
                          Preferred Activities:
                        </Text>
                        {renderTags(currentUser.whatAmILookingFor.activities)}
                      </>
                    )}
                  {currentUser.whatAmILookingFor.qualities &&
                    currentUser.whatAmILookingFor.qualities.length > 0 && (
                      <>
                        <Text style={styles.subsectionTitle}>
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
                <View style={styles.preferencesContainer}>
                  <Text style={styles.preferenceText}>
                    Looking for {currentUser.preferences.gender || 'anyone'} • Ages{' '}
                    {currentUser.preferences.ageRange?.min || 18}-
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
                <View style={styles.socialContainer}>
                  {Object.entries(currentUser.socialMediaLinks).map(([platform, url]) => (
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
                        color="#fff"
                      />
                      <Text style={styles.socialText}>{platform}</Text>
                    </TouchableOpacity>
                  ))}
                </View>,
              )}

            {/* Account Status */}
            {(currentUser.accountStatus || currentUser.subscription || currentUser.joinedDate) &&
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
    <View style={styles.container}>
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
          <Text style={styles.placeholderText}>Edit Profile functionality coming soon...</Text>
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
  // Buttons screen styles
  buttonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonsSection: {
    paddingBottom: 40,
    paddingTop: 40,
    alignItems: 'center',
  },
  userInfoContainer: {
    alignItems: 'center',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    width: width - 40,
  },
  overlayName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
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
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // View profile screen styles (similar to userDetail.tsx)
  headerSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 100,
  },
  backButton: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: 60,
    left: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
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
    width: 80,
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#fff',
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
  firstScreenSpacer: {
    height: height - 300,
    paddingBottom: 20,
  },
  bottomActionSection: {
    paddingBottom: 0,
    paddingTop: 40,
    alignItems: 'center',
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

export default UserProfileScreens;
