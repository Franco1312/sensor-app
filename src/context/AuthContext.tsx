/**
 * AuthContext - Authentication context for managing user session
 */

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser, logout as logoutApi, getRefreshToken, clearTokens } from '@/services/auth-api';
import type { User, LoginResponse } from '@/services/auth-api';
import { STORAGE_KEYS } from '@/services/auth-api/config';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginResponse: LoginResponse) => Promise<void>;
  logout: (revokeAll?: boolean) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load user from storage and verify token
   */
  const loadUser = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      const refreshToken = await getRefreshToken();

      if (storedUser && refreshToken) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);

        // Try to refresh user data from API to verify token is still valid
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
          await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
        } catch (error) {
          // Token might be expired, clear storage
          console.warn('Failed to refresh user data, clearing session:', error);
          await clearTokens();
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
      await clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  /**
   * Login user and store session
   */
  const login = useCallback(async (loginResponse: LoginResponse) => {
    try {
      // Store user data
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loginResponse.user));
      setUser(loginResponse.user);
    } catch (error) {
      console.error('Error storing user data:', error);
      throw error;
    }
  }, []);

  /**
   * Logout user and clear session
   */
  const logout = useCallback(async (revokeAll: boolean = false) => {
    try {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        try {
          await logoutApi(refreshToken, revokeAll);
        } catch (error) {
          // Even if logout API fails, clear local storage
          console.warn('Logout API call failed, clearing local storage anyway:', error);
        }
      }
      await clearTokens();
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      // Clear storage anyway
      await clearTokens();
    setUser(null);
    }
  }, []);

  /**
   * Refresh user data from API
   */
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } catch (error) {
      console.error('Error refreshing user:', error);
      // If refresh fails, might be due to expired token
      // The httpClient will handle token refresh automatically
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
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
