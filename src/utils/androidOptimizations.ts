import { Platform, StyleSheet } from 'react-native';

// Android-specific optimizations
export const androidStyles = StyleSheet.create({
  // Optimized shadow for Android
  androidShadow: {
    elevation: 8,
    shadowColor: 'transparent', // Disable iOS shadow on Android for better performance
  },
  
  // Optimized container for Android
  androidContainer: {
    flex: 1,
    ...(Platform.OS === 'android' && {
      paddingTop: 0, // Remove extra padding on Android
    }),
  },
  
  // Hardware accelerated view
  hardwareAccelerated: {
    flex: 1,
  },
  
  // Optimized text rendering
  optimizedText: {
    ...(Platform.OS === 'android' && {
      textAlignVertical: 'center' as 'center',
    }),
  },
  
  // Optimized image styles
  optimizedImage: {
    resizeMode: 'cover' as 'cover',
  },
});

// Platform-specific values
export const platformValues = {
  // Status bar height
  statusBarHeight: Platform.OS === 'android' ? 24 : 44,
  
  // Tab bar height
  tabBarHeight: Platform.OS === 'android' ? 65 : 83,
  
  // Header height
  headerHeight: Platform.OS === 'android' ? 56 : 64,
  
  // Border radius optimized for Android
  borderRadius: Platform.OS === 'android' ? 8 : 12,
  
  // Shadow optimized for Android
  shadow: Platform.OS === 'android' 
    ? { elevation: 4 }
    : {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
};

// Performance optimized colors
export const colors = {
  primary: '#4F0D50',
  secondary: '#999999',
  background: '#FFFFFF',
  text: '#333333',
  border: '#E0E0E0',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
  gradient: ['transparent', 'rgba(0, 0, 0, 0.8)'],
};

// Optimized animation configurations
export const animations = {
  // Fast spring animation
  fastSpring: {
    tension: 300,
    friction: 20,
    useNativeDriver: true,
  },
  
  // Smooth spring animation
  smoothSpring: {
    tension: 200,
    friction: 25,
    useNativeDriver: true,
  },
  
  // Quick fade
  quickFade: {
    duration: 200,
    useNativeDriver: true,
  },
  
  // Slide animation
  slide: {
    duration: 300,
    useNativeDriver: true,
  },
};
