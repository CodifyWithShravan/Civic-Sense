import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CitizenNode } from '@/types/api';

interface AuthContextType {
  user: CitizenNode;
  isAuthenticated: boolean;
  currentScreen: 'login' | 'register' | 'app';
  setScreen: (screen: 'login' | 'register' | 'app') => void;
  login: (residentIdOrEmail?: string, passcode?: string) => Promise<boolean>;
  register: (userData: Partial<CitizenNode>) => Promise<boolean>;
  logout: () => void;
  updateUserPreferences: (prefs: Partial<CitizenNode>) => void;
}

const defaultCitizen: CitizenNode = {
  name: 'Shravan',
  nodeId: 'Node #8192-A',
  ward: 'Ward 04 — Mission/SoMa Corridor',
  district: 'South of Market / GHMC Sector',
  consensusScore: 98,
  phoneOrEmail: 'alex.chen@civicmail.org',
  alertsEnabled: true,
  consensusProtocolEnabled: true,
  version: 'v2.4',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CitizenNode>(defaultCitizen);
  // Default to authenticated so user can immediately experience the dashboard,
  // while retaining seamless switching to Login and Register views
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register' | 'app'>('app');

  const login = async (residentIdOrEmail?: string, _passcode?: string): Promise<boolean> => {
    const displayName = residentIdOrEmail ? residentIdOrEmail.split('@')[0] : 'Shravan';
    setUser((prev) => ({
      ...prev,
      name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      phoneOrEmail: residentIdOrEmail || prev.phoneOrEmail,
    }));
    setIsAuthenticated(true);
    setCurrentScreen('app');
    return true;
  };

  const register = async (userData: Partial<CitizenNode>): Promise<boolean> => {
    setUser((prev) => ({
      ...prev,
      ...userData,
      name: userData.name || prev.name,
      ward: userData.ward || prev.ward,
      phoneOrEmail: userData.phoneOrEmail || prev.phoneOrEmail,
    }));
    setIsAuthenticated(true);
    setCurrentScreen('app');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentScreen('login');
  };

  const updateUserPreferences = (prefs: Partial<CitizenNode>) => {
    setUser((prev) => ({ ...prev, ...prefs }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        currentScreen,
        setScreen: setCurrentScreen,
        login,
        register,
        logout,
        updateUserPreferences,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
