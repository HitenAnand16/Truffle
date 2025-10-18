// Regex patterns for validation
export const REGEX_PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  name: /^[a-zA-Z\s]{2,50}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  alphanumeric: /^[a-zA-Z0-9\s]+$/,
  noSpecialChars: /^[a-zA-Z0-9\s\-\.]+$/,
};

// Validation functions
export const validateEmail = (email: string): { isValid: boolean; message: string } => {
  if (!email.trim()) {
    return { isValid: false, message: 'Email is required' };
  }
  if (!REGEX_PATTERNS.email.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  return { isValid: true, message: '' };
};

export const validatePhone = (phone: string): { isValid: boolean; message: string } => {
  if (!phone.trim()) {
    return { isValid: false, message: 'Phone number is required' };
  }
  // Remove all non-numeric characters except +
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  if (cleanPhone.length < 10 || cleanPhone.length > 16) {
    return { isValid: false, message: 'Phone number must be between 10-16 digits' };
  }
  if (!REGEX_PATTERNS.phone.test(cleanPhone)) {
    return { isValid: false, message: 'Please enter a valid phone number' };
  }
  return { isValid: true, message: '' };
};

export const validateName = (name: string): { isValid: boolean; message: string } => {
  if (!name.trim()) {
    return { isValid: false, message: 'Name is required' };
  }
  if (name.trim().length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters' };
  }
  if (name.trim().length > 50) {
    return { isValid: false, message: 'Name must be less than 50 characters' };
  }
  if (!REGEX_PATTERNS.name.test(name.trim())) {
    return { isValid: false, message: 'Name can only contain letters and spaces' };
  }
  return { isValid: true, message: '' };
};

export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters' };
  }
  if (!REGEX_PATTERNS.password.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain: uppercase, lowercase, number, and special character' 
    };
  }
  return { isValid: true, message: '' };
};

export const validateAge = (age: string | number): { isValid: boolean; message: string } => {
  const ageNum = typeof age === 'string' ? parseInt(age, 10) : age;
  
  if (!age || isNaN(ageNum)) {
    return { isValid: false, message: 'Age is required' };
  }
  if (ageNum < 18) {
    return { isValid: false, message: 'You must be at least 18 years old' };
  }
  if (ageNum > 100) {
    return { isValid: false, message: 'Please enter a valid age' };
  }
  return { isValid: true, message: '' };
};

export const validateDateOfBirth = (dateStr: string): { isValid: boolean; message: string } => {
  if (!dateStr) {
    return { isValid: false, message: 'Date of birth is required' };
  }
  
  const date = new Date(dateStr);
  const today = new Date();
  
  if (isNaN(date.getTime())) {
    return { isValid: false, message: 'Please enter a valid date' };
  }
  
  // Calculate age
  const age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  const dayDiff = today.getDate() - date.getDate();
  
  const calculatedAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
  
  if (calculatedAge < 18) {
    return { isValid: false, message: 'You must be at least 18 years old' };
  }
  
  if (date > today) {
    return { isValid: false, message: 'Date of birth cannot be in the future' };
  }
  
  return { isValid: true, message: '' };
};

export const validateGender = (gender: string): { isValid: boolean; message: string } => {
  const validGenders = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
  
  if (!gender) {
    return { isValid: false, message: 'Gender selection is required' };
  }
  
  if (!validGenders.includes(gender)) {
    return { isValid: false, message: 'Please select a valid gender option' };
  }
  
  return { isValid: true, message: '' };
};

export const validateRequired = (value: string, fieldName: string): { isValid: boolean; message: string } => {
  if (!value || !value.trim()) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  return { isValid: true, message: '' };
};

// Function to validate all registration fields
export interface RegistrationData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  age: string;
  dateOfBirth: string;
  gender: string;
}

export const validateRegistrationForm = (data: Partial<RegistrationData>) => {
  const errors: { [key: string]: string } = {};
  
  // Validate full name
  if (data.fullName !== undefined) {
    const nameValidation = validateName(data.fullName);
    if (!nameValidation.isValid) {
      errors.fullName = nameValidation.message;
    }
  }
  
  // Validate email
  if (data.email !== undefined) {
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.message;
    }
  }
  
  // Validate phone
  if (data.phone !== undefined) {
    const phoneValidation = validatePhone(data.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.message;
    }
  }
  
  // Validate password
  if (data.password !== undefined) {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message;
    }
  }
  
  // Validate confirm password
  if (data.confirmPassword !== undefined && data.password !== undefined) {
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }
  
  // Validate age
  if (data.age !== undefined) {
    const ageValidation = validateAge(data.age);
    if (!ageValidation.isValid) {
      errors.age = ageValidation.message;
    }
  }
  
  // Validate date of birth
  if (data.dateOfBirth !== undefined) {
    const dobValidation = validateDateOfBirth(data.dateOfBirth);
    if (!dobValidation.isValid) {
      errors.dateOfBirth = dobValidation.message;
    }
  }
  
  // Validate gender
  if (data.gender !== undefined) {
    const genderValidation = validateGender(data.gender);
    if (!genderValidation.isValid) {
      errors.gender = genderValidation.message;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
};

// Clean phone number for API submission
export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};
