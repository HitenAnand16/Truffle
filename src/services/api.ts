import axios from 'axios';

// Configure axios instance
const API_BASE_URL = 'https://api.truffle-dating.com'; // Replace with your actual API URL
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    // const token = getStoredToken(); // Implement this function
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // redirectToLogin(); // Implement this function
    }
    return Promise.reject(error);
  }
);

// Types
export interface RegistrationPayload {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  age: number;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    state?: string;
    country?: string;
  };
  deviceInfo?: {
    platform: string;
    version: string;
    deviceId: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  errors?: { [key: string]: string };
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
  };
  token: string;
  refreshToken: string;
}

export interface EmailVerificationPayload {
  email: string;
  code: string;
}

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (payload: RegistrationPayload): Promise<ApiResponse<AuthResponse>> => {
    try {
      console.log('Registering user with payload:', payload);
      
      // For demo purposes, simulate API call
      // Remove this and uncomment the real API call below
      await new Promise<void>(resolve => setTimeout(() => resolve(), 2000)); // Simulate network delay
      
      return {
        success: true,
        data: {
          user: {
            id: Math.random().toString(36).substr(2, 9),
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
            isEmailVerified: false,
            isPhoneVerified: false,
          },
          token: 'demo_jwt_token_' + Math.random().toString(36),
          refreshToken: 'demo_refresh_token_' + Math.random().toString(36),
        },
        message: 'Registration successful! Please verify your email.',
      };
      
      // Real API call (uncomment when backend is ready)
      // const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', payload);
      // return response.data;
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.response?.data) {
        return error.response.data;
      }
      
      return {
        success: false,
        message: 'Registration failed. Please try again.',
        errors: { general: 'Network error occurred' },
      };
    }
  },

  // Login user
  login: async (payload: LoginPayload): Promise<ApiResponse<AuthResponse>> => {
    try {
      console.log('Logging in user:', payload.email);
      
      // For demo purposes, simulate API call
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1500));
      
      return {
        success: true,
        data: {
          user: {
            id: 'demo_user_id',
            email: payload.email,
            firstName: 'Demo',
            lastName: 'User',
            isEmailVerified: true,
            isPhoneVerified: true,
          },
          token: 'demo_jwt_token_' + Math.random().toString(36),
          refreshToken: 'demo_refresh_token_' + Math.random().toString(36),
        },
        message: 'Login successful!',
      };
      
      // Real API call
      // const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', payload);
      // return response.data;
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.response?.data) {
        return error.response.data;
      }
      
      return {
        success: false,
        message: 'Login failed. Please check your credentials.',
        errors: { general: 'Invalid email or password' },
      };
    }
  },

  // Verify email
  verifyEmail: async (payload: EmailVerificationPayload): Promise<ApiResponse<any>> => {
    try {
      console.log('Verifying email:', payload.email, 'with code:', payload.code);
      
      // For demo purposes, simulate API call
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
      
      // Simulate verification logic
      if (payload.code === '123456' || payload.code.length === 6) {
        return {
          success: true,
          message: 'Email verified successfully!',
        };
      } else {
        return {
          success: false,
          message: 'Invalid verification code.',
          errors: { code: 'Please enter a valid 6-digit code' },
        };
      }
      
      // Real API call
      // const response = await api.post<ApiResponse<any>>('/auth/verify-email', payload);
      // return response.data;
      
    } catch (error: any) {
      console.error('Email verification error:', error);
      
      return {
        success: false,
        message: 'Verification failed. Please try again.',
        errors: { general: 'Network error occurred' },
      };
    }
  },

  // Resend verification code
  resendVerificationCode: async (email: string): Promise<ApiResponse<any>> => {
    try {
      console.log('Resending verification code to:', email);
      
      // For demo purposes, simulate API call
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
      
      return {
        success: true,
        message: 'Verification code sent successfully!',
      };
      
      // Real API call
      // const response = await api.post<ApiResponse<any>>('/auth/resend-code', { email });
      // return response.data;
      
    } catch (error: any) {
      console.error('Resend code error:', error);
      
      return {
        success: false,
        message: 'Failed to send verification code. Please try again.',
      };
    }
  },

  // Check if email exists
  checkEmailExists: async (email: string): Promise<ApiResponse<{ exists: boolean }>> => {
    try {
      console.log('Checking if email exists:', email);
      
      // For demo purposes, simulate API call
      await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
      
      // Simulate some emails already existing
      const existingEmails = ['test@example.com', 'user@demo.com', 'admin@truffle.com'];
      const exists = existingEmails.includes(email.toLowerCase());
      
      return {
        success: true,
        data: { exists },
        message: exists ? 'Email already registered' : 'Email available',
      };
      
      // Real API call
      // const response = await api.get<ApiResponse<{ exists: boolean }>>(`/auth/check-email?email=${encodeURIComponent(email)}`);
      // return response.data;
      
    } catch (error: any) {
      console.error('Check email error:', error);
      
      return {
        success: false,
        message: 'Unable to check email availability',
        data: { exists: false },
      };
    }
  },
};

// User API functions
export const userAPI = {
  // Update user profile
  updateProfile: async (userId: string, updates: any): Promise<ApiResponse<any>> => {
    try {
      console.log('Updating profile for user:', userId, updates);
      
      // Simulate API call
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
      
      return {
        success: true,
        message: 'Profile updated successfully!',
      };
      
      // Real API call
      // const response = await api.put<ApiResponse<any>>(`/users/${userId}`, updates);
      // return response.data;
      
    } catch (error: any) {
      console.error('Update profile error:', error);
      
      return {
        success: false,
        message: 'Failed to update profile. Please try again.',
      };
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (userId: string, imageUri: string): Promise<ApiResponse<{ imageUrl: string }>> => {
    try {
      console.log('Uploading profile picture for user:', userId);
      
      // Simulate API call
      await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));
      
      return {
        success: true,
        data: { imageUrl: imageUri }, // In real scenario, this would be the uploaded image URL
        message: 'Profile picture uploaded successfully!',
      };
      
      // Real implementation would use FormData
      // const formData = new FormData();
      // formData.append('image', {
      //   uri: imageUri,
      //   type: 'image/jpeg',
      //   name: 'profile.jpg',
      // } as any);
      // 
      // const response = await api.post<ApiResponse<{ imageUrl: string }>>(`/users/${userId}/upload-picture`, formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      // });
      // return response.data;
      
    } catch (error: any) {
      console.error('Upload picture error:', error);
      
      return {
        success: false,
        message: 'Failed to upload picture. Please try again.',
      };
    }
  },
};

export default api;
