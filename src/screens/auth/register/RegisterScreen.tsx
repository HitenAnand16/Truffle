import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { validateRegistrationForm, cleanPhoneNumber, formatPhoneNumber } from '../../../utils/validation';
import { authAPI, RegistrationPayload } from '../../../services/api';

const questions = [
  { id: 'fullName', question: 'Full Name', type: 'text', required: true, placeholder: 'Enter your full name' },
  { id: 'email', question: 'Email Address', type: 'email', required: true, placeholder: 'Enter your email' },
  { id: 'phone', question: 'Phone Number', type: 'phone', required: true, placeholder: '+1 (555) 123-4567' },
  { id: 'password', question: 'Password', type: 'password', required: true, placeholder: 'Create a strong password' },
  { id: 'confirmPassword', question: 'Confirm Password', type: 'password', required: true, placeholder: 'Confirm your password' },
  { id: 'age', question: 'Date of Birth', type: 'date', required: true },
  {
    id: 'gender',
    question: 'Gender',
    type: 'radio',
    options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
    required: true,
  },
];

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);

  const slideAnim = useRef(new Animated.Value(30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentPage]);

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }

    // Format phone number as user types
    if (id === 'phone') {
      const formatted = formatPhoneNumber(value);
      setAnswers(prev => ({ ...prev, [id]: formatted }));
    }

    // Real-time validation for certain fields
    if (id === 'email' && value.includes('@')) {
      checkEmailAvailability(value);
    }
  };

  const checkEmailAvailability = async (email: string) => {
    if (!email.includes('@') || email.length < 5) return;
    
    setEmailChecking(true);
    try {
      const result = await authAPI.checkEmailExists(email);
      if (result.data?.exists) {
        setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
      }
    } catch (error) {
      console.log('Email check failed:', error);
    } finally {
      setEmailChecking(false);
    }
  };

  const handlePrevious = () => {
    currentPage > 0 ? setCurrentPage(prev => prev - 1) : navigation.goBack();
  };

  const calculateAge = (date: Date): number => {
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const month = today.getMonth() - date.getMonth();
    return month < 0 || (month === 0 && today.getDate() < date.getDate())
      ? age - 1
      : age;
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (event.type === 'set' && date) {
      setSelectedDate(date);
      const age = calculateAge(date);
      setCalculatedAge(age);
      handleAnswerChange('age', age.toString());
      handleAnswerChange('dateOfBirth', date.toISOString().split('T')[0]);
    }
  };

  // Validate current form data
  const validateCurrentData = () => {
    const currentData: any = {};
    questions.forEach(q => {
      if (answers[q.id] !== undefined) {
        currentData[q.id] = answers[q.id];
      }
    });
    
    // Add derived fields
    if (selectedDate) {
      currentData.dateOfBirth = selectedDate.toISOString().split('T')[0];
    }

    const validation = validateRegistrationForm(currentData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const isFormValid = () => {
    return questions.every(q =>
      q.required ? answers[q.id] && answers[q.id] !== '' : true,
    ) && Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateCurrentData()) {
      Alert.alert('Validation Error', 'Please fix the errors above before continuing.');
      return;
    }

    setLoading(true);
    
    try {
      // Prepare registration payload
      const [firstName, ...lastNameParts] = answers.fullName.trim().split(' ');
      const lastName = lastNameParts.join(' ');

      const payload: RegistrationPayload = {
        fullName: answers.fullName,
        firstName,
        lastName,
        email: answers.email.toLowerCase().trim(),
        phone: cleanPhoneNumber(answers.phone),
        password: answers.password,
        age: calculatedAge || parseInt(answers.age),
        dateOfBirth: selectedDate?.toISOString().split('T')[0] || '',
        gender: answers.gender,
        deviceInfo: {
          platform: 'mobile',
          version: '1.0.0',
          deviceId: 'demo_device_id',
        },
      };

      console.log('Submitting registration:', payload);

      const result = await authAPI.register(payload);

      if (result.success) {
        Alert.alert(
          'Registration Successful!', 
          result.message,
          [
            {
              text: 'Continue',
              onPress: () => {
                navigation.navigate(
                  'EmailVerification' as never,
                  {
                    email: payload.email,
                    name: payload.firstName,
                    userId: result.data?.user?.id,
                  } as never,
                );
              },
            },
          ]
        );
      } else {
        Alert.alert('Registration Failed', result.message || 'Please try again.');
        
        // Set field-specific errors if available
        if (result.errors) {
          setErrors(result.errors);
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(
        'Registration Error', 
        'An unexpected error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordInput = (q: any) => (
    <View style={styles.passwordContainer}>
      <TextInput
        style={[styles.textInput, errors[q.id] && styles.errorBorder, { paddingRight: 50 }]}
        value={answers[q.id] || ''}
        onChangeText={t => handleAnswerChange(q.id, t)}
        placeholder={q.placeholder}
        secureTextEntry={q.id === 'password' ? !showPassword : !showConfirmPassword}
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={styles.eyeIcon}
        onPress={() => {
          if (q.id === 'password') {
            setShowPassword(!showPassword);
          } else {
            setShowConfirmPassword(!showConfirmPassword);
          }
        }}
      >
        <Ionicons
          name={
            (q.id === 'password' ? showPassword : showConfirmPassword)
              ? 'eye-off-outline'
              : 'eye-outline'
          }
          size={20}
          color="#666"
        />
      </TouchableOpacity>
    </View>
  );

  const renderQuestion = (q: any) => (
    <View key={q.id} style={styles.question}>
      <Text style={styles.questionText}>
        {q.question}
        {q.required && <Text style={styles.required}> *</Text>}
      </Text>
      
      {q.id === 'age' ? (
        <>
          <TouchableOpacity 
            onPress={() => setShowDatePicker(true)}
            style={[styles.textInput, styles.dateButton]}
          >
            <Text style={[styles.dateText, calculatedAge ? styles.dateTextSelected : null]}>
              {calculatedAge !== null
                ? `${selectedDate?.toLocaleDateString()} (${calculatedAge} years)`
                : 'Select your birth date'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#666" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate || new Date(2000, 0, 1)}
              mode="date"
              display="spinner"
              maximumDate={new Date()}
              minimumDate={new Date(1924, 0, 1)}
              onChange={handleDateChange}
            />
          )}
        </>
      ) : q.type === 'password' ? (
        renderPasswordInput(q)
      ) : q.type === 'email' ? (
        <View style={styles.emailContainer}>
          <TextInput
            style={[styles.textInput, errors[q.id] && styles.errorBorder]}
            value={answers[q.id] || ''}
            onChangeText={t => handleAnswerChange(q.id, t)}
            placeholder={q.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {emailChecking && (
            <ActivityIndicator
              size="small"
              color="#4F0D50"
              style={styles.emailLoader}
            />
          )}
        </View>
      ) : q.type === 'phone' ? (
        <TextInput
          style={[styles.textInput, errors[q.id] && styles.errorBorder]}
          value={answers[q.id] || ''}
          onChangeText={t => handleAnswerChange(q.id, t)}
          placeholder={q.placeholder}
          keyboardType="phone-pad"
          maxLength={17}
        />
      ) : q.type === 'text' ? (
        <TextInput
          style={[styles.textInput, errors[q.id] && styles.errorBorder]}
          value={answers[q.id] || ''}
          onChangeText={t => handleAnswerChange(q.id, t)}
          placeholder={q.placeholder}
          autoCapitalize="words"
        />
      ) : (
        <View>
          {q.options?.map((opt, i) => (
            <TouchableOpacity
              key={i}
              style={styles.radioOption}
              onPress={() => handleAnswerChange(q.id, opt)}
            >
              <View
                style={[
                  styles.radioOuter,
                  answers[q.id] === opt && styles.radioOuterActive,
                ]}
              >
                {answers[q.id] === opt && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {errors[q.id] && <Text style={styles.errorText}>{errors[q.id]}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Ionicons
          onPress={handlePrevious}
          name="chevron-back"
          size={30}
          color="black"
          style={{ marginLeft: 10 }}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{ transform: [{ translateY: slideAnim }], opacity: fadeAnim }}
        >
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>Join Truffle and find meaningful connections</Text>
          <View style={styles.card}>{questions.map(renderQuestion)}</View>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.btn,
            styles.filled,
            (!isFormValid() || loading) && styles.disabledBtn,
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid() || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.filledText}>Create Account</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', justifyContent: 'center' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    marginBottom: 10,
  },
  content: { flex: 1, paddingHorizontal: 20, marginVertical: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
    elevation: 3,
    marginTop: 20,
  },
  question: { marginBottom: 20 },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  required: { color: '#f44336' },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
  emailContainer: {
    position: 'relative',
  },
  emailLoader: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    color: '#999',
    fontSize: 16,
  },
  dateTextSelected: {
    color: '#333',
  },
  errorBorder: { borderColor: '#f44336' },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: { borderColor: '#4F0D50' },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4F0D50',
  },
  radioText: { marginLeft: 10, fontSize: 15, color: '#333' },
  errorText: { color: '#f44336', fontSize: 13, marginTop: 5 },
  footer: { flexDirection: 'row', justifyContent: 'center', padding: 20 },
  btn: {
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginHorizontal: 5,
    paddingHorizontal: 70,
    backgroundColor: 'gray',
  },
  filled: { backgroundColor: '#4F0D50' },
  filledText: { color: '#fff', fontWeight: '600' },
  disabledBtn: {
    backgroundColor: '#D3D3D3',
  },
});

export default RegisterScreen;
