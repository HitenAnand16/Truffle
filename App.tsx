import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={Platform.OS === 'android'} 
      />
      <AppNavigator />
    </GestureHandlerRootView>
  );
};

export default App;