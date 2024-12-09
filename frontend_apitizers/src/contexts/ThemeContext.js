import React, { createContext, useState, useEffect } from 'react';
import { lightTheme, darkTheme } from '../styles/theme.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(lightTheme); // Default theme
  const [isDarkMode, setIsDarkMode] = useState(false); // Track dark mode

  // Load theme preference from AsyncStorage
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      const isDark = savedTheme === 'dark';
      setIsDarkMode(isDark);
      setTheme(isDark ? darkTheme : lightTheme);
    };
    loadTheme();
  }, []);

  // Toggle theme between light and dark
  const toggleTheme = async () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    setTheme(newIsDarkMode ? darkTheme : lightTheme);
    await AsyncStorage.setItem('theme', newIsDarkMode ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
