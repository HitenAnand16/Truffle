import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  TextInput,
  Alert,
  ActivityIndicator,
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
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: `${currentUser.firstName}${currentUser.lastName ? ' ' + currentUser.lastName : ''}`,
    age: String(currentUser.age || ''),
    occupation: currentUser.occupation || '',
    description: currentUser.description || '',
  });

  const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTA5ZDlhMGVlYmUwZDMwZGE2MDgyZGYiLCJpYXQiOjE3NjQ0OTM0NjAsImV4cCI6MTc2NTA5ODI2MH0.wK3YkmBYJceWJXQi8lZ50hJY6Xnuu6f8Y6FXvrBSz9I';

  const [loadingUser, setLoadingUser] = useState(false);
  const [user, setUser] = useState<any>(currentUser);

  const normalizeApiUser = (api: any) => {
    if (!api) return null;
    return {
      id: api._id,
      firstName: api.name || '',
      lastName: '',
      email: api.email || '',
      phone: api.phone || '',
      age: api.age || 0,
      profilePicture: api.picture || currentUser.profilePicture,
      additionalPhotos: Array.isArray(api.pictures) ? api.pictures : [],
      about: api.about || '',
      description: api.description || '',
      interests: Array.isArray(api.interests) ? api.interests : [],
      occupation: api.occupation || '',
      education: api.education || '',
      height: api.height?.value || currentUser.height,
      bodyType: api.bodyType || currentUser.bodyType,
      smokingStatus: api.smokingStatus || currentUser.smokingStatus,
      drinkingStatus: api.drinkingStatus || currentUser.drinkingStatus,
      religion: api.religion || currentUser.religion,
      politicalViews: api.politicalViews || currentUser.politicalViews,
      languages: api.languages || currentUser.languages,
      whatAmILookingFor: api.whatAmILookingFor || currentUser.whatAmILookingFor,
      location: {
        city: api.occupation || 'Unknown',
        state: '',
        country: '',
        latitude: api.location?.coordinates?.[1] ?? currentUser.location.latitude,
        longitude: api.location?.coordinates?.[0] ?? currentUser.location.longitude,
      },
      socialMediaLinks: api.instagram ? { instagram: api.instagram } : currentUser.socialMediaLinks,
      preferences: currentUser.preferences,
      isVerified: api.isVerified ?? currentUser.isVerified,
      isEmailVerified: currentUser.isEmailVerified,
      isPhoneVerified: currentUser.isPhoneVerified,
      profileCompleteness: currentUser.profileCompleteness,
      likes: currentUser.likes,
      dislikes: currentUser.dislikes,
      matches: currentUser.matches,
      views: currentUser.views,
      lastOnline: currentUser.lastOnline,
      joinedDate: currentUser.joinedDate,
      accountStatus: currentUser.accountStatus,
      subscription: currentUser.subscription,
    };
  };

  // Fetch current user on mount
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoadingUser(true);
        const res = await fetch('https://truffle-0ol8.onrender.com/api/profile', {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            Accept: 'application/json',
          },
        });
        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          throw new Error(`Fetch profile failed: ${res.status} ${txt}`);
        }
        const data = await res.json();
        console.log('profile api response', data);
        const apiUser = data?.user ?? data;
        const normalized = normalizeApiUser(apiUser);
        if (__DEV__) {
          console.log('normalized profile user', normalized);
        }
        if (normalized) {
          setUser(normalized);
          setForm({
            name: `${normalized.firstName}${normalized.lastName ? ' ' + normalized.lastName : ''}`,
            age: String(normalized.age || ''),
            occupation: normalized.occupation || '',
            description: normalized.description || '',
          });
        }
      } catch (e) {
        console.error('fetch profile error', e);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      const payload: any = {
        name: form.name?.trim(),
        age: form.age ? Number(form.age) : undefined,
        occupation: form.occupation?.trim(),
        description: form.description?.trim(),
      };
      // Remove undefined fields
      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

      const res = await fetch('https://truffle-0ol8.onrender.com/api/profile/update', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`Update failed: ${res.status} ${txt}`);
      }
      const data = await res.json().catch(() => ({}));
      console.log('profile update response', data);
      const updated = normalizeApiUser((data as any)?.user ?? data);
      if (updated) setUser(updated);
      Alert.alert('Success', 'Profile updated successfully');
      setViewMode('buttons');
    } catch (e: any) {
      console.error('profile update error', e);
      Alert.alert('Error', e?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }, [form]);

  // All images (profile + additional)
  const allImages = [
    user.profilePicture,
    ...(user.additionalPhotos || []),
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
      source={{ uri: user.profilePicture }}
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
          source={{ uri: user.profilePicture }}
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
                <View style={{ }}>
                  <Text style={styles.overlayName}>
                  {user.firstName}, {user.age}
                </Text>
                <Text style={styles.overlayLocation}>
                  {user.location?.city}
                </Text>
                </View>

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
                {user.firstName} {user.lastName}
              </Text>
              <Text style={userProfileStyles.overlayAge}>{user.location?.city}</Text>
            </View>
          </LinearGradient>

          {/* Content Sections with Blur Background */}
          <View style={userProfileStyles.contentContainer}>
            {/* About */}
            {user.about &&
              renderSection(
                'About Me',
                <Text style={userProfileStyles.aboutText}>{user.about}</Text>,
              )}

            {/* Description */}
            {user.description &&
              renderSection(
                'Description',
                <Text style={userProfileStyles.descriptionText}>
                  {user.description}
                </Text>,
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
                {user.drinkingStatus && renderInfoItem('Drinking', user.drinkingStatus)}
                {user.religion && renderInfoItem('Religion', user.religion)}
                {user.politicalViews && renderInfoItem('Political Views', user.politicalViews)}
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
                    `${user.location.city || ''}, ${
                      user.location.state || ''
                    }`,
                  )}
              </View>,
            )}

            {/* Interests */}
            {user.interests && user.interests.length > 0 && renderSection('Interests', renderTags(user.interests))}

            {/* Strengths */}
            {user.strengths && user.strengths.length > 0 && renderSection('Strengths', renderTags(user.strengths))}

            {/* Languages */}
            {user.languages && user.languages.length > 0 && renderSection('Languages', renderTags(user.languages))}

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
                        <Text style={userProfileStyles.subsectionTitle}>
                          Desired Personality Traits:
                        </Text>
                        {renderTags(user.whatAmILookingFor.personality)}
                      </>
                    )}
                  {user.whatAmILookingFor.activities &&
                    user.whatAmILookingFor.activities.length > 0 && (
                      <>
                        <Text style={userProfileStyles.subsectionTitle}>
                          Preferred Activities:
                        </Text>
                        {renderTags(user.whatAmILookingFor.activities)}
                      </>
                    )}
                  {user.whatAmILookingFor.qualities &&
                    user.whatAmILookingFor.qualities.length > 0 && (
                      <>
                        <Text style={userProfileStyles.subsectionTitle}>
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
                <View style={userProfileStyles.preferencesContainer}>
                  <Text style={userProfileStyles.preferenceText}>
                    Looking for {user.preferences.gender || 'anyone'} •
                    Ages {user.preferences.ageRange?.min || 18}-
                    {user.preferences.ageRange?.max || 99} • Within {user.preferences.distance || 50} miles
                  </Text>
                </View>,
              )}

            {/* Social Media */}
            {user.socialMediaLinks && Object.keys(user.socialMediaLinks).length > 0 &&
              renderSection(
                'Social Media',
                <View style={userProfileStyles.socialContainer}>
                  {Object.entries(user.socialMediaLinks).map(
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
            {(user.accountStatus || user.subscription || user.joinedDate) &&
              renderSection(
                'Account Information',
                <View>
                  {user.accountStatus && renderInfoItem('Account Status', user.accountStatus)}
                  {user.subscription && renderInfoItem('Subscription', user.subscription)}
                  {user.joinedDate && renderInfoItem('Joined', new Date(user.joinedDate).toLocaleDateString())}
                  {user.lastOnline && renderInfoItem('Last Online', new Date(user.lastOnline).toLocaleString())}
                  {user.isEmailVerified !== undefined && renderInfoItem('Email Verified', user.isEmailVerified ? 'Yes' : 'No')}
                  {user.isPhoneVerified !== undefined && renderInfoItem('Phone Verified', user.isPhoneVerified ? 'Yes' : 'No')}
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
          <TouchableOpacity disabled={saving} onPress={handleSave}>
            {saving ? (
              <ActivityIndicator color="#4F0D50" />
            ) : (
              <Text style={styles.saveText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.editContent}>
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              value={form.name}
              onChangeText={t => setForm(f => ({ ...f, name: t }))}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={form.age}
              onChangeText={t => setForm(f => ({ ...f, age: t }))}
              inputMode="numeric"
              keyboardType="number-pad"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Occupation</Text>
            <TextInput
              style={styles.input}
              placeholder="Occupation"
              value={form.occupation}
              onChangeText={t => setForm(f => ({ ...f, occupation: t }))}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Tell something about you"
              value={form.description}
              onChangeText={t => setForm(f => ({ ...f, description: t }))}
              placeholderTextColor="#999"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>
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
    paddingVertical: 10,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'black',
    fontSize: 15,
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
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#222',
    backgroundColor: '#fff',
  },
  textarea: {
    minHeight: 120,
  },
});

export default UserProfileScreen;
