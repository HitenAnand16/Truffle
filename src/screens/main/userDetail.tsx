import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const UserDetails = ({ route, navigation }) => {
  const { user } = route.params; // Get user data passed via navigation
  return (
    <ImageBackground
      source={{ uri: user.profilePicture }}
      style={{ height: '100%', justifyContent: 'center' }}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          width: 50,
          height: 50,
          position: 'absolute',
          top: 70,
          left: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons
          name="chevron-back"
          size={30}
          color={'white'}
        />
      </TouchableOpacity>
      <View style={styles.card}>
        <Image
          source={{ uri: user.profilePicture }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={styles.text}>Age: {user.age}</Text>
        <Text style={styles.text}>About: {user.about}</Text>
        <Text style={styles.text}>
          Location: {user.location.city}, {user.location.country}
        </Text>
        <Text style={styles.text}>Interests: {user.interests.join(', ')}</Text>
        <Text style={styles.text}>Strengths: {user.strengths.join(', ')}</Text>
        <Text style={styles.text}>
          What I'm Looking For: {user.whatAmILookingFor.relationshipType}
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  card: {
    width: width - 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    alignSelf: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginVertical: 5,
  },
});

export default UserDetails;
