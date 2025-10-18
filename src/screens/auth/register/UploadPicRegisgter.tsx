import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { launchImageLibrary } from 'react-native-image-picker';

const UploadPicRegisgter = ({ navigation }) => {
  const [image, setImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  const handleImageUpload = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 500,
        maxHeight: 500,
        quality: 1,
      },
      response => {
        try {
          if (response.didCancel) {
            console.log('User cancelled image picker');
            return;
          }
          if (response.errorCode) {
            console.log('ImagePicker Error:', response.errorMessage);
            return;
          }

          // ✅ Safely handle undefined assets
          const asset = response?.assets?.[0];
          if (asset?.uri) {
            setImage(asset.uri);
          } else {
            console.warn('No image selected or response missing assets');
            alert('No valid image selected. Please try again.');
          }
        } catch (error) {
          console.error('Image upload error:', error);
        }
      },
    );
  };

  const handleSubmit = () => {
    // Check if the image is set before showing the modal
    if (image) {
      setModalVisible(true); // Show the modal only if an image is uploaded
    } else {
      console.log('No image uploaded yet');
      alert('Please upload an image first!');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Ionicons
          onPress={() => {
            navigation.goBack();
          }}
          name="caret-back"
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
        <Text style={{ marginTop: 20, color: '#6B6B6B' }}>
          Attach a clear and identifiable photo for smooth verification
        </Text>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleSubmit} // Trigger the modal visibility
        >
          <Text style={styles.buttonText}>Submit Invite</Text>
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
          <View style={styles.modalContainer}>
            <View
              style={{
                backgroundColor: 'white',
                alignItems: 'center',
                padding: 30,
                borderRadius: 63,
                elevation: 5, // For Android shadow
                shadowColor: '#000', // Shadow color (for iOS)
                shadowOffset: { width: 0, height: 0 }, // Shadow offset (horizontal, vertical)
                shadowOpacity: 0.2, // Shadow opacity
                shadowRadius: 40, // Shadow blur radius
                height: '70%',
              }}
            >
              <Image
                source={require('../../../../assets/glass.png')} // Use your image here
                style={styles.modalImage}
              />
              <Text style={styles.modalText}>Thank you, Riya</Text>
              <Text style={styles.modalSubText}>
                We’ve received your application and will get back to you as soon
                as we can.
              </Text>
              <Text style={styles.modalEmailText}>
                We’ve sent a verification email to riya2@gmail.com. Please check
                your email and click the link to verify.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '80%',
              padding: 20,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              marginBottom: 5,
            }}
            onPress={() => {
              navigation.reset({ index: 0, routes: [{ name: 'Initial' }] });
              setModalVisible(false); // Navigate to the main screen
            }}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
              <View
                style={{
                  backgroundColor: '#EDEDED',
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                <FontAwesome size={20} name="user-o" color={'black'} />
              </View>
              <Text style={styles.buttonText1}>My Information</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={'black'} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '80%',
              padding: 20,
              borderBottomRightRadius: 20,
              borderBottomLeftRadius: 20,
              marginBottom: 5,
            }}
            onPress={() => {
             navigation.reset({ index: 0, routes: [{ name: 'Track' }] })
              setModalVisible(false); // Navigate to the main screen
            }}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
              <View
                style={{
                  backgroundColor: '#EDEDED',
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                <FontAwesome size={20} name="user-o" color={'black'} />
              </View>
              <Text style={styles.buttonText1}>My Information</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={'black'} />
          </TouchableOpacity>
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
    fontSize: 22,
    fontWeight: '400',
    marginBottom: 8,
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
    marginTop: 10,
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
    backgroundColor: '#FBF4FD',
  },
  modalContainer: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  modalImage: {
    width: '100%',
    height: 90,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  modalText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  modalSubText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 40,
    textAlign: 'center',
  },
  modalEmailText: {
    color: '#6B6B6B',
    textAlign: 'center',
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
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UploadPicRegisgter;
