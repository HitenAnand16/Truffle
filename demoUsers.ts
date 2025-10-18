export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';
  age: number;
  dateOfBirth: string;
  profilePicture: string;
  additionalPhotos: string[];
  about: string;
  description: string;
  interests: string[];
  strengths: string[];
  occupation: string;
  education: string;
  height: string;
  bodyType: string;
  smokingStatus: string;
  drinkingStatus: string;
  religion: string;
  politicalViews: string;
  languages: string[];
  whatAmILookingFor: {
    relationshipType: string;
    personality: string[];
    activities: string[];
    qualities: string[];
    communicationStyle: string;
    physicalAttraction: string;
  };
  location: {
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  socialMediaLinks: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
  };
  preferences: {
    ageRange: { min: number; max: number };
    gender: string;
    distance: number;
  };
  isVerified: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  profileCompleteness: number;
  likes: number;
  dislikes: number;
  matches: number;
  views: number;
  lastOnline: string;
  joinedDate: string;
  accountStatus: 'Active' | 'Inactive' | 'Suspended';
  subscription: 'Basic' | 'Premium' | 'VIP';
}

export const demoUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0123',
    gender: 'Male',
    age: 28,
    dateOfBirth: '1996-03-15',
    profilePicture: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    ],
    about: 'I love hiking, photography, and traveling the world. Always up for a good adventure! 🌍📸',
    description: 'I am easy-going, enjoy a good laugh, and appreciate deep conversations. Software engineer by profession, adventure seeker by passion.',
    interests: ['Hiking', 'Traveling', 'Photography', 'Cooking', 'Rock Climbing', 'Guitar'],
    strengths: ['Empathy', 'Adventurous', 'Optimistic', 'Loyal', 'Creative'],
    occupation: 'Software Engineer',
    education: 'Computer Science, NYU',
    height: '6ft 1in',
    bodyType: 'Athletic',
    smokingStatus: 'Non-smoker',
    drinkingStatus: 'Social drinker',
    religion: 'Christian',
    politicalViews: 'Liberal',
    languages: ['English', 'Spanish'],
    whatAmILookingFor: {
      relationshipType: 'Serious Relationship',
      personality: ['Adventurous', 'Funny', 'Caring', 'Intelligent'],
      activities: ['Traveling', 'Dining out', 'Music concerts', 'Outdoor adventures'],
      qualities: ['Honesty', 'Ambition', 'Sense of humor', 'Kindness'],
      communicationStyle: 'Clear and open communication with mutual respect.',
      physicalAttraction: 'Confident and caring individuals who take care of themselves.',
    },
    location: {
      city: 'New York',
      state: 'NY',
      country: 'USA',
      latitude: 40.7128,
      longitude: -74.006,
    },
    socialMediaLinks: {
      instagram: 'https://instagram.com/johndoe',
      facebook: 'https://facebook.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
    },
    preferences: {
      ageRange: { min: 25, max: 35 },
      gender: 'Female',
      distance: 50,
    },
    isVerified: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    profileCompleteness: 95,
    likes: 35,
    dislikes: 3,
    matches: 12,
    views: 156,
    lastOnline: '2025-10-18T15:30:00Z',
    joinedDate: '2025-01-15T10:00:00Z',
    accountStatus: 'Active',
    subscription: 'Premium',
  },
  {
    id: '2',
    firstName: 'Emma',
    lastName: 'Smith',
    email: 'emma.smith@example.com',
    phone: '+1-555-0456',
    gender: 'Female',
    age: 25,
    dateOfBirth: '1999-07-22',
    profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
    ],
    about: 'Music, yoga, and trying new foods. Looking for someone who shares my passion for life! 🎵🧘‍♀️',
    description: 'Creative, energetic, and I believe in living life to the fullest. Graphic designer who loves artistic expression.',
    interests: ['Yoga', 'Music', 'Cooking', 'Traveling', 'Art', 'Dancing'],
    strengths: ['Creative', 'Kind-hearted', 'Optimistic', 'Spontaneous'],
    occupation: 'Graphic Designer',
    education: 'Fine Arts, UCLA',
    height: '5ft 6in',
    bodyType: 'Slim',
    smokingStatus: 'Non-smoker',
    drinkingStatus: 'Occasionally',
    religion: 'Spiritual',
    politicalViews: 'Moderate',
    languages: ['English', 'French'],
    whatAmILookingFor: {
      relationshipType: 'Casual',
      personality: ['Fun', 'Energetic', 'Open-minded', 'Creative'],
      activities: ['Yoga', 'Music festivals', 'Traveling', 'Art galleries'],
      qualities: ['Kindness', 'Adventurous', 'Generosity', 'Authenticity'],
      communicationStyle: 'Honest and open with lots of laughter.',
      physicalAttraction: 'Someone who is confident and loves a good laugh.',
    },
    location: {
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      latitude: 34.0522,
      longitude: -118.2437,
    },
    socialMediaLinks: { 
      instagram: 'https://instagram.com/emmasmith',
      twitter: 'https://twitter.com/emmasmith',
    },
    preferences: {
      ageRange: { min: 22, max: 30 },
      gender: 'Male',
      distance: 40,
    },
    isVerified: false,
    isEmailVerified: true,
    isPhoneVerified: false,
    profileCompleteness: 85,
    likes: 50,
    dislikes: 2,
    matches: 8,
    views: 203,
    lastOnline: '2025-10-17T12:00:00Z',
    joinedDate: '2025-02-20T14:30:00Z',
    accountStatus: 'Active',
    subscription: 'Basic',
  },
  {
    id: '3',
    firstName: 'Liam',
    lastName: 'Williams',
    email: 'liam.williams@example.com',
    phone: '+1-555-0789',
    gender: 'Male',
    age: 30,
    dateOfBirth: '1994-11-08',
    profilePicture: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
      'https://images.unsplash.com/photo-1552058544-f2b08422138a',
    ],
    about: 'I enjoy sports, especially football, and hanging out with friends. Fitness enthusiast and team player! 🏈💪',
    description: 'Outgoing, sports lover, and always looking to try new things. Marketing manager who believes in work-life balance.',
    interests: ['Football', 'Movies', 'Traveling', 'Fitness', 'Cooking', 'Gaming'],
    strengths: ['Competitive', 'Optimistic', 'Hard-working', 'Reliable'],
    occupation: 'Marketing Manager',
    education: 'Business Administration, University of Chicago',
    height: '6ft 0in',
    bodyType: 'Athletic',
    smokingStatus: 'Non-smoker',
    drinkingStatus: 'Social drinker',
    religion: 'Catholic',
    politicalViews: 'Conservative',
    languages: ['English'],
    whatAmILookingFor: {
      relationshipType: 'Serious Relationship',
      personality: ['Active', 'Caring', 'Funny', 'Supportive'],
      activities: ['Sports', 'Outdoor adventures', 'Traveling', 'Movies'],
      qualities: ['Ambition', 'Sense of humor', 'Loyalty', 'Family-oriented'],
      communicationStyle: 'I appreciate honesty and loyalty in relationships.',
      physicalAttraction: 'Someone who is active and enjoys outdoor activities.',
    },
    location: {
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      latitude: 41.8781,
      longitude: -87.6298,
    },
    socialMediaLinks: { 
      instagram: 'https://instagram.com/liamwilliams',
      linkedin: 'https://linkedin.com/in/liamwilliams',
    },
    preferences: {
      ageRange: { min: 25, max: 35 },
      gender: 'Female',
      distance: 60,
    },
    isVerified: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    profileCompleteness: 90,
    likes: 40,
    dislikes: 1,
    matches: 15,
    views: 189,
    lastOnline: '2025-10-18T16:00:00Z',
    joinedDate: '2025-03-10T09:15:00Z',
    accountStatus: 'Active',
    subscription: 'Premium',
  },
  {
    id: '4',
    firstName: 'Olivia',
    lastName: 'Brown',
    email: 'olivia.brown@example.com',
    phone: '+1-555-0321',
    gender: 'Female',
    age: 27,
    dateOfBirth: '1997-05-12',
    profilePicture: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
      'https://images.unsplash.com/photo-1494790108755-2616b612e129',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9',
    ],
    about: 'A lover of nature, hiking, and good coffee. I am passionate about sustainability and environmental causes! 🌿☕',
    description: 'Laid-back, loves the outdoors, and values meaningful connections. Environmental scientist making a difference.',
    interests: ['Hiking', 'Photography', 'Sustainability', 'Reading', 'Yoga', 'Volunteering'],
    strengths: ['Empathy', 'Thoughtful', 'Creative', 'Passionate'],
    occupation: 'Environmental Scientist',
    education: 'Environmental Science, UC Berkeley',
    height: '5ft 7in',
    bodyType: 'Average',
    smokingStatus: 'Non-smoker',
    drinkingStatus: 'Rarely',
    religion: 'Buddhist',
    politicalViews: 'Liberal',
    languages: ['English', 'Spanish', 'German'],
    whatAmILookingFor: {
      relationshipType: 'Serious Relationship',
      personality: ['Supportive', 'Kind', 'Adventurous', 'Mindful'],
      activities: ['Hiking', 'Art museums', 'Cooking classes', 'Volunteering'],
      qualities: ['Honesty', 'Kindness', 'Sense of humor', 'Environmental consciousness'],
      communicationStyle: 'Open and caring with deep meaningful conversations.',
      physicalAttraction: 'Someone who shares my passion for nature and sustainability.',
    },
    location: {
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      latitude: 37.7749,
      longitude: -122.4194,
    },
    socialMediaLinks: { 
      instagram: 'https://instagram.com/oliviabrown',
      linkedin: 'https://linkedin.com/in/oliviabrown',
    },
    preferences: {
      ageRange: { min: 25, max: 35 },
      gender: 'Male',
      distance: 50,
    },
    isVerified: false,
    isEmailVerified: true,
    isPhoneVerified: true,
    profileCompleteness: 88,
    likes: 60,
    dislikes: 0,
    matches: 10,
    views: 234,
    lastOnline: '2025-10-16T18:30:00Z',
    joinedDate: '2025-04-05T11:20:00Z',
    accountStatus: 'Active',
    subscription: 'Basic',
  },
  {
    id: '5',
    firstName: 'Noah',
    lastName: 'Davis',
    email: 'noah.davis@example.com',
    phone: '+1-555-0654',
    gender: 'Male',
    age: 32,
    dateOfBirth: '1992-09-03',
    profilePicture: 'https://images.unsplash.com/photo-1614285964473-3b2b1f3f1c3e',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1560250097-0b93528c311a',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    ],
    about: 'Big fan of tech, gaming, and outdoor adventures. Always exploring the latest gadgets and innovations! 🎮💻',
    description: 'Tech geek by day, gamer by night. Love to explore new technologies and share knowledge with others.',
    interests: ['Gaming', 'Tech gadgets', 'Hiking', 'Programming', 'Board games', 'Sci-fi'],
    strengths: ['Analytical', 'Creative', 'Passionate', 'Problem-solver'],
    occupation: 'Senior Software Developer',
    education: 'Computer Science, UT Austin',
    height: '5ft 11in',
    bodyType: 'Average',
    smokingStatus: 'Non-smoker',
    drinkingStatus: 'Occasionally',
    religion: 'Agnostic',
    politicalViews: 'Libertarian',
    languages: ['English', 'Japanese'],
    whatAmILookingFor: {
      relationshipType: 'Casual',
      personality: ['Geeky', 'Funny', 'Creative', 'Independent'],
      activities: ['Tech events', 'Gaming marathons', 'Camping', 'Conventions'],
      qualities: ['Intelligence', 'Humor', 'Adventurous', 'Open-minded'],
      communicationStyle: 'Straightforward and fun with shared interests.',
      physicalAttraction: 'Someone who enjoys tech and has a good sense of humor.',
    },
    location: {
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      latitude: 30.2672,
      longitude: -97.7431,
    },
    socialMediaLinks: { 
      instagram: 'https://instagram.com/noahdavis',
      linkedin: 'https://linkedin.com/in/noahdavis',
      twitter: 'https://twitter.com/noahdavis',
    },
    preferences: {
      ageRange: { min: 28, max: 38 },
      gender: 'Female',
      distance: 70,
    },
    isVerified: true,
    isEmailVerified: true,
    isPhoneVerified: false,
    profileCompleteness: 92,
    likes: 70,
    dislikes: 5,
    matches: 18,
    views: 312,
    lastOnline: '2025-10-15T14:00:00Z',
    joinedDate: '2025-01-28T16:45:00Z',
    accountStatus: 'Active',
    subscription: 'VIP',
  },
  {
    id: '6',
    firstName: 'Sophia',
    lastName: 'Martinez',
    email: 'sophia.martinez@example.com',
    phone: '+1-555-0987',
    gender: 'Female',
    age: 29,
    dateOfBirth: '1995-12-18',
    profilePicture: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
    ],
    about: 'Doctor by profession, dancer by passion. Love helping people and expressing myself through movement! 💃🩺',
    description: 'Dedicated healthcare professional who believes in balance between work and personal life. Love salsa dancing and traveling.',
    interests: ['Dancing', 'Medicine', 'Traveling', 'Reading', 'Cooking', 'Volunteering'],
    strengths: ['Compassionate', 'Dedicated', 'Energetic', 'Intelligent'],
    occupation: 'Pediatric Doctor',
    education: 'Medicine, Harvard Medical School',
    height: '5ft 5in',
    bodyType: 'Fit',
    smokingStatus: 'Non-smoker',
    drinkingStatus: 'Social drinker',
    religion: 'Catholic',
    politicalViews: 'Moderate',
    languages: ['English', 'Spanish', 'Portuguese'],
    whatAmILookingFor: {
      relationshipType: 'Serious Relationship',
      personality: ['Intelligent', 'Kind', 'Ambitious', 'Family-oriented'],
      activities: ['Dancing', 'Traveling', 'Fine dining', 'Cultural events'],
      qualities: ['Honesty', 'Ambition', 'Compassion', 'Sense of humor'],
      communicationStyle: 'Open, honest, and supportive communication.',
      physicalAttraction: 'Someone who takes care of themselves and values health.',
    },
    location: {
      city: 'Miami',
      state: 'FL',
      country: 'USA',
      latitude: 25.7617,
      longitude: -80.1918,
    },
    socialMediaLinks: { 
      instagram: 'https://instagram.com/sophiamartinez',
      linkedin: 'https://linkedin.com/in/sophiamartinez',
    },
    preferences: {
      ageRange: { min: 28, max: 40 },
      gender: 'Male',
      distance: 45,
    },
    isVerified: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    profileCompleteness: 96,
    likes: 89,
    dislikes: 2,
    matches: 22,
    views: 278,
    lastOnline: '2025-10-18T19:45:00Z',
    joinedDate: '2025-05-12T08:30:00Z',
    accountStatus: 'Active',
    subscription: 'Premium',
  },
];

// For backward compatibility with existing code
export const demoData = demoUsers;
