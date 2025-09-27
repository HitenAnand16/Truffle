import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Main' as never);
      }}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <Text>LoginScreen</Text>
    </TouchableOpacity>
  );
};

export default LoginScreen;
