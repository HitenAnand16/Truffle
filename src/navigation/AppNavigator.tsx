import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import InitialScreen from '../screens/auth/InitialScreen';
import RegisterScreen from '../screens/auth/register/RegisterScreen';
import TrackScreen from '../screens/auth/TrackScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import EmailVerificationScreen from '../screens/auth/register/EmailVerification';
import Detail from '../screens/auth/register/Detail';
import UploadPicRegisgter from '../screens/auth/register/UploadPicRegisgter';
import UserDetails from '../screens/main/userDetail';
import BottomTabNavigator from './BottomTabNavigator';

export type RootStackParamList = {
  Initial: undefined;
  Register: undefined;
  Track: undefined;
  Login: undefined;
  Main: undefined; // This will be the main app flow after login
  EmailVerification: { 
    email: string; 
    name: string; 
    userId?: string; 
  };
  Detail: undefined;
  UploadPicRegister: undefined;
  userDetail: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

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
        <Stack.Screen name="Main" component={BottomTabNavigator} />
        <Stack.Screen name="userDetail" component={UserDetails}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
