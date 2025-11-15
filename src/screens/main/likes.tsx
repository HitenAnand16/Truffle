import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { demoUsers } from '../../../demoUsers';

const { width } = Dimensions.get('window');

const Likes = ({ navigation }) => {
  const likers = demoUsers; // replace with real API data when available
  const [selectedIndex, setSelectedIndex] = useState(likers.length ? 0 : -1);
  

  if (!likers || likers.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Likes</Text>
        </View>

        <View style={styles.emptyState}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
            }}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyTitle}>No likes yet</Text>
          <Text style={styles.emptySubtitle}>
            Keep swiping, someone special's close!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const selected = likers[selectedIndex] ?? likers[0];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Likes</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.avatarsWrap}>
        <FlatList
          horizontal
          data={likers}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.avatarsList}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => setSelectedIndex(index)}
              style={[
                styles.avatarTouch,
                selectedIndex === index && styles.avatarTouchSelected,
              ]}
            >
              <Image
                source={{ uri: item.profilePicture }}
                style={[
                  styles.avatar,
                  selectedIndex === index && styles.avatarSelected,
                ]}
              />
              {selectedIndex !== index && (
                <Text style={styles.avatarName} numberOfLines={1}>
                  {item.firstName}
                </Text>
              )}
            </TouchableOpacity>
          )}
        />
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('userDetail', { user: selected })}
        style={styles.cardWrap}
      >
        <View style={styles.profileCard}>
          <Image
            source={{ uri: selected.profilePicture }}
            style={styles.profileImage}
          />
          <View style={styles.cardTextWrap}>
            <Text
              style={styles.nameText}
            >{`${selected.firstName}, ${selected.age}`}</Text>
            <Text style={styles.locationText}>
              {selected.location?.city ?? ''}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 20,
  },
  backArrow: { fontSize: 28, color: '#333', width: 32 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#111' },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyImage: {
    width: width * 0.7,
    height: width * 0.5,
    marginBottom: 24,
    borderRadius: 12,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    maxWidth: 300,
  },
  avatarsWrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  avatarsList: { paddingHorizontal: 20, alignItems: 'center' },
  avatarTouch: { width: 72, alignItems: 'center' },
  avatarTouchSelected: {
    width: 88,
    alignItems: 'center',
    marginHorizontal: 15,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#ddd',
  },
  avatarSelected: {
    width: 80,
    height: 80,
    backgroundColor: '#fff', // required for shadow
    borderRadius: 40, // optional, if you want a circle
    // iOS shadow
    shadowColor: '#ff0000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    // Android shadow
    elevation: 6,
  },
  avatarName: { marginTop: 6, fontSize: 12, maxWidth: 70, textAlign: 'center' },
  cardWrap: { padding: 16 },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 43,
    overflow: 'hidden',
    width: width - 32,
    alignSelf: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginTop: 12,
    height: '83%',
  },
  profileImage: { width: '100%', height: '100%' },
  cardTextWrap: { position: 'absolute', left: 16, bottom: 16 },
  nameText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  locationText: { color: '#fff', fontSize: 12, marginTop: 4 },
});

export default Likes;
