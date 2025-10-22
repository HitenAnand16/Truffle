import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface RegistrationData {
  // From RegisterScreen
  name: string;
  age: string;
  sex: string;
  
  // From EmailVerification
  email: string;
  phone: string;
  
  // From Detail
  instagram: string;
  occupation: string;
  description: string;
  
  // From UploadPicRegister
  picture: string | null;
}

interface RegistrationContextType {
  registrationData: RegistrationData;
  updateRegistrationData: (data: Partial<RegistrationData>) => void;
  resetRegistrationData: () => void;
}

const initialRegistrationData: RegistrationData = {
  name: '',
  age: '',
  sex: '',
  email: '',
  phone: '',
  instagram: '',
  occupation: '',
  description: '',
  picture: null,
};

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
};

interface RegistrationProviderProps {
  children: ReactNode;
}

export const RegistrationProvider: React.FC<RegistrationProviderProps> = ({ children }) => {
  const [registrationData, setRegistrationData] = useState<RegistrationData>(initialRegistrationData);

  const updateRegistrationData = (data: Partial<RegistrationData>) => {
    setRegistrationData(prev => ({ ...prev, ...data }));
  };

  const resetRegistrationData = () => {
    setRegistrationData(initialRegistrationData);
  };

  const value = {
    registrationData,
    updateRegistrationData,
    resetRegistrationData,
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
};
