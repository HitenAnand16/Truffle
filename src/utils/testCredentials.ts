// Test credentials for API testing
// These are dummy credentials used for testing the invite API
// DO NOT use real user credentials here

export const TEST_CREDENTIALS = {
  emails: [
    'test1@truffle.com',
    'test2@truffle.com', 
    'test3@truffle.com',
    'test4@truffle.com',
    'test5@truffle.com',
    'user1@truffleapp.com',
    'user2@truffleapp.com',
    'user3@truffleapp.com',
    'demo1@truffle.test',
    'demo2@truffle.test',
  ],
  phones: [
    '+918130541401',
    '+918130541402',
    '+918130541403', 
    '+918130541404',
    '+918130541405',
    '+919876543201',
    '+919876543202',
    '+919876543203',
    '+917890123401',
    '+917890123402',
  ]
};

// Function to get a random test email
export const getRandomTestEmail = (): string => {
  const randomIndex = Math.floor(Math.random() * TEST_CREDENTIALS.emails.length);
  return TEST_CREDENTIALS.emails[randomIndex];
};

// Function to get a random test phone
export const getRandomTestPhone = (): string => {
  const randomIndex = Math.floor(Math.random() * TEST_CREDENTIALS.phones.length);
  return TEST_CREDENTIALS.phones[randomIndex];
};

// Function to generate a unique test email with timestamp
export const generateUniqueTestEmail = (): string => {
  const timestamp = Date.now();
  return `test${timestamp}@truffle.com`;
};

// Function to generate a unique test phone with timestamp
export const generateUniqueTestPhone = (): string => {
  const timestamp = Date.now();
  const lastFourDigits = timestamp.toString().slice(-4);
  return `+9181305${lastFourDigits}`;
};
