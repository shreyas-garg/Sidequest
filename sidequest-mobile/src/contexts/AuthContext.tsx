import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  interests: string[];
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isSignedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string, bio: string, interests: string[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore token on app start
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const savedToken = await SecureStore.getItemAsync('authToken');
        if (savedToken) {
          setToken(savedToken);
          // Fetch user profile
          const response = await authService.getProfile();
          setUser(response.data);
        }
      } catch (error) {
        console.log('Error restoring token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      const { token: newToken, user: userData } = response.data;

      await SecureStore.setItemAsync('authToken', newToken);
      setToken(newToken);
      setUser(userData);
    } catch (error: any) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      console.log('Attempting registration with:', { name, email });
      const response = await authService.register(name, email, password);
      console.log('Registration response:', response.data);
      const { token: newToken, user: userData } = response.data;

      await SecureStore.setItemAsync('authToken', newToken);
      setToken(newToken);
      setUser(userData);
    } catch (error: any) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  const updateProfile = async (name: string, bio: string, interests: string[]) => {
    try {
      const response = await authService.updateProfile(name, bio, interests);
      setUser(response.data.user);
    } catch (error: any) {
      throw error.response?.data?.message || 'Profile update failed';
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isSignedIn: !!token,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
