import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRegistration } from '../../../context/RegistrationContext';

const Detail = ({ navigation }: { navigation: any }) => {
  const { updateRegistrationData } = useRegistration();
  const [formData, setFormData] = useState({
    instagramHandle: '',
    occupation: '',
    description: '',
  });
  const [errors, setErrors] = useState({
    instagramHandle: '',
    occupation: '',
    description: '',
  });

  // Validation regex patterns
  const instagramRegex = /^[a-zA-Z0-9_.]{1,30}$/;
  const occupationRegex = /^[a-zA-Z\s]{2,50}$/;

  const validateForm = () => {
    const newErrors = {
      instagramHandle: '',
      occupation: '',
      description: '',
    };

    // Instagram handle validation
    if (!formData.instagramHandle.trim()) {
      newErrors.instagramHandle = 'Instagram handle is required';
    } else if (!instagramRegex.test(formData.instagramHandle)) {
      newErrors.instagramHandle = 'Invalid Instagram handle format';
    }

    // Occupation validation
    if (!formData.occupation.trim()) {
      newErrors.occupation = 'Occupation is required';
    } else if (!occupationRegex.test(formData.occupation)) {
      newErrors.occupation = 'Occupation must contain only letters and spaces (2-50 characters)';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const isFormValid = () => {
    return (
      formData.instagramHandle.trim() !== '' &&
      formData.occupation.trim() !== '' &&
      formData.description.trim() !== '' &&
      formData.description.trim().length >= 50 &&
      instagramRegex.test(formData.instagramHandle) &&
      occupationRegex.test(formData.occupation)
    );
  };

  const handleNext = () => {
    if (validateForm()) {
      // Store data in context
      updateRegistrationData({
        instagram: formData.instagramHandle,
        occupation: formData.occupation,
        description: formData.description,
      });
      navigation.navigate('UploadPicRegister', { formData });
    } else {
      Alert.alert('Validation Error', 'Please fix the errors below');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Ionicons
          onPress={() => {
            navigation.goBack();
          }}
          name="chevron-back"
          size={30}
          color="black"
          style={{ marginLeft: 10 }}
        />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Request Your Invite</Text>

        <Text style={styles.label}>Instagram Handle *</Text>
        <TextInput
          style={[styles.input, errors.instagramHandle ? styles.inputError : null]}
          placeholder="Instagram Handle"
          placeholderTextColor="#888"
          value={formData.instagramHandle}
          onChangeText={(value) => handleInputChange('instagramHandle', value)}
          autoCapitalize="none"
        />
        {errors.instagramHandle ? (
          <Text style={styles.errorText}>{errors.instagramHandle}</Text>
        ) : null}

        <Text style={styles.label}>Occupation *</Text>
        <TextInput
          style={[styles.input, errors.occupation ? styles.inputError : null]}
          placeholder="Occupation"
          placeholderTextColor="#888"
          value={formData.occupation}
          onChangeText={(value) => handleInputChange('occupation', value)}
        />
        {errors.occupation ? (
          <Text style={styles.errorText}>{errors.occupation}</Text>
        ) : null}

        <Text style={styles.label}>Describe yourself *</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.description ? styles.inputError : null]}
          placeholder="Tell us about yourself (minimum 50 characters)"
          placeholderTextColor="#888"
          multiline
          value={formData.description}
          onChangeText={(value) => handleInputChange('description', value)}
        />
        <Text style={styles.characterCount}>
          {formData.description.length}/50 characters
        </Text>
        {errors.description ? (
          <Text style={styles.errorText}>{errors.description}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.nextButton, !isFormValid() && styles.disabledButton]}
          onPress={isFormValid() ? handleNext : undefined}
          disabled={!isFormValid()}
        >
          <Text style={[styles.buttonText, !isFormValid() && styles.disabledButtonText]}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    width: '100%',
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  nextButton: {
    backgroundColor: '#4F0D50',
    paddingVertical: 12,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 20,
    position: 'absolute',
    bottom: 0,
    marginHorizontal: 5,
    paddingHorizontal: 70,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  inputError: {
    borderColor: '#ff4444',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: -10,
    marginBottom: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  disabledButtonText: {
    color: '#999',
  },
});

export default Detail;
