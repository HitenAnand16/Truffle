# Truffle App Structure

## Overview
This React Native app provides a complete registration and tracking system with three main features:
- **Register**: Multi-page form with 3 questions per page
- **Track**: Application status tracking
- **Login**: User authentication

## App Structure

### Screens
- **InitialScreen** (`src/screens/InitialScreen.tsx`)
  - Welcome screen with three main options
  - Beautiful card-based UI with React Native Paper
  - Navigation to Register, Track, and Login screens

- **RegisterScreen** (`src/screens/RegisterScreen.tsx`)
  - Paginated registration form (3 questions per page)
  - 12 total questions across 4 pages
  - Form validation and error handling
  - Progress bar showing completion status
  - Support for both text input and radio button questions

- **TrackScreen** (`src/screens/TrackScreen.tsx`)
  - Application status tracking
  - Mock application status display
  - Process explanation and next steps
  - Application ID input for tracking

- **LoginScreen** (`src/screens/LoginScreen.tsx`)
  - User authentication form
  - Email and password validation
  - Remember me functionality
  - Forgot password option
  - Link to registration

### Navigation
- **AppNavigator** (`src/navigation/AppNavigator.tsx`)
  - Stack navigation setup
  - Smooth screen transitions
  - TypeScript type definitions for navigation

## Features Implemented

### Registration Flow
1. **Page 1**: Personal Information
   - Full Name
   - Email Address
   - Phone Number

2. **Page 2**: Basic Details
   - Age
   - Gender (radio buttons)
   - Occupation

3. **Page 3**: Professional Information
   - Education Level (radio buttons)
   - Years of Experience
   - Location

4. **Page 4**: Additional Information
   - Interests
   - Career Goals
   - Additional Information

### Track Application
- Application status display with color-coded chips
- Detailed application information
- Next steps and process explanation
- Estimated completion timeline

### UI/UX Features
- Modern Material Design with React Native Paper
- Responsive layout
- Form validation with error messages
- Loading states
- Progress indicators
- Smooth animations and transitions

## Dependencies Used
- React Navigation for screen navigation
- React Native Paper for UI components
- TypeScript for type safety
- React Native core components

## Running the App
```bash
# Install dependencies
npm install

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Future Enhancements
- Real API integration for registration and tracking
- User authentication with backend
- Push notifications for status updates
- Offline support
- Data persistence
