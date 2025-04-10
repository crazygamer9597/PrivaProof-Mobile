import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    card: string;
    border: string;
    error: string;
    success: string;
    input: string;
    placeholder: string;
  };
}

const lightColors = {
  background: '#F9F7F7',
  text: '#112D4E',
  primary: '#3F72AF',
  secondary: '#DBE2EF',
  card: '#FFFFFF',
  border: '#DBE2EF',
  error: '#ef4444',
  success: '#10b981',
  input: '#FFFFFF',
  placeholder: '#3F72AF',
};

const darkColors = {
  background: '#211C84',
  text: '#F9F7F7',
  primary: '#7A73D1',
  secondary: '#4D55CC',
  card: '#4D55CC',
  border: '#B5A8D5',
  error: '#ef4444',
  success: '#10b981',
  input: '#4D55CC',
  placeholder: '#B5A8D5',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Load saved theme from storage
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme as Theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 