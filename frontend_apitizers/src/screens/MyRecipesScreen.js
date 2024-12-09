import React, { useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchRecipes } from '../services/api';
import { useProfile } from '../contexts/ProfileContext';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from '../contexts/ThemeContext';
import RecipeCard from '../components/RecipeCard';

export default function MyRecipesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const { profile } = useProfile();
  const { theme } = useContext(ThemeContext);

  const { width: screenWidth } = useWindowDimensions();
  const numColumns = screenWidth > 800 ? 3 : screenWidth > 600 ? 2 : 1;
  const horizontalSpacing = 10;
  const containerPadding = 20;
  const availableWidth = screenWidth - containerPadding;
  const itemWidth =
    (availableWidth - (numColumns - 1) * horizontalSpacing) / numColumns;

  const styles = createStyles(theme);

  const loadFavorites = async () => {
    try {
      const fetchedRecipes = await fetchRecipes();
      const favoriteRecipes = fetchedRecipes.filter(
        (recipe) => recipe.isFavorite
      );
      setFavorites(favoriteRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const renderRecipe = ({ item, index }) => (
    <RecipeCard
      item={{ ...item, index }}
      theme={theme}
      itemWidth={itemWidth}
      numColumns={numColumns}
      horizontalSpacing={horizontalSpacing}
      onPress={() =>
        navigation.navigate('RecipeDetails', { recipeId: item.id })
      }
    />
  );

  return (
    <View style={styles.container}>
      {/* Settings Icon */}
      <Pressable
        style={styles.settingsIcon}
        onPress={() => navigation.navigate('Settings')}
        accessible={true}
        accessibilityRole='button'
        accessibilityLabel='Settings'
        accessibilityHint='Opens the settings screen'
      >
        <Icon name='gear' size={24} color={theme.SECONDARY_COLOR} />
      </Pressable>

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: profile.profilePicture
              ? profile.profilePicture
              : 'https://via.placeholder.com/100',
          }}
          style={styles.profilePicture}
          accessible={true}
          accessibilityRole='image'
          accessibilityLabel={
            profile.profilePicture
              ? `${profile.name}'s profile picture`
              : 'Default profile picture'
          }
        />
        <Text
          style={styles.greeting}
          accessible={true}
          accessibilityRole='text'
        >
          {profile.name ? `${profile.name}` : 'Heya Stranger'}
        </Text>
        <Pressable
          style={styles.addBanner}
          onPress={() => navigation.navigate('AddEditRecipe')}
          accessible={true}
          accessibilityRole='button'
          accessibilityLabel='Add your recipe'
          accessibilityHint='Navigates to the screen where you can add or edit recipes'
        >
          <Text style={styles.addBannerText}>Add Your Recipe</Text>
        </Pressable>
      </View>

      {/* Favorites (Likes) Section */}
      <Text
        style={styles.likesTitle}
        accessible={true}
        accessibilityRole='header'
        accessibilityLabel='Likes section'
      >
        Likes
      </Text>
      <FlatList
        key={numColumns}
        data={favorites}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.flatListContent}
        accessible={true}
        accessibilityRole='list'
        accessibilityLabel='List of liked recipes'
        accessibilityHint='Swipe through the list to see your liked recipes'
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      position: 'relative',
      backgroundColor: theme.BACKGROUND_COLOR,
    },
    flatListContent: {
      flexGrow: 1,
      paddingRight: 20, // Add padding to push scrollbar outside
      alignItems: 'center', // Center items horizontally
    },
    settingsIcon: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 10,
      padding: 10,
    },
    profileContainer: {
      alignItems: 'center',
      marginTop: 20,
    },
    profilePicture: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 5,
      borderWidth: 1,
      borderColor: theme.SECONDARY_COLOR,
    },
    greeting: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color: theme.TEXT_COLOR,
    },
    addBanner: {
      paddingVertical: 12,
      borderRadius: 5,
      width: '95%',
      alignItems: 'center',
      marginTop: 10,
      backgroundColor: theme.PRIMARY_COLOR,
    },
    addBannerText: {
      fontSize: 14,
      color: '#000',
    },
    likesTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 10,
      color: theme.TEXT_COLOR,
    },
  });
}
