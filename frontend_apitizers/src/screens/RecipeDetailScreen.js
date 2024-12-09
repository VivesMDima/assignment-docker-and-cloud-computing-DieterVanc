import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import {
  fetchRecipeById,
  toggleFavorite,
  fetchIngredientsByRecipeId,
} from '../services/api';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from '../contexts/ThemeContext';

export default function RecipeDetailsScreen({ route, navigation }) {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  // Function to load recipe and ingredients
  const loadRecipeData = async () => {
    try {
      const fetchedRecipe = await fetchRecipeById(recipeId);
      if (fetchedRecipe) {
        setRecipe(fetchedRecipe);
      }

      const fetchedIngredients = await fetchIngredientsByRecipeId(recipeId);
      setIngredients(fetchedIngredients);
    } catch (error) {
      console.error('Error fetching recipe data:', error);
    }
  };

  // Use useFocusEffect to reload data when the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      loadRecipeData();
    }, [recipeId])
  );

  useEffect(() => {
    if (recipe) {
      updateHeader(recipe.isFavorite);
    }
  }, [recipe]);

  const updateHeader = (isFavorite) => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPressIn={handleToggleFavorite}
          accessible={true}
          accessibilityRole='button'
          accessibilityLabel={
            isFavorite
              ? 'Remove recipe from favorites'
              : 'Add recipe to favorites'
          }
          accessibilityHint='Toggles the favorite status of the recipe'
        >
          <Icon
            name='heart'
            size={24}
            color={isFavorite ? theme.PRIMARY_COLOR : theme.SECONDARY_COLOR}
            style={{ marginRight: 15 }}
          />
        </Pressable>
      ),
    });
  };

  const handleToggleFavorite = async () => {
    if (!recipe) return;

    const updatedRecipe = await toggleFavorite(recipeId);
    if (updatedRecipe) {
      setRecipe(updatedRecipe);
    }
  };

  if (!recipe) {
    return (
      <Text
        style={styles.loadingText}
        accessible={true}
        accessibilityRole='text'
        accessibilityLabel='Loading recipe details'
      >
        Loading...
      </Text>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.descriptionContainer}>
        <Text
          style={styles.description}
          accessible={true}
          accessibilityRole='text'
          accessibilityLabel={`Recipe description: ${recipe.description}`}
        >
          {recipe.description}
        </Text>
        {recipe.isHealthy && (
          <View
            style={styles.healthyBadge}
            accessible={true}
            accessibilityRole='text'
            accessibilityLabel='This recipe is healthy'
          >
            <Text style={styles.healthyText}>Healthy</Text>
          </View>
        )}
      </View>
      <Image
        source={{
          uri: recipe.image ? recipe.image : 'https://via.placeholder.com/300',
        }}
        style={styles.image}
        accessible={true}
        accessibilityRole='image'
        accessibilityLabel={`Image of the recipe: ${recipe.description}`}
      />
      <Text
        style={styles.sectionTitle}
        accessible={true}
        accessibilityRole='header'
        accessibilityLabel='Ingredients section'
      >
        Ingredients
      </Text>
      <View
        style={styles.ingredientsList}
        accessible={true}
        accessibilityRole='list'
        accessibilityLabel='List of ingredients'
      >
        {ingredients.map((ingredient) => (
          <Text
            key={ingredient.ingredientId}
            style={styles.ingredientItem}
            accessible={true}
            accessibilityRole='text'
            accessibilityLabel={`Ingredient: ${ingredient.ingredientName}, quantity: ${ingredient.quantity}, unit: ${ingredient.unit}`}
          >
            - {ingredient.ingredientName} ({ingredient.quantity}{' '}
            {ingredient.unit})
          </Text>
        ))}
      </View>
      <Text
        style={styles.sectionTitle}
        accessible={true}
        accessibilityRole='header'
        accessibilityLabel='Instructions section'
      >
        Instructions
      </Text>
      <Text
        style={styles.instructions}
        accessible={true}
        accessibilityRole='text'
        accessibilityLabel={`Recipe instructions: ${recipe.instructions}`}
      >
        {recipe.instructions}
      </Text>
      <Pressable
        style={styles.editButton}
        onPress={() => navigation.navigate('AddEditRecipe', { recipeId })}
        accessible={true}
        accessibilityRole='button'
        accessibilityLabel='Edit Recipe'
        accessibilityHint='Navigates to the edit recipe screen'
      >
        <Text style={styles.editButtonText}>Edit Recipe</Text>
      </Pressable>
    </ScrollView>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.BACKGROUND_COLOR,
    },
    descriptionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    description: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'left',
      flex: 1,
      marginRight: 10,
      color: theme.TEXT_COLOR,
    },
    healthyBadge: {
      padding: 5,
      borderRadius: 5,
      backgroundColor: theme.PRIMARY_COLOR,
    },
    healthyText: {
      fontWeight: 'bold',
      color: theme.BACKGROUND_COLOR,
    },
    image: {
      width: 300,
      height: 300,
      alignSelf: 'center',
      borderRadius: 10,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
      color: theme.TEXT_COLOR,
    },
    ingredientsList: {
      marginBottom: 20,
    },
    ingredientItem: {
      fontSize: 16,
      marginBottom: 5,
      color: theme.SECONDARY_COLOR,
    },
    instructions: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 20,
      color: theme.SECONDARY_COLOR,
    },
    editButton: {
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 40,
      backgroundColor: theme.PRIMARY_COLOR,
    },
    editButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.TEXT_COLOR,
    },
    loadingText: {
      textAlign: 'center',
      marginTop: 50,
      color: theme.TEXT_COLOR,
    },
  });
}
