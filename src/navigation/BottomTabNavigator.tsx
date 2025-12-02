import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { OptimizedImage } from '../components/OptimizedImage';

// Import screens
import Home from '../screens/main/home';
import UserProfileScreen from '../screens/main/user';
import Likes from '../screens/main/likes';
import Chat from '../screens/main/chat';
import Settings from '../screens/main/settings';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarShowLabel: false, // Hide labels for cleaner look
        tabBarActiveTintColor: '#4F0D50', // Active tab color
        tabBarInactiveTintColor: '#999999', // Inactive tab color
        tabBarIcon: ({ focused, size }: { focused: boolean; size: number }) => {
          let icon;
          const iconSize = focused ? 30 : 25;

          if (route.name === 'Home') {
            // Use custom logo image for Home tab
            icon = (
              <OptimizedImage
                source={require('../../assets/logo.png')}
                style={{
                  resizeMode: 'contain',
                  width: focused ? 50 : 40,
                  height: focused ? 25 : 20,
                  tintColor: undefined,
                }}
              />
            );
          } else if (route.name === 'User') {
            // User profile tab
            icon = (
              <FontAwesome
                name={focused ? 'user' : 'user-o'}
                size={focused ? 28 : 20}
                color={focused ? '#4F0D50' : '#999999'}
              />
            );
          } else if (route.name === 'Like') {
            // Likes tab
            icon = (
              <Ionicons
                name={focused ? 'heart' : 'heart-outline'}
                size={iconSize}
                color={focused ? '#4F0D50' : '#999999'}
              />
            );
          } else if (route.name === 'Chat') {
            // Chat tab
            icon = (
              <Ionicons
                name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
                size={iconSize}
                color={focused ? '#4F0D50' : '#999999'}
              />
            );
          } else if (route.name === 'Setting') {
            // Settings tab
            icon = (
              <Ionicons
                name={focused ? 'settings' : 'settings-outline'}
                size={iconSize}
                color={focused ? '#4F0D50' : '#999999'}
              />
            );
          }

          return icon;
        },
        tabBarStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)', // Semi-transparent white
          borderRadius: 100,
          elevation: 8, // Android shadow
          shadowColor: '#000', // iOS shadow
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          height: 70,
          paddingTop: 15,
          marginBottom: 30,
          marginHorizontal: '7.5%',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderWidth: 1,
          borderColor: 'rgba(0, 0, 0, 0.05)', // Subtle border
        },
      })}
    >
      {/* Tab Screens */}
      <Tab.Screen
        name="User"
        component={UserProfileScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Like"
        component={Likes}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Setting"
        component={Settings}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
