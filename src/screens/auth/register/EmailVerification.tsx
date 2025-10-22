import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useRegistration } from '../../../context/RegistrationContext';

const EmailVerificationScreen = ({ navigation, route }: any) => {
  const { name, age, gender } = route.params;
  const { updateRegistrationData } = useRegistration();
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
      Alert.alert('Invalid Email', 'Please enter a valid email');
      return;
    }
    
    // Reset previous states
    setOtpId(null);
    setOtp('');
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
      console.log('Email OTP response:', response.data);
      console.log('Response status:', response.data.status);
      console.log('Response data object:', response.data.data);
      
      // Based on your API structure: {status: true, data: {otpId: "..."}, message: "..."}
      if (response.data && response.data.data && response.data.data.otpId) {
        const extractedOtpId = response.data.data.otpId;
        setOtpId(extractedOtpId);
        console.log('✅ Email OTP ID successfully set:', extractedOtpId);
      } else {
        console.log('❌ Email OTP ID not found in expected location');
        console.log('Full response:', JSON.stringify(response.data, null, 2));
        Alert.alert('Error', 'Failed to get OTP ID. Please try again.');
        setIsOtpSent(false);
        setModalVisible(false);
        setIsVerifying(false);
      }
    } catch (error) {
      console.error('Error sending email OTP:', error);
      Alert.alert('Error', 'Failed to send email OTP. Please try again.');
      setIsOtpSent(false);
      setModalVisible(false);
      setIsVerifying(false);
    }
  };

  // Handle phone OTP submission
  const handlePhoneSubmit = async () => {
    // More flexible phone validation (10 digits with optional +91 prefix)
    const phonePattern = /^(\+91|91)?[6-9]\d{9}$/;
    if (!phonePattern.test(phone.replace(/\s/g, ''))) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit Indian mobile number starting with 6-9');
      return;
    }
    
    // Reset previous states
    setOtpId(null);
    setOtp('');
    setIsPhoneOtpSent(true);
    setModalVisible(true);
    setIsPhoneVerifying(true);
    setTimeout(() => {
      setIsPhoneVerifying(false);
    }, 3000);

    // Format phone number to include +91 if not present
    let formattedPhone = phone.replace(/\s/g, ''); // Remove spaces
    if (!formattedPhone.startsWith('+91') && !formattedPhone.startsWith('91')) {
      formattedPhone = '+91' + formattedPhone;
    } else if (formattedPhone.startsWith('91') && !formattedPhone.startsWith('+91')) {
      formattedPhone = '+' + formattedPhone;
    }
    
    console.log('Sending phone OTP with formatted number:', formattedPhone);

    try {
      const response = await axios.post(
        'https://truffle-0ol8.onrender.com/api/invite/send/phone/OTP',
        { phone: formattedPhone },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('Phone OTP response:', response.data);
      console.log('Phone response status:', response.data.status);
      console.log('Phone response data object:', response.data.data);
      
      // Based on your API structure: {status: true, data: {otpId: "68f74db26cfc738dbbb780fd"}, message: "OTP sent to phone."}
      if (response.data && response.data.data && response.data.data.otpId) {
        const extractedOtpId = response.data.data.otpId;
        setOtpId(extractedOtpId);
        console.log('✅ Phone OTP ID successfully set:', extractedOtpId);
      } else {
        console.log('❌ Phone OTP ID not found in expected location');
        console.log('Full phone response:', JSON.stringify(response.data, null, 2));
        Alert.alert('Error', 'Failed to get phone OTP ID. Please try again.');
        setIsPhoneOtpSent(false);
        setModalVisible(false);
        setIsPhoneVerifying(false);
      }
    } catch (error: any) {
      console.error('Error sending phone OTP:', error);
      console.error('Phone OTP error response:', error.response?.data);
      console.error('Phone OTP error status:', error.response?.status);
      
      if (error.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Failed to send phone OTP. Please try again.');
      }
      
      // Reset states on error
      setIsPhoneOtpSent(false);
      setModalVisible(false);
      setIsPhoneVerifying(false);
    }
  };

  // Handle OTP verification for both email and phone
  const handleOtpSubmit = async (type: string) => {
    // Debug logging
    console.log('Attempting OTP verification:', { type, otp, otpId });
    
    // Validate required fields
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }
    
    if (!otpId) {
      Alert.alert('Error', 'OTP session expired. Please request a new OTP.');
      setModalVisible(false);
      if (type === 'email') {
        setIsOtpSent(false);
      } else {
        setIsPhoneOtpSent(false);
      }
      return;
    }
    
    try {
      // Ensure OTP is sent as string and otpId is properly formatted
      const otpPayload = { 
        otp: otp.toString().trim(), 
        otpId: String(otpId).trim() 
      };
      console.log('Sending OTP payload:', otpPayload);
      
      if (type === 'email') {
        const emailVerifyResponse = await axios.post(
          'https://truffle-0ol8.onrender.com/api/invite/verify/email/OTP',
          otpPayload,
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
        console.log('Email OTP verification response:', emailVerifyResponse.data);
        
        // Check if verification was successful
        if (emailVerifyResponse.data.success || emailVerifyResponse.status === 200) {
          setIsEmailVerified(true);
          setOtp('');
          setIsVerifying(false);
          setModalVisible(false);
          setIsOtpSent(false);
          Alert.alert('Success', 'Email verified successfully!');
        } else {
          Alert.alert('Error', 'Invalid OTP. Please try again.');
        }
        
      } else if (type === 'phone') {
        // For testing: Use default OTP "123456" for phone verification
        if (otp === '123456') {
          console.log('✅ Phone OTP verified with default test OTP');
          setIsPhoneVerified(true);
          setOtp('');
          setIsPhoneVerifying(false);
          setModalVisible(false);
          setIsPhoneOtpSent(false);
          Alert.alert('Success', 'Phone verified successfully! (Test Mode)');
        } else {
          // Still try API verification in case you want to test real OTP later
          try {
            const phoneVerifyResponse = await axios.post(
              'https://truffle-0ol8.onrender.com/api/invite/verify/phone/OTP',
              otpPayload,
              {
                headers: { 'Content-Type': 'application/json' },
              },
            );
            console.log('Phone OTP verification response:', phoneVerifyResponse.data);
            
            // Check if verification was successful
            if (phoneVerifyResponse.data.success || phoneVerifyResponse.status === 200) {
              setIsPhoneVerified(true);
              setOtp('');
              setIsPhoneVerifying(false);
              setModalVisible(false);
              setIsPhoneOtpSent(false);
              Alert.alert('Success', 'Phone verified successfully!');
            } else {
              Alert.alert('Error', 'Invalid OTP. Please try again. (Hint: Use 123456 for testing)');
            }
          } catch (apiError) {
            console.log('API verification failed, but you can use 123456 for testing');
            Alert.alert('Error', 'Invalid OTP. Please try again. (Hint: Use 123456 for testing)');
          }
        }
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data;
        const errorMessage = errorData?.message || errorData?.error || 'Invalid OTP. Please try again.';
        console.error('Server error details:', errorData);
        Alert.alert('Verification Failed', errorMessage);
      } else if (error.request) {
        // Network error
        Alert.alert('Network Error', 'Please check your connection and try again.');
      } else {
        // Other error
        Alert.alert('Error', 'Failed to verify OTP. Please try again.');
      }
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
                placeholder="Enter phone number (e.g., 8130541407)"
                value={phone}
                onChangeText={setPhone}
                keyboardType="numeric"
                maxLength={13}
              />
              <Text style={styles.helperText}>
                Enter 10-digit mobile number. We'll add +91 automatically.
              </Text>
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
            onPress={() => {
              // Format phone number to include +91 prefix for API
              let formattedPhone = phone.replace(/\s/g, ''); // Remove spaces
              if (!formattedPhone.startsWith('+91') && !formattedPhone.startsWith('91')) {
                formattedPhone = '+91' + formattedPhone;
              } else if (formattedPhone.startsWith('91') && !formattedPhone.startsWith('+91')) {
                formattedPhone = '+' + formattedPhone;
              }
              
              // Store email and formatted phone in context
              updateRegistrationData({
                email: email,
                phone: formattedPhone,
              });
              navigation.navigate('Detail');
            }}
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
  cancelBtn: {
    backgroundColor: '#f0f0f0',
    marginTop: 10,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: -10,
    marginBottom: 10,
    fontStyle: 'italic',
  },
});

export default EmailVerificationScreen;
