"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, Usuario } from '@/lib/api';

interface AuthContextType {
  user: Usuario | null;
  sessionToken: string | null;
  isLoading: boolean;
  login: (accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  checkDomainRestriction: (email: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if email domain is allowed
  const checkDomainRestriction = (email: string): boolean => {
    return email.toLowerCase().endsWith('@uml.edu.ni');
  };

  // Verify if there's a saved session when the app loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedToken = localStorage.getItem('sessionToken');
        if (savedToken) {
          const response = await apiClient.getCurrentUser();
          if (response.success && response.data) {
            // Verify the user's email domain is still valid
            const userEmail = response.data.usuario.correo;
            if (checkDomainRestriction(userEmail)) {
              setUser(response.data.usuario);
              setSessionToken(savedToken);
            } else {
              // Domain no longer valid, clear session
              console.warn('User email domain no longer valid, clearing session');
              localStorage.removeItem('sessionToken');
            }
          } else {
            // Invalid token, clear it
            localStorage.removeItem('sessionToken');
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('sessionToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (accessToken: string) => {
    try {
      setIsLoading(true);
      
      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const email = payload.email;
      const name = payload.name;
      const picture = payload.picture;

      // Check domain restriction
      if (!checkDomainRestriction(email)) {
        throw new Error('Solo se permiten correos electrónicos de la Universidad Martin Lutero (@uml.edu.ni)');
      }

      // Call the API to login
      const response = await apiClient.login(accessToken);
      
      if (response.success && response.data) {
        setUser(response.data.usuario);
        setSessionToken(response.data.sessionToken);
        localStorage.setItem('sessionToken', response.data.sessionToken);
      } else {
        throw new Error(response.message || 'Error en el login');
      }
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Error in logout:', error);
      // Continue with logout even if API call fails
    } finally {
      setUser(null);
      setSessionToken(null);
      localStorage.removeItem('sessionToken');
    }
  };

  const value: AuthContextType = {
    user,
    sessionToken,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user && !!sessionToken,
    checkDomainRestriction,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 