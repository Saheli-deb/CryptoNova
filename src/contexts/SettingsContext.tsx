import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface AppSettings {
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'es' | 'fr' | 'de' | 'ja';
  notifications: {
    email: boolean;
    push: boolean;
    priceAlerts: boolean;
    portfolioUpdates: boolean;
    marketNews: boolean;
  };
  privacy: {
    dataCollection: boolean;
    analytics: boolean;
    marketing: boolean;
  };
}

export interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
  saveSettings: () => Promise<void>;
  isLoading: boolean;
}

const defaultSettings: AppSettings = {
  currency: 'USD',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  theme: 'system',
  language: 'en',
  notifications: {
    email: true,
    push: true,
    priceAlerts: true,
    portfolioUpdates: true,
    marketNews: false
  },
  privacy: {
    dataCollection: false,
    analytics: true,
    marketing: false
  }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load settings from localStorage on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      loadSettings();
    }
  }, [isAuthenticated, user]);

  // Apply theme changes
  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem(`settings_${user?.id}`);
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  };

  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => {
      const newSettings = { ...prev, ...updates };
      
      // Handle nested object updates
      if (updates.notifications) {
        newSettings.notifications = { ...prev.notifications, ...updates.notifications };
      }
      if (updates.privacy) {
        newSettings.privacy = { ...prev.privacy, ...updates.privacy };
      }
      
      return newSettings;
    });
  };

  const saveSettings = async (): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem(`settings_${user.id}`, JSON.stringify(settings));
      
      // TODO: Also save to backend API
      // await fetch('/api/user/settings', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify(settings)
      // });
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    resetSettings,
    saveSettings,
    isLoading
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
