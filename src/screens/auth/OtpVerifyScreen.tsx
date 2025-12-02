import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_VERIFY = 'https://truffle-0ol8.onrender.com/api/verify/login';

const OtpVerifyScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { phone, otpId } = route.params || { phone: '', otpId: '' };

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp || otp.trim().length === 0) {
      Alert.alert('Invalid OTP', 'Please enter the OTP you received.');
      return;
    }

    setLoading(true);
    try {
      const payload = { phone, otp, otpId };
      const resp = await axios.post(API_VERIFY, payload, { headers: { 'Content-Type': 'application/json' } });

      // Expecting backend to return a success indicator
      // Example user provided earlier: { status: true, data: { otpId: '...' }, message: '...' }
      if (resp?.data?.status) {
        // Persist token and user for subsequent API calls
        const token = resp?.data?.token;
        const user = resp?.data?.user;
        if (token) await AsyncStorage.setItem('auth_token', token);
        if (user) await AsyncStorage.setItem('auth_user', JSON.stringify(user));

        // After OTP, take user to preferences questions first
        navigation.navigate('PreferencesQuestions' as never);
        console.log('OTP verified successfully', resp.data);
      } else {
        const msg = resp?.data?.message || 'OTP verification failed';
        Alert.alert('Error', msg);
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error?.response || error);
      const message = error?.response?.data?.message || 'Network error. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>We sent an OTP to {phone}</Text>

      <TextInput
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify OTP</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: '#2b8a3e', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
});

export default OtpVerifyScreen;
