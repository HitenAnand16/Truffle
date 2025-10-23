import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useRegistration } from '../../../context/RegistrationContext';
import {
  generateUniqueTestEmail,
  generateUniqueTestPhone,
} from '../../../utils/testCredentials';
import { SafeAreaView } from 'react-native-safe-area-context';

const UploadPicRegisgter = ({ navigation }: { navigation: any }) => {
  const { registrationData, updateRegistrationData, resetRegistrationData } =
    useRegistration();
  const [image, setImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 500,
        maxHeight: 500,
        quality: 0.8,
        includeBase64: true, // Include base64 data
      },
      response => {
        if (response.didCancel) {
          console.log('User canceled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          if (asset.uri) {
            setImage(asset.uri);
            // Store the image asset info for FormData upload
            updateRegistrationData({ picture: asset.uri });
            console.log('Image uploaded:', {
              uri: asset.uri,
              type: asset.type,
              fileName: asset.fileName,
              size: asset.fileSize,
            });
          }
        }
      },
    );
  };

  const handleSubmit = async () => {
    if (!image) {
      Alert.alert(
        'Image Required',
        'Please upload an image before submitting.',
      );
      return;
    }

    // Validate age
    const age = parseInt(registrationData.age);
    if (isNaN(age) || age < 18) {
      Alert.alert(
        'Age Validation',
        'You must be at least 18 years old to register.',
      );
      return;
    }

    // Validate required fields
    if (
      !registrationData.name ||
      !registrationData.email ||
      !registrationData.phone
    ) {
      Alert.alert(
        'Missing Information',
        'Please complete all previous steps before submitting.',
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate unique test credentials for API submission
      const testEmail = generateUniqueTestEmail();
      const testPhone = generateUniqueTestPhone();

      console.log('Using test credentials:', { testEmail, testPhone });

      // Prepare FormData for file upload (matching Postman format)
      const formData = new FormData();
      formData.append('name', registrationData.name.trim());
      formData.append('age', age.toString());
      formData.append('sex', registrationData.sex.toLowerCase()); // API expects lowercase
      formData.append('email', testEmail); // Use unique test email
      formData.append('phone', testPhone); // Use unique test phone
      formData.append('instagram', registrationData.instagram.trim());
      formData.append('occupation', registrationData.occupation.trim());
      formData.append('description', registrationData.description.trim());

      // Add the image file
      if (registrationData.picture) {
        const imageUri = registrationData.picture;
        const filename = imageUri.split('/').pop() || 'image.jpg';
        const type = 'image/jpeg'; // Default to jpeg

        formData.append('picture', {
          uri: imageUri,
          type: type,
          name: filename,
        } as any);
      }

      console.log('Submitting invitation with FormData:', {
        name: registrationData.name.trim(),
        age: age,
        sex: registrationData.sex.toLowerCase(),
        email: testEmail,
        phone: testPhone,
        instagram: registrationData.instagram.trim(),
        occupation: registrationData.occupation.trim(),
        description: registrationData.description.trim(),
        picture: registrationData.picture ? 'Image file attached' : 'No image',
      });

      // Make API call to submit the invitation using FormData
      const response = await fetch(
        'https://truffle-0ol8.onrender.com/api/invite',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        },
      );

      const result = await response.json();
      console.log('API Response:', result);

      if (response.ok && (result.success === true || result.status === true)) {
        // Success - show the modal
        setModalVisible(true);
        // Reset registration data after successful submission
        resetRegistrationData();
      } else {
        throw new Error(result.message || 'Failed to submit invitation');
      }
    } catch (error) {
      console.error('Error submitting invitation:', error);
      Alert.alert(
        'Submission Failed',
        'There was an error submitting your invitation. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Ionicons
          onPress={() => {
            navigation.goBack();
          }}
          name="chevron-back"
          size={30}
          color="black"
          style={{ marginLeft: 10 }}
        />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Request Your Invite</Text>

        <Text style={styles.label}>
          Upload a pic that says{'\n'}‘I belong here’
        </Text>
        <TouchableOpacity
          style={styles.uploadContainer}
          onPress={handleImageUpload}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <>
              <Text style={styles.icon}>📷</Text>
              <Text style={styles.uploadText}>Click to upload image</Text>
              <Text style={styles.maxSize}>Max size: 10 MB</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={{ marginTop: 10, color: '#6B6B6B', fontSize: 14 }}>
          Attach a clear and identifiable photo for smooth{'\n'}verification
        </Text>

        <TouchableOpacity
          style={[styles.nextButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Submitting...' : 'Submit Invite'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Full-screen modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image
              source={require('../../../../assets/glass.png')}
              style={styles.modalImage}
            />
            <Text style={styles.modalTitle}>
              Thank you, {registrationData.name}
            </Text>
            <Text style={styles.modalSubText}>
              We've received your application and will get back to you as soon
              as we can.
            </Text>
            <Text style={styles.modalEmailText}>
              We've sent a verification email to {registrationData.email}.
              Please check your email and click the link to verify.
            </Text>
          </View>

          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Initial' }],
                });
                setModalVisible(false);
              }}
            >
              <View style={styles.buttonIconContainer}>
                <Ionicons name="person-outline" size={24} color="#333" />
              </View>
              <Text style={styles.modalButtonText}>My information</Text>
              <Ionicons name="chevron-forward" size={20} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Track' }],
                });
                setModalVisible(false);
              }}
            >
              <View style={styles.buttonIconContainer}>
                <Ionicons name="play-circle-outline" size={24} color="#333" />
              </View>
              <Text style={styles.modalButtonText}>
                Learn more about Truffle
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                // Add referral functionality here
                setModalVisible(false);
              }}
            >
              <View style={styles.buttonIconContainer}>
                <Ionicons name="add-outline" size={24} color="#333" />
              </View>
              <Text style={styles.modalButtonText}>Add referrals</Text>
              <Ionicons name="chevron-forward" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    // marginBottom: 8,
    color: '#333',
  },
  nextButton: {
    backgroundColor: '#4F0D50',
    paddingVertical: 12,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 20,
    position: 'absolute',
    bottom: 0,
    marginHorizontal: 5,
    paddingHorizontal: 70,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  uploadContainer: {
    width: '100%',
    height: 200,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1e6ff',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  icon: {
    fontSize: 50,
    color: '#888',
  },
  uploadText: {
    color: '#888',
    fontSize: 16,
  },
  maxSize: {
    color: '#888',
    fontSize: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F0F5',
    paddingHorizontal: 20,
  },
  modalContainer: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    height: '90%',
  },
  modalContent: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 40,
    borderRadius: 43,
    marginBottom: 30,
    width: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingVertical: 80,
  },
  modalImage: {
    width: 120,
    height: 90,
    resizeMode: 'contain',
    marginBottom: 25,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 25,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  modalSubText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalEmailText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalButtonsContainer: {
    width: '90%',
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 5,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 18,
  },
  buttonIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  modalButtonText: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#4F0D50',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 5,
    alignItems: 'center',
    width: '80%',
  },
  buttonText1: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
});

export default UploadPicRegisgter;
