import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const API_LOGIN = 'https://truffle-0ol8.onrender.com/api/login';

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const normalizePhone = (input: string) => {
    const trimmed = input.trim();
    if (trimmed.startsWith('+')) return trimmed;
    // If user entered 10 digit number, assume India +91
    const digits = trimmed.replace(/\D/g, '');
    if (digits.length === 10) return `+91${digits}`;
    return trimmed;
  };

  const handleSendOtp = async () => {
    const phoneValue = normalizePhone(phone);

    if (!phoneValue || phoneValue.replace(/\D/g, '').length < 10) {
      Alert.alert('Invalid phone', 'Please enter a valid phone number.');
      return;
    }

    setLoading(true);
    try {
      const payload = { phone: phoneValue };
      const resp = await axios.post(API_LOGIN, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Example response shape provided by backend:
      // { status: true, data: { otpId: '...' }, message: 'OTP sent to phone.' }
      if (resp?.data?.status && resp.data.data?.otpId) {
        const otpId = resp.data.data.otpId;
        navigation.navigate('OtpVerify' as never, { phone: phoneValue, otpId } as never);
      } else {
        const msg = resp?.data?.message || 'Failed to send OTP';
        Alert.alert('Error', msg);
      }
    } catch (error: any) {
      console.error('Send OTP error:', error?.response || error);
      const message = error?.response?.data?.message || 'Network error. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login with Phone</Text>

      <TextInput
        placeholder="Phone number (e.g. +919876543210 or 9876543210)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        autoComplete="tel"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send OTP</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2b8a3e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});

export default LoginScreen;
