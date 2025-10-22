import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserActionsContextType {
  likedUsers: string[];
  dislikedUsers: string[];
  addLikedUser: (userId: string) => void;
  addDislikedUser: (userId: string) => void;
  isUserActioned: (userId: string) => boolean;
}

const UserActionsContext = createContext<UserActionsContextType | undefined>(undefined);

export const useUserActions = () => {
  const context = useContext(UserActionsContext);
  if (!context) {
    throw new Error('useUserActions must be used within a UserActionsProvider');
  }
  return context;
};

interface UserActionsProviderProps {
  children: ReactNode;
}

export const UserActionsProvider: React.FC<UserActionsProviderProps> = ({ children }) => {
  const [likedUsers, setLikedUsers] = useState<string[]>([]);
  const [dislikedUsers, setDislikedUsers] = useState<string[]>([]);

  const addLikedUser = (userId: string) => {
    setLikedUsers(prev => [...prev, userId]);
  };

  const addDislikedUser = (userId: string) => {
    setDislikedUsers(prev => [...prev, userId]);
  };

  const isUserActioned = (userId: string) => {
    return likedUsers.includes(userId) || dislikedUsers.includes(userId);
  };

  const value = {
    likedUsers,
    dislikedUsers,
    addLikedUser,
    addDislikedUser,
    isUserActioned,
  };

  return (
    <UserActionsContext.Provider value={value}>
      {children}
    </UserActionsContext.Provider>
  );
};
