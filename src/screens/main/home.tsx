import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import {
  OptimizedImage,
  OptimizedImageBackground,
} from '../../components/OptimizedImage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useUserActions } from '../../context/UserActionsContext';

const { width } = Dimensions.get('window'); // Get screen width for responsive design

const Home = ({ navigation }: any) => {
  const { addLikedUser, addDislikedUser, isUserActioned, removeLikedUser, removeDislikedUser } = useUserActions();
  const [profiles, setProfiles] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<null | { userId: string; action: 'like' | 'dislike' }>(null);
  const [undoneUserId, setUndoneUserId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current card
  const [isModalVisible, setIsModalVisible] = useState(false); // Track modal visibility
  const [actionMessage, setActionMessage] = useState(''); // Message in the modal

  // Fetch profiles from API
  React.useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('https://truffle-0ol8.onrender.com/api/profiles', {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTA5ZDlhMGVlYmUwZDMwZGE2MDgyZGYiLCJpYXQiOjE3NjQ0OTM0NjAsImV4cCI6MTc2NTA5ODI2MH0.wK3YkmBYJceWJXQi8lZ50hJY6Xnuu6f8Y6FXvrBSz9I',
            Accept: 'application/json',
          },
        });
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }
        const data = await res.json();
        // Normalize API fields to match UI usage
        const normalized = (Array.isArray(data) ? data : []).map((p: any) => ({
          id: p._id,
          firstName: p.name,
          lastName: '',
          age: p.age,
          profilePicture: p.picture,
          location: {
            city: p?.occupation || 'Unknown',
            coordinates: p?.location?.coordinates || [0, 0],
          },
          description: p.description,
        }));
        console.log('profiles', normalized);
        setProfiles(normalized);
      } catch (e: any) {
        setError(e?.message || 'Failed to load profiles');
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  // Filter out users that have been liked or disliked
  const availableUsers = useMemo(() => {
    return profiles.filter(user => !isUserActioned(user.id));
  }, [isUserActioned, profiles]);

  const handleLike = useCallback(() => {
    if (currentIndex < availableUsers.length) {
      const currentUser = availableUsers[currentIndex];
      // record last action so it can be undone once
      setLastAction({ userId: currentUser.id, action: 'like' });
      addLikedUser(currentUser.id);
      setActionMessage('Liked!'); // Set message for like
      setIsModalVisible(true); // Show popup
      setTimeout(() => {
        setIsModalVisible(false); // Hide popup after 2 seconds
        // Don't increment index, let the filter handle showing next user
        if (currentIndex >= availableUsers.length - 1) {
          setCurrentIndex(0); // Reset to first available user
        }
      }, 2000);
    }
  }, [currentIndex, availableUsers, addLikedUser]);

  const handleDislike = useCallback(() => {
    if (currentIndex < availableUsers.length) {
      const currentUser = availableUsers[currentIndex];
      // record last action so it can be undone once
      setLastAction({ userId: currentUser.id, action: 'dislike' });
      addDislikedUser(currentUser.id);
      setActionMessage('Disliked!'); // Set message for dislike
      setIsModalVisible(true); // Show popup
      setTimeout(() => {
        setIsModalVisible(false); // Hide popup after 2 seconds
        // Don't increment index, let the filter handle showing next user
        if (currentIndex >= availableUsers.length - 1) {
          setCurrentIndex(0); // Reset to first available user
        }
      }, 2000);
    }
  }, [currentIndex, availableUsers, addDislikedUser]);

  const handleUndo = useCallback(() => {
    if (!lastAction) return;
    const { userId, action } = lastAction;
    if (action === 'like') {
      removeLikedUser(userId);
    } else {
      removeDislikedUser(userId);
    }
    // mark undone user so when availableUsers updates we can set the index
    setUndoneUserId(userId);
    setLastAction(null); // allow only one undo
  }, [lastAction, removeLikedUser, removeDislikedUser]);

  // When availableUsers updates after undo, move the deck to the undone user if present
  React.useEffect(() => {
    if (!undoneUserId) return;
    const idx = availableUsers.findIndex(u => u.id === undoneUserId);
    if (idx !== -1) {
      setCurrentIndex(idx);
    }
    setUndoneUserId(null);
  }, [availableUsers, undoneUserId]);

  const handleCardClick = useCallback(
    (user: any) => {
      // Navigate to UserDetails screen and pass user data as params
      navigation.navigate('userDetail', { user });
    },
    [navigation],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom:20
        }}
      >
        <OptimizedImage
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
          <TouchableOpacity onPress={() => { if (lastAction) { handleUndo(); } else { navigation.goBack?.(); } }}>
            <Image
              style={{
                width: 24,
                height: 24,
                resizeMode: 'contain',
              }}
              source={require('../../../assets/home/back.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              style={{
                width: 24,
                height: 24,
                resizeMode: 'contain',
              }}
              source={require('../../../assets/home/filter.png')}
            />
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
      
      <View style={styles.cardStack}>
        {(() => {
          if (loading) {
            return (
              <View style={styles.noUsersContainer}>
                <Text style={styles.noUsersText}>Loading profiles…</Text>
              </View>
            );
          }

          if (error) {
            return (
              <View style={styles.noUsersContainer}>
                <Text style={styles.noUsersText}>Error: {error}</Text>
              </View>
            );
          }

          // Show message if no available users
          if (availableUsers.length === 0) {
            return (
              <View style={styles.noUsersContainer}>
                <Text style={styles.noUsersText}>No more users to show!</Text>
              </View>
            );
          }

          const frontCard =
            availableUsers[currentIndex % availableUsers.length];
          const nextCard =
            availableUsers[(currentIndex + 1) % availableUsers.length]; // wrap-around next card

          return (
            <>
              {/* Back / Upcoming Card (slightly visible) */}
              {nextCard && availableUsers.length > 1 && (
                <OptimizedImageBackground
                  source={{ uri: nextCard.profilePicture }}
                  style={[
                    styles.card,
                    {
                      width: width - 70, // Slightly smaller to show as a background card
                      zIndex: 1, // Behind the front card
                      transform: [{ translateY: -10 }], // Adjusted positioning for slight visibility
                    },
                  ]}
                  imageStyle={styles.image}
                >
                  <LinearGradient
                    colors={['transparent', 'black']}
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                      borderRadius: 20,
                    }}
                  >
                    <Text
                      style={[styles.name, { marginBottom: 20, opacity: 0.6 }]}
                    >
                      {nextCard.firstName} {nextCard.lastName}
                    </Text>
                  </LinearGradient>
                </OptimizedImageBackground>
              )}

              {/* Front / Active Card (fully visible) */}
              {frontCard && (
                <OptimizedImageBackground
                  source={{ uri: frontCard.profilePicture }}
                  style={[
                    styles.card,
                    { width: width - 40, zIndex: 2 }, // Full width, in front
                  ]}
                  imageStyle={styles.image}
                >
                  <TouchableOpacity
                    onPress={() => handleCardClick(frontCard)}
                    style={styles.cardContent}
                  >
                    <LinearGradient
                      colors={['transparent', '#00000082']}
                      style={{ width: '100%' }}
                    >
                      <TouchableOpacity
                        style={{
                          width: '100%',
                          padding: 20,
                          alignItems: 'flex-start',
                          marginTop: 40,
                          marginBottom: 40,
                        }}
                        onPress={() => handleCardClick(frontCard)}
                      >
                        <Text style={styles.name}>
                          {frontCard.firstName} {frontCard.age}
                        </Text>
                        <Text style={styles.text}>
                          {frontCard.location.city}
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>

                    <View
                      style={{ position: 'absolute', right: 15, bottom: 50 }}
                    >
                      <TouchableOpacity
                        onPress={handleLike}
                        style={styles.actionButton}
                      >
                        <Ionicons
                          name="heart-outline"
                          size={30}
                          color={'black'}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={handleDislike}
                        style={[styles.actionButton, { marginTop: 20 }]}
                      >
                        <Ionicons name="close" size={30} color={'black'} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </OptimizedImageBackground>
              )}
            </>
          );
        })()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  cardStack: {
    position: 'relative',
    width: width - 40,
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10, // For Android shadow
    shadowColor: '#343434ff',
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 43,
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
    fontSize: 16,
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
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  actionButton: {
    width: 60,
    height: 60,
    // borderWidth: 2,
    borderRadius: 100,
    // borderColor: '#ffffff8d',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff3c',
  },
  noUsersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noUsersText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default Home;
