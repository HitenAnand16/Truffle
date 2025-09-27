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
        if (response.didCancel) {
          console.log('User canceled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          setImage(response.assets![0].uri);
        }
      },
    );
  };

  const handleSubmit = () => {
    setModalVisible(true); // Show the modal after submit
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
                borderRadius: 35,
                elevation: 5, // For Android shadow
                shadowColor: '#000', // Shadow color (for iOS)
                shadowOffset: { width: 0, height: 2 }, // Shadow offset (horizontal, vertical)
                shadowOpacity: 0.1, // Shadow opacity
                shadowRadius: 10, // Shadow blur radius
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
            style={styles.button}
            onPress={() => {
              navigation.navigate('Initial');
              setModalVisible(false) // Navigate to the main screen
            }}
          >
            <Text style={styles.buttonText1}>Go Back to Main Screen</Text>
          </TouchableOpacity>

          {/* Track your application button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('Track');
              setModalVisible(false) // Navigate to the track application screen
            }}
          >
            <Text style={styles.buttonText1}>Track Your Application</Text>
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
    fontSize: 16,
    fontWeight: '500',
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
    // height: '100%',
    justifyContent: 'center',
  },
  modalImage: {
    width: '100%',
    height: 90,
    resizeMode: 'contain',
    marginBottom: 20,
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
    marginBottom: 10,
    textAlign: 'center',
  },
  modalEmailText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UploadPicRegisgter;
