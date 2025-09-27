import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Image } from 'react-native'; // Import Image for custom tab icon
import InitialScreen from '../screens/auth/InitialScreen';
import RegisterScreen from '../screens/auth/register/RegisterScreen';
import TrackScreen from '../screens/auth/TrackScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import EmailVerificationScreen from '../screens/auth/register/EmailVerification';
import Detail from '../screens/auth/register/Detail';
import UploadPicRegisgter from '../screens/auth/register/UploadPicRegisgter';
import Home from '../screens/main/home';
import userDetail from '../screens/main/userDetail';
import user from '../screens/main/user';
import likes from '../screens/main/likes';
import chat from '../screens/main/chat';
import settings from '../screens/main/settings';

export type RootStackParamList = {
  Initial: undefined;
  Register: undefined;
  Track: undefined;
  Login: undefined;
  Main: undefined; // This will be the main app flow after login
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Initial"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        {/* Authentication flow */}
        <Stack.Screen name="Initial" component={InitialScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="EmailVerification"
          component={EmailVerificationScreen}
        />
        <Stack.Screen name="Detail" component={Detail} />
        <Stack.Screen name="UploadPicRegister" component={UploadPicRegisgter} />
        <Stack.Screen name="Track" component={TrackScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* After login, the main flow with Bottom Tab Bar */}
        <Stack.Screen name="Main" component={BottomTabs} />
        <Stack.Screen name="userDetail" component={userDetail}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarShowLabel: false, // Show label if you want it visible
        tabBarActiveTintColor: '#4F0D50', // Active label color
        tabBarInactiveTintColor: '#999999', // Inactive label color
        tabBarIcon: ({ focused, size }: { focused: boolean; size: number }) => {
          let icon;
          const iconSize = focused ? 30 : 25;
          if (route.name === 'Home') {
            // Use an image as the tab icon for Home
            icon = (
              <Image
                source={require('../../assets/logo.png')} // Update the path to your image
                style={{
                  resizeMode: 'cover',
                  width: focused ? 50 : 40, // Optionally change the size when focused
                  height: focused ? 25 : 20,
                  tintColor: undefined,
                }}
              />
            );
          } else if (route.name === 'User') {
            // Use Ionicons for the User tab
            icon = (
              <FontAwesome
                name={focused ? 'user' : 'user-o'}
                size={focused ? 28:20}
                color={focused ? '#4F0D50' : '#999999'}
              />
            );
          } else if (route.name === 'Like') {
            // Use Ionicons for the Like tab
            icon = (
              <Ionicons
                name={focused ? 'heart' : 'heart-outline'}
                size={iconSize}
                color={focused ? '#4F0D50' : '#999999'}
              />
            );
          } else if (route.name === 'Chat') {
            // Use Ionicons for the Chat tab
            icon = (
              <Ionicons
                name={focused ? 'chatbox-ellipses' : 'chatbox-outline'}
                size={iconSize}
                color={focused ? '#4F0D50' : '#999999'}
              />
            );
          } else if (route.name === 'Setting') {
            // Use Ionicons for the Setting tab
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
          backgroundColor: '#fff', // Set background color of the tab bar
          borderRadius: 100,
          elevation: 5, // Shadow effect for Android
          shadowColor: '#000', // Shadow color for iOS
          shadowOffset: { width: 0, height: 5 }, // Shadow direction
          shadowOpacity: 0.1, // Shadow opacity
          shadowRadius: 10, // Shadow radius
          width: '85%',
          marginBottom: 20,
          height: 60,
          alignSelf: 'center',
          paddingTop: 10,
        },
      })}
    >
      <Tab.Screen
        name="User"
        component={user}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Like"
        component={likes}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Chat"
        component={chat}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Setting"
        component={settings}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
