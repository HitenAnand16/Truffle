import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import { demoData } from '../../../demoData'; // Importing demo data
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window'); // Get screen width for responsive design

const Home = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current card
  const [isModalVisible, setIsModalVisible] = useState(false); // Track modal visibility
  const [actionMessage, setActionMessage] = useState(''); // Message in the modal

  const handleLike = () => {
    setActionMessage('Liked!'); // Set message for like
    setIsModalVisible(true); // Show popup
    setTimeout(() => {
      setIsModalVisible(false); // Hide popup after 2 seconds
      setCurrentIndex(prevIndex => (prevIndex + 1) % demoData.length); // Move to the next card
    }, 2000);
  };

  const handleDislike = () => {
    setActionMessage('Disliked!'); // Set message for dislike
    setIsModalVisible(true); // Show popup
    setTimeout(() => {
      setIsModalVisible(false); // Hide popup after 2 seconds
      setCurrentIndex(prevIndex => (prevIndex + 1) % demoData.length); // Move to the next card
    }, 2000);
  };

  const handleCardClick = user => {
    // Navigate to UserDetails screen and pass user data as params
    navigation.navigate('userDetail', { user });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logo}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 30,
          }}
        >
          <TouchableOpacity>
            <Ionicons name={'return-up-back'} size={30} color={'gray'} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name={'filter'} size={30} color={'gray'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Full Screen Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{actionMessage}</Text>
          </View>
        </View>
      </Modal>

      {/* Card Stack */}
      <View style={styles.cardStack}>
        {demoData.map((user, index) => {
          const isFront = index === currentIndex;
          const cardStyle = {
            ...styles.card,
            zIndex: isFront ? 2 : 1,
            width: isFront ? width - 40 : width - 70,
            transform: isFront ? [{ translateY: 10 }] : [{ translateY: 0 }],
          };

          return (
            <ImageBackground
              key={index}
              source={{ uri: user.profilePicture }}
              style={cardStyle}
              imageStyle={styles.image}
            >
              <View style={styles.cardContent}>
                <LinearGradient
                  colors={['transparent', 'black']}
                  style={{ width: '100%' }}
                >
                  <TouchableOpacity
                    style={{
                      width: '100%',
                      padding: 20,
                      alignItems: 'flex-start',
                      marginTop: 40,
                    }}
                    onPress={() => handleCardClick(user)}
                  >
                    <Text style={styles.name}>
                      {user.firstName} {user.lastName}
                    </Text>
                    <Text style={styles.text}>Age: {user.age}</Text>
                  </TouchableOpacity>
                </LinearGradient>

                <View style={{ position: 'absolute', right: 15, bottom: 50 }}>
                  <TouchableOpacity
                    onPress={handleLike}
                    style={{
                      width: 50,
                      height: 50,
                      borderWidth: 2,
                      borderRadius: 100,
                      borderColor: 'white',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 20,
                    }}
                  >
                    <Ionicons name="heart" size={30} color={'white'} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleDislike}
                    style={{
                      width: 50,
                      height: 50,
                      borderWidth: 2,
                      borderRadius: 100,
                      borderColor: 'white',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FontAwesome name="close" size={30} color={'white'} />
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  cardStack: {
    position: 'relative',
    width: width - 40,
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10, // For Android shadow
    shadowColor: '#800080',
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
  },
  image: {
    borderRadius: 20,
    height: '100%',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  text: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 2,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width - 40,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    height:'100%',
    alignItems: 'center',
    justifyContent:"center"
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Home;
