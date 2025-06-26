import React, { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
  username: string;
  userId: string;
  setUsername: (username: string) => void;
  setUserId: (userId: string) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: React.ReactNode;
}

// localStorage keys
const USERNAME_KEY = 'scrum_poker_username';
const USER_ID_KEY = 'scrum_poker_user_id';

export const UserProvider = ({ children }: UserProviderProps) => {
  const [username, setUsernameState] = useState<string>("");
  const [userId, setUserIdState] = useState<string>("");

  // Load initial values from localStorage on mount
  useEffect(() => {
    try {
      const savedUsername = localStorage.getItem(USERNAME_KEY);
      const savedUserId = localStorage.getItem(USER_ID_KEY);
      
      console.log('🔍 Loading user data from localStorage:', { savedUsername, savedUserId });
      
      if (savedUsername) {
        setUsernameState(savedUsername);
      }
      
      if (savedUserId) {
        setUserIdState(savedUserId);
      }
    } catch (error) {
      console.error('Error loading user data from localStorage:', error);
    }
  }, []);

  const setUsername = (newUsername: string) => {
    console.log('💾 Saving username to localStorage:', newUsername);
    setUsernameState(newUsername);
    try {
      localStorage.setItem(USERNAME_KEY, newUsername);
    } catch (error) {
      console.error('Error saving username to localStorage:', error);
    }
  };

  const setUserId = (newUserId: string) => {
    console.log('💾 Saving userId to localStorage:', newUserId);
    setUserIdState(newUserId);
    try {
      localStorage.setItem(USER_ID_KEY, newUserId);
    } catch (error) {
      console.error('Error saving userId to localStorage:', error);
    }
  };

  const clearUser = () => {
    console.log('🗑️ Clearing user data from localStorage');
    setUsernameState("");
    setUserIdState("");
    try {
      localStorage.removeItem(USERNAME_KEY);
      localStorage.removeItem(USER_ID_KEY);
    } catch (error) {
      console.error('Error clearing user data from localStorage:', error);
    }
  };

  const value = {
    username,
    userId,
    setUsername,
    setUserId,
    clearUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
