import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OverviewScreen from '../screens/OverviewScreen';
import MyRecipesScreen from '../screens/MyRecipesScreen';
import { ThemeContext } from '../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { theme } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.BACKGROUND_COLOR,
          borderTopColor: theme.SECONDARY_COLOR,
        },
        tabBarActiveTintColor: theme.PRIMARY_COLOR,
        tabBarInactiveTintColor: theme.TEXT_COLOR,
        headerStyle: {
          backgroundColor: theme.BACKGROUND_COLOR, // Ensure header matches theme
        },
        headerTintColor: theme.TEXT_COLOR,
        headerTitleStyle: {
          color: theme.TEXT_COLOR,
        },
      }}
    >
      <Tab.Screen
        name='Overview'
        component={OverviewScreen}
        options={{
          title: 'Overview',
          tabBarIcon: ({ color }) => (
            <Icon name='list' size={24} color={color} />
          ),
          tabBarAccessibilityLabel: 'Overview',
          tabBarAccessibilityHint: 'Navigate to the overview screen',
        }}
      />
      <Tab.Screen
        name='MyRecipes'
        component={MyRecipesScreen}
        options={{
          title: 'My Recipes',
          tabBarIcon: ({ color }) => (
            <Icon name='book' size={24} color={color} />
          ),
          tabBarAccessibilityLabel: 'My Recipes',
          tabBarAccessibilityHint: 'Navigate to the my recipes screen',
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;
