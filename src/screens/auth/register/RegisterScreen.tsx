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
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRegistration } from '../../../context/RegistrationContext';

const questions = [
  { id: 'fullName', question: 'Name', type: 'text', required: true },
  { id: 'age', question: 'Age', type: 'text', required: true },
  {
    id: 'gender',
    question: 'Sex',
    type: 'radio',
    options: ['Male', 'Female', 'Others'],
    required: true,
  },
];

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { updateRegistrationData } = useRegistration();
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);

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
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: '' }));
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

  // Validate if all required fields are filled and no errors
  const isFormValid = () => {
    const hasAllRequiredFields = questions.every(q =>
      q.required ? answers[q.id] && answers[q.id] !== '' : true,
    );
    const hasNoErrors = Object.values(errors).every(error => error === '');
    const ageIsValid = calculatedAge === null || calculatedAge >= 18;
    
    return hasAllRequiredFields && hasNoErrors && ageIsValid;
  };

  const renderQuestion = (q: any) => (
    <View key={q.id} style={styles.question}>
      <Text style={styles.questionText}>
        {q.question}
        {q.required && <Text style={styles.required}> *</Text>}
      </Text>
      {q.id === 'age' ? (
        <>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.textInput}>
              {calculatedAge !== null
                ? `${calculatedAge} years`
                : 'Select your birth date'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display="spinner" // More user-friendly view
              onChange={(event, date) => {
                if (event.type === 'set' && date) {
                  setSelectedDate(date);
                  const age = calculateAge(date);
                  setCalculatedAge(age);
                  
                  // Validate age is at least 18
                  if (age < 18) {
                    setErrors(prev => ({ ...prev, [q.id]: 'You must be at least 18 years old to register.' }));
                  } else {
                    setErrors(prev => ({ ...prev, [q.id]: '' }));
                  }
                  
                  handleAnswerChange(q.id, age.toString());
                }
                setShowDatePicker(false);
              }}
            />
          )}
        </>
      ) : q.type === 'text' ? (
        <TextInput
          style={[styles.textInput, errors[q.id] && styles.errorBorder]}
          value={answers[q.id] || ''}
          onChangeText={t => handleAnswerChange(q.id, t)}
          placeholder="Enter here..."
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

      <ScrollView style={styles.content}>
        <Animated.View
          style={{ transform: [{ translateY: slideAnim }], opacity: fadeAnim }}
        >
          <Text style={styles.title}>Request Your Invite</Text>
          <View style={styles.card}>{questions.map(renderQuestion)}</View>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.btn,
            styles.filled,
            !isFormValid() && styles.disabledBtn, // Apply the disabled style when the form is invalid
          ]}
          onPress={() => {
            if (isFormValid()) {
              // Store data in context and navigate
              updateRegistrationData({
                name: answers.fullName,
                age: answers.age,
                sex: answers.gender,
              });
              navigation.navigate(
                'EmailVerification' as never,
                {
                  name: answers.fullName,
                  age: answers.age,
                  gender: answers.gender,
                } as never,
              );
            } else {
              // Handle the error if form is invalid
              const newErrors: any = {};
              questions.forEach(q => {
                if (q.required && !answers[q.id]) {
                  newErrors[q.id] = `${q.question} is required`;
                }
              });
              setErrors(newErrors);
            }
          }}
          disabled={!isFormValid()} // Disable button if form is invalid
        >
          <Text style={styles.filledText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', justifyContent: 'center' },
  title: {
    fontSize: 25,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
  },
  content: { flex: 1, paddingHorizontal: 20, marginVertical: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
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
    padding: 10,
    backgroundColor: '#fff',
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
    backgroundColor: '#D3D3D3', // Gray color for the disabled button
  },
});

export default RegisterScreen;
