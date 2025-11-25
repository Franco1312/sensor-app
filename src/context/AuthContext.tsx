/**
 * AuthContext - Authentication context for managing user session
 * Mock implementation for now
 */

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check for stored session on mount (mock - in real app would check AsyncStorage)
  useEffect(() => {
    // Mock: Check if user is logged in
    // In real app: const storedUser = await AsyncStorage.getItem('user');
    // For now, user starts as null (logged out)
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    // TODO: Store token in AsyncStorage
    // await AsyncStorage.setItem('token', token);
    // await AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    // TODO: Clear AsyncStorage
    // await AsyncStorage.removeItem('token');
    // await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

