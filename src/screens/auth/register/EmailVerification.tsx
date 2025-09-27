import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const EmailVerificationScreen = ({ navigation, route }) => {
  const { name, age, gender } = route.params;
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpId, setOtpId] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [phone, setPhone] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPhoneVerifying, setIsPhoneVerifying] = useState(false);
  const [isPhoneOtpSent, setIsPhoneOtpSent] = useState(false);


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Handle email OTP submission
  const handleEmailSubmit = async () => {
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email');
      return;
    }
    setIsOtpSent(true);
    setModalVisible(true);
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
    }, 3000);

    try {
      const response = await axios.post(
        'https://truffle-0ol8.onrender.com/api/invite/send/email/OTP',
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log(response.data);
      setOtpId(response.data.otpId);
      // Assume OTP is sent successfully, now ask for OTP input
    } catch (error) {
      console.error('Error sending email OTP:', error);
    }
  };

  // Handle phone OTP submission
  const handlePhoneSubmit = async () => {
    if (!/^\d{10}$/.test(phone)) {
      alert('Please enter a valid phone number');
      return;
    }
    setIsPhoneOtpSent(true);
    setModalVisible(true);
    setIsPhoneVerifying(true);
    setTimeout(() => {
      setIsPhoneVerifying(false);
    }, 3000);

    try {
      const response = await axios.post(
        'https://truffle-0ol8.onrender.com/api/invite/send/phone/OTP',
        { phone },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log(response.data);
      // Assume OTP is sent successfully for phone
    } catch (error) {
      console.error('Error sending phone OTP:', error);
    }
  };

  // Handle OTP verification for both email and phone
  const handleOtpSubmit = async type => {
    // if (type === 'email' && otp === '123456') {
    //   // Replace with actual OTP verification logic
    //   setIsEmailVerified(true);
    //   setOtp('');
    //   setIsVerifying(false);
    //   setModalVisible(false);
    //   if (!isPhoneVerified) {
    //     return;
    //   }
    //   navigation.navigate('NextScreen');
    // } else if (type === 'phone' && otp === '654321') {
    //   // Replace with actual OTP verification logic
    //   setIsPhoneVerified(true);
    //   setOtp('');
    //   setIsPhoneVerifying(false);
    //   setModalVisible(false);
    //   if (isEmailVerified) {
    //     navigation.navigate('NextScreen');
    //   }
    // } else {
    //   alert('Invalid OTP');
    // }

    try {
      const otpPayload = { otp, otpId };
      if (type === 'email') {
        const emailVerifyResponse = await axios.post(
          'https://truffle-0ol8.onrender.com/api/invite/verify/email/OTP',
          otpPayload,
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
        console.log(
          'Email OTP verification response:',
          emailVerifyResponse.data,
        );
      } else if (type === 'phone') {
        const phoneVerifyResponse = await axios.post(
          'https://truffle-0ol8.onrender.com/api/invite/verify/phone/OTP',
          otpPayload,
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
        console.log(
          'Phone OTP verification response:',
          phoneVerifyResponse.data,
        );
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Failed to verify OTP');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          onPress={() => navigation.goBack()}
          name="chevron-back"
          size={30}
          color="black"
          style={{ marginLeft: 10 }}
        />
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={styles.title}>Request Your Invite</Text>
        <View style={styles.card}>
          <>
            <Text style={styles.label}>
              Email<Text style={styles.required}> *</Text>
            </Text>
            {!isEmailVerified ? (
              <View>
                <TextInput
                  style={styles.textInput}
                  placeholder="example@gmail.com"
                  value={email}
                  onChangeText={setEmail}
                />
                {isOtpSent && !isEmailVerified ? (
                  <TouchableOpacity
                    style={[styles.btn, styles.filled]}
                    onPress={handleEmailSubmit}
                  >
                    <Text style={styles.filledText}>Verifying...</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.btn, styles.filled]}
                    onPress={handleEmailSubmit}
                  >
                    <Text style={styles.filledText}>Send OTP</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={styles.row}>
                <TextInput
                  placeholder="example@gmail.com"
                  value={email}
                  onChangeText={setEmail}
                  editable={false}
                />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </>

          {isEmailVerified && (
            <Text style={styles.label}>
              Phone Number<Text style={styles.required}> *</Text>
            </Text>
          )}

          {isEmailVerified && !isPhoneVerified && (
            <>
              <TextInput
                style={styles.textInput}
                placeholder="Enter phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="numeric"
              />
              {isPhoneOtpSent && !isPhoneVerified ? (
                <TouchableOpacity
                  style={[styles.btn, styles.filled]}
                  onPress={handlePhoneSubmit}
                >
                  <Text style={styles.filledText}>Verifying...</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.btn, styles.filled]}
                  onPress={handlePhoneSubmit}
                >
                  <Text style={styles.filledText}>Send OTP</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {isPhoneVerified && (
            <View style={styles.row}>
              <TextInput
                placeholder="Enter phone number"
                value={phone}
                onChangeText={setPhone}
                editable={false}
              />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>
      </View>

      {isEmailVerified && isPhoneVerified && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.btn, styles.filled]}
            onPress={() => navigation.navigate('Detail')}
          >
            <Text style={styles.filledText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {isPhoneOtpSent
                ? 'Enter the OTP sent to your phone'
                : 'Enter the OTP sent to your email'}
            </Text>

            <Text style={styles.modalInstruction}>
              Please check your {isPhoneOtpSent ? 'phone' : 'email'} for the
              OTP. Enter the code below to verify your{' '}
              {isPhoneOtpSent ? 'phone' : 'email'}.
            </Text>

            <TextInput
              style={styles.textInput}
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              maxLength={6}
            />

            <TouchableOpacity
              style={[styles.btn, styles.filled]}
              onPress={() => {
                if (isPhoneOtpSent) {
                  handleOtpSubmit('phone');
                } else {
                  handleOtpSubmit('email');
                }
              }}
              disabled={isVerifying || isPhoneVerifying}
            >
              <Text style={styles.filledText}>
                {isVerifying || isPhoneVerifying
                  ? 'Please Wait...'
                  : 'Verify OTP'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
    color: '#333',
    marginTop: 40,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
    elevation: 3,
    width: '100%',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    width: '100%',
    marginBottom: 15,
  },
  btn: {
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginHorizontal: 5,
    paddingHorizontal: 70,
  },
  filled: { backgroundColor: '#4F0D50' },
  filledText: { color: '#fff', fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 30,
    width: '100%',
    height: '40%',
    bottom: 0,
    position: 'absolute',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  verifyingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ff9800',
    fontWeight: '500',
  },
  verifiedText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Aligns the textInput and "Verified" label
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  required: {
    color: 'red',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: '#333',
    textAlign: 'center',
  },
  modalInstruction: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
    textAlign: 'center',
  },
  cancelText: {
    color: '#333',
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default EmailVerificationScreen;
