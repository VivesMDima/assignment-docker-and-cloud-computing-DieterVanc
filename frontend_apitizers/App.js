import React, { useContext, useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator';
import { ProfileProvider } from './src/contexts/ProfileContext';
import { ThemeProvider, ThemeContext } from './src/contexts/ThemeContext';
import { StatusBar } from 'react-native';

export default function App() {
  return (
    <ProfileProvider>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </ProfileProvider>
  );
}

function ThemedApp() {
  const { theme, isDarkMode } = useContext(ThemeContext);

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.BACKGROUND_COLOR,
      text: theme.TEXT_COLOR,
      primary: theme.PRIMARY_COLOR,
      border: theme.SECONDARY_COLOR,
    },
  };

  useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
    StatusBar.setBackgroundColor(theme.BACKGROUND_COLOR);
  }, [isDarkMode, theme.BACKGROUND_COLOR]);

  return (
    <NavigationContainer theme={navigationTheme}>
      <MainNavigator />
    </NavigationContainer>
  );
}
