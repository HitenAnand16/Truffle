import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import InitialScreen from '../screens/auth/InitialScreen';
import RegisterScreen from '../screens/auth/register/RegisterScreen';
import TrackScreen from '../screens/auth/TrackScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OtpVerifyScreen from '../screens/auth/OtpVerifyScreen';
import EmailVerificationScreen from '../screens/auth/register/EmailVerification';
import Detail from '../screens/auth/register/Detail';
import UploadPicRegisgter from '../screens/auth/register/UploadPicRegisgter';
import PreferencesQuestionScreen from '../screens/auth/PreferencesQuestionScreen';
import PreferencesSummaryScreen from '../screens/auth/PreferencesSummaryScreen';
import LetsUnmaskYouScreen from '../screens/auth/LetsUnmaskYouScreen';
import UserDetails from '../screens/main/userDetail';
import BottomTabNavigator from './BottomTabNavigator';
import { UserActionsProvider } from '../context/UserActionsContext';
import { RegistrationProvider } from '../context/RegistrationContext';

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
  OtpVerify: { phone: string; otpId: string };
  PreferencesQuestions: undefined;
  PreferencesSummary: { answers: Record<string, string | string[]>; questions: any[] } | undefined;
  LetsUnmaskYou: undefined;
  Detail: undefined;
  UploadPicRegister: undefined;
  userDetail: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <UserActionsProvider>
      <RegistrationProvider>
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
          <Stack.Screen name="OtpVerify" component={OtpVerifyScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="PreferencesQuestions" component={PreferencesQuestionScreen} />
          <Stack.Screen name="PreferencesSummary" component={PreferencesSummaryScreen} />
          <Stack.Screen name="LetsUnmaskYou" component={LetsUnmaskYouScreen} />

          {/* After login, the main flow with Bottom Tab Bar */}
          <Stack.Screen name="Main" component={BottomTabNavigator} />
          <Stack.Screen name="userDetail" component={UserDetails}/>
        </Stack.Navigator>
      </NavigationContainer>
      </RegistrationProvider>
    </UserActionsProvider>
  );
};

export default AppNavigator;
