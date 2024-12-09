import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyTabs from './TabNavigator';
import AddEditRecipeScreen from '../screens/AddEditRecipeScreen';
import RecipeDetailsScreen from '../screens/RecipeDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { ThemeContext } from '../contexts/ThemeContext';

const Stack = createNativeStackNavigator();

function MainNavigator() {
  const { theme } = useContext(ThemeContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.BACKGROUND_COLOR, // Header background color
        },
        headerTintColor: theme.TEXT_COLOR, // Header text color
        headerTitleStyle: {
          fontWeight: 'bold',
          color: theme.TEXT_COLOR, // Explicitly set title color
        },
        headerShadowVisible: false, // Optional: Remove shadow for cleaner UI
      }}
    >
      <Stack.Screen
        name='Tabs'
        component={MyTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='RecipeDetails'
        component={RecipeDetailsScreen}
        options={{
          title: 'Recipe Details',
          headerAccessibilityLabel: 'Recipe Details Screen Header',
          headerAccessibilityHint:
            'Displays detailed information about a recipe',
        }}
      />
      <Stack.Screen
        name='AddEditRecipe'
        component={AddEditRecipeScreen}
        options={{
          title: 'Add or Edit Recipe',
          headerAccessibilityLabel: 'Add or Edit Recipe Screen Header',
          headerAccessibilityHint: 'Allows you to add or edit a recipe',
        }}
      />
      <Stack.Screen
        name='Settings'
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerAccessibilityLabel: 'Settings Screen Button',
          headerAccessibilityHint: 'Allows you to edit app settings',
        }}
      />
    </Stack.Navigator>
  );
}

export default MainNavigator;
