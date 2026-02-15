'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from './types';
import { MOCK_USERS } from './data';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage (mock)
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - find user by email
      const user = MOCK_USERS.find((u) => u.email === email);
      if (!user) {
        throw new Error('User not found');
      }
      // In a real app, we'd verify the password
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, phone: string, password: string) => {
    setIsLoading(true);
    try {
      // Check if user already exists
      const existingUser = MOCK_USERS.find((u) => u.email === email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Create new user (mock)
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        phone,
        role: 'user',
        registrationDate: new Date().toISOString().split('T')[0],
      };

      setCurrentUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      // In a real app, we'd send this to the backend
      MOCK_USERS.push(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
