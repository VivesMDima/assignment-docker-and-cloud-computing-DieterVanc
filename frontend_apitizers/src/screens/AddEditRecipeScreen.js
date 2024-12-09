import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  Pressable,
  Platform,
} from 'react-native';
import {
  fetchRecipeById,
  fetchCategories,
  fetchIngredientsByRecipeId,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../services/api';
import * as ImagePicker from 'expo-image-picker';
import * as Yup from 'yup';
import { ThemeContext } from '../contexts/ThemeContext';
import { AccessibilityInfo } from 'react-native';

const recipeValidationSchema = Yup.object().shape({
  name: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  instructions: Yup.string(), // Optional field
  recipeIngredients: Yup.array().of(
    Yup.object().shape({
      ingredientName: Yup.string().required('Ingredient name is required'),
      quantity: Yup.number()
        .transform((value, originalValue) => {
          return originalValue === '' ? undefined : value;
        })
        .typeError('Quantity must be a number')
        .required('Quantity is required'),
      unit: Yup.string().nullable(),
    })
  ),
});

export default function AddEditRecipeScreen({ route, navigation }) {
  const { recipeId } = route.params || {};
  const [recipe, setRecipe] = useState(null);
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const { theme } = useContext(ThemeContext);

  const styles = createStyles(theme);

  const showAlert = (title, message) => {
    const fullMessage = `${title ? title + ': ' : ''}${message}`;

    if (Platform.OS === 'web') {
      window.alert(fullMessage);
    } else {
      Alert.alert(title, message);
    }
    // Announce the message for accessibility
    AccessibilityInfo.announceForAccessibility(fullMessage);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);

        if (recipeId) {
          const fetchedRecipe = await fetchRecipeById(recipeId);
          setRecipe({ ...fetchedRecipe, categoryId: undefined });

          const fetchedIngredients = await fetchIngredientsByRecipeId(recipeId);
          const formattedIngredients = fetchedIngredients.map((ingredient) => ({
            ingredientName: ingredient.ingredientName || '',
            quantity:
              ingredient.quantity !== null
                ? ingredient.quantity.toString()
                : '',
            unit: ingredient.unit || '',
          }));

          setIngredients(formattedIngredients);
        } else {
          setRecipe({
            name: '',
            description: '',
            instructions: '',
            isHealthy: false,
            categoryId: 1,
            image: null,
          });
          setIngredients([
            { ingredientName: '', quantity: '', unit: '' },
            { ingredientName: '', quantity: '', unit: '' },
            { ingredientName: '', quantity: '', unit: '' },
          ]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [recipeId]);

  // Map categoryName to categoryId after categories are loaded
  useEffect(() => {
    if (recipe && recipe.categoryName && categories.length > 0) {
      const category = categories.find(
        (cat) => cat.name === recipe.categoryName
      );
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        categoryId: category ? category.id : categories[0]?.id,
      }));
    }
  }, [categories, recipe?.categoryName]);

  const handleImageChange = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.Image,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      console.log('ImagePicker result:', result);

      if (!result.canceled) {
        const selectedImage = result.assets[0];

        if (
          Platform.OS === 'web' &&
          selectedImage.uri.startsWith('data:image')
        ) {
          // Web: Convert Base64 URI to Blob
          const response = await fetch(selectedImage.uri);
          const blob = await response.blob();

          setRecipe({
            ...recipe,
            image: {
              uri: selectedImage.uri,
              type: blob.type,
              fileName: `recipe_${Date.now()}.jpg`, // Provide a file name
              blob, // Store the Blob object for FormData
            },
          });
        } else {
          // Mobile: Use the file URI directly
          setRecipe({
            ...recipe,
            image: {
              uri: selectedImage.uri,
              type: selectedImage.mimeType || 'image/jpeg',
              fileName: selectedImage.fileName || `recipe_${Date.now()}.jpg`,
            },
          });
        }
      }
    } catch (error) {
      console.error('Error during image selection:', error);
      showAlert('Error', 'Failed to select an image.');
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const addIngredientField = () => {
    setIngredients([
      ...ingredients,
      { ingredientName: '', quantity: '', unit: '' },
    ]);
  };

  const handleSave = async () => {
    try {
      const formattedIngredients = ingredients
        .filter((item) => item.ingredientName)
        .map((item) => ({
          ingredientName: item.ingredientName,
          quantity: item.quantity,
          unit: item.unit || null,
        }));

      const newRecipe = {
        name: recipe.name,
        description: recipe.description,
        instructions: recipe.instructions,
        isHealthy: recipe.isHealthy || false,
        isFavorite: recipe.isFavorite || true,
        categoryId: recipe.categoryId || 1,
        recipeIngredients: formattedIngredients,
      };

      await recipeValidationSchema.validate(newRecipe, { abortEarly: false });

      let savedRecipe;
      if (recipeId) {
        savedRecipe = await updateRecipe(recipeId, newRecipe, recipe.image);
        showAlert('Success', 'Recipe updated successfully!');
      } else {
        savedRecipe = await createRecipe(newRecipe, recipe.image);
        showAlert('Success', 'Recipe created successfully!');
      }

      navigation.goBack();
    } catch (error) {
      if (error.name === 'ValidationError') {
        showAlert('', error.errors.join('\n'));
      } else {
        console.error('Error saving recipe:', error);
        showAlert('Error', 'Failed to save recipe.');
      }
    }
  };

  const confirmDeletion = async () => {
    if (Platform.OS === 'web') {
      return window.confirm('Are you sure you want to delete this recipe?');
    } else {
      return await new Promise((resolve) =>
        Alert.alert(
          'Delete Recipe',
          'Are you sure you want to delete this recipe?',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Delete', onPress: () => resolve(true) },
          ]
        )
      );
    }
  };

  const handleDelete = async () => {
    try {
      const confirm = await confirmDeletion();

      if (confirm) {
        console.log('Deleting recipe with ID:', recipeId);
        const success = await deleteRecipe(recipeId);

        if (success) {
          showAlert('Success', 'Recipe deleted successfully!');
          navigation.popToTop(); // Navigate back
        } else {
          showAlert('Error', 'Failed to delete the recipe.');
        }
      } else {
        console.log('Delete operation cancelled.');
      }
    } catch (error) {
      console.error('Error during recipe deletion:', error);
      showAlert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              recipe?.image?.uri ||
              recipe?.image ||
              'https://via.placeholder.com/150',
          }}
          style={styles.image}
        />
      </View>

      <Pressable
        onPress={handleImageChange}
        style={styles.imagePicker}
        accessible={true}
        accessibilityRole='button'
        accessibilityLabel={
          recipe?.image ? 'Change recipe image' : 'Pick a recipe image'
        }
        accessibilityHint='Opens the image library to select or change the recipe image'
      >
        <Text style={styles.imagePickerText}>
          {recipe?.image ? 'Change Image' : 'Pick an Image'}
        </Text>
      </Pressable>

      <TextInput
        style={styles.input}
        placeholder='Title'
        placeholderTextColor={theme.SECONDARY_COLOR}
        value={recipe?.name || ''}
        onChangeText={(text) => setRecipe({ ...recipe, name: text })}
        accessible={true}
        accessibilityLabel='Recipe Title'
        accessibilityHint='Enter the title for your recipe'
      />

      <TextInput
        style={styles.input}
        placeholder='Description'
        placeholderTextColor={theme.SECONDARY_COLOR}
        value={recipe?.description || ''}
        onChangeText={(text) => setRecipe({ ...recipe, description: text })}
        accessible={true}
        accessibilityLabel='Recipe Description'
        accessibilityHint='Enter a brief description for your recipe'
      />

      <View style={styles.toggleContainer}>
        <Text
          style={styles.toggleLabel}
          accessible={true}
          accessibilityRole='text'
        >
          Healthy Recipe?
        </Text>
        <Switch
          value={recipe?.isHealthy}
          onValueChange={(value) => setRecipe({ ...recipe, isHealthy: value })}
          thumbColor={theme.PRIMARY_COLOR}
          trackColor={{
            false: theme.SECONDARY_COLOR,
            true: theme.PRIMARY_COLOR,
          }}
          accessible={true}
          accessibilityRole='switch'
          accessibilityLabel='Healthy Recipe Toggle'
          accessibilityHint='Indicates whether this recipe is healthy'
        />
      </View>

      <Text style={styles.sectionTitle}>Category:</Text>
      <Pressable
        style={styles.filterIconContainer}
        onPress={() => setIsDropdownVisible(!isDropdownVisible)}
        accessible={true}
        accessibilityRole='button'
        accessibilityLabel='Recipe Category'
        accessibilityHint='Tap to select a category for this recipe'
      >
        <Text style={styles.dropdownTriggerText}>
          {categories.find((cat) => cat.id === recipe?.categoryId)?.name ||
            'Select Category'}
        </Text>
      </Pressable>

      {isDropdownVisible && (
        <View
          style={styles.dropdownMenu}
          accessible={true}
          accessibilityRole='menu'
        >
          {categories.map((category) => (
            <Pressable
              key={category.id}
              style={[
                styles.dropdownItem,
                recipe?.categoryId === category.id && {
                  backgroundColor: theme.PRIMARY_COLOR,
                },
              ]}
              onPress={() => {
                setRecipe((prevRecipe) => ({
                  ...prevRecipe,
                  categoryId: category.id,
                }));
                setIsDropdownVisible(false);
              }}
              accessible={true}
              accessibilityRole='menuitem'
              accessibilityLabel={category.name}
              accessibilityHint={`Select ${category.name} as the recipe category`}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  {
                    color:
                      recipe?.categoryId === category.id
                        ? theme.TEXT_COLOR_INVERSE
                        : theme.TEXT_COLOR,
                  },
                ]}
              >
                {category.name}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <Text style={styles.sectionTitle}>Ingredients</Text>
      {ingredients.map((ingredient, index) => (
        <View key={index} style={styles.ingredientRow}>
          <TextInput
            style={[styles.ingredientInput, { flex: 6 }]}
            placeholder='Ingredient Name'
            placeholderTextColor={theme.SECONDARY_COLOR}
            value={ingredient.ingredientName || ''}
            onChangeText={(text) =>
              handleIngredientChange(index, 'ingredientName', text)
            }
            accessible={true}
            accessibilityLabel={`Ingredient Name for item ${index + 1}`}
            accessibilityHint='Enter the name of the ingredient'
          />
          <TextInput
            style={[styles.ingredientInput, { flex: 2 }]}
            placeholder='Quantity'
            placeholderTextColor={theme.SECONDARY_COLOR}
            value={ingredient.quantity || ''}
            keyboardType='numeric'
            onChangeText={(text) =>
              handleIngredientChange(index, 'quantity', text)
            }
            accessible={true}
            accessibilityLabel={`Quantity for item ${index + 1}`}
            accessibilityHint='Enter the quantity of the ingredient'
          />
          <TextInput
            style={[styles.ingredientInput, { flex: 1 }]}
            placeholder='Unit'
            placeholderTextColor={theme.SECONDARY_COLOR}
            value={ingredient.unit || ''}
            onChangeText={(text) => handleIngredientChange(index, 'unit', text)}
            accessible={true}
            accessibilityLabel={`Unit for item ${index + 1}`}
            accessibilityHint='Enter the unit of measurement for the ingredient'
          />
        </View>
      ))}
      <Pressable
        onPress={addIngredientField}
        style={styles.addButton}
        accessible={true}
        accessibilityRole='button'
        accessibilityLabel='Add more ingredients'
        accessibilityHint='Adds a new ingredient input field'
      >
        <Text style={styles.addButtonText}>Add More Ingredients</Text>
      </Pressable>

      <Text
        style={styles.sectionTitle}
        accessible={true}
        accessibilityRole='header'
        accessibilityLabel='Instructions section'
      >
        Instructions
      </Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder='Instructions'
        multiline
        value={recipe?.instructions}
        onChangeText={(text) => setRecipe({ ...recipe, instructions: text })}
        accessible={true}
        accessibilityLabel='Recipe instructions'
        accessibilityHint='Enter detailed instructions for preparing the recipe'
      />

      <Pressable
        onPress={handleSave}
        style={styles.saveButton}
        accessible={true}
        accessibilityRole='button'
        accessibilityLabel='Save Recipe'
        accessibilityHint='Saves the recipe and navigates back to the previous screen'
      >
        <Text style={styles.saveButtonText}>Save Recipe</Text>
      </Pressable>
      {recipeId && (
        <Pressable
          onPress={handleDelete}
          style={styles.deleteButton}
          accessible={true}
          accessibilityRole='button'
          accessibilityLabel='Delete Recipe'
          accessibilityHint='Deletes this recipe and navigates back to the previous screen'
        >
          <Text style={styles.deleteButtonText}>Delete Recipe</Text>
        </Pressable>
      )}
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
    imagePicker: {
      alignItems: 'center',
      marginVertical: 20,
    },
    imagePickerText: {
      color: theme.PRIMARY_COLOR,
    },
    input: {
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      color: theme.TEXT_COLOR,
      borderColor: theme.SECONDARY_COLOR,
      backgroundColor: theme.BACKGROUND_COLOR,
    },
    toggleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 10,
    },
    toggleLabel: {
      color: theme.TEXT_COLOR,
    },
    imageContainer: {
      alignItems: 'center',
      marginVertical: 5,
    },
    image: {
      width: 150,
      height: 150,
      borderRadius: 10,
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 10,
      color: theme.TEXT_COLOR,
    },
    ingredientRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    ingredientInput: {
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginHorizontal: 5,
      flex: 1,
      color: theme.TEXT_COLOR,
      borderColor: theme.SECONDARY_COLOR,
      backgroundColor: theme.BACKGROUND_COLOR,
    },
    addButton: {
      alignItems: 'center',
      marginVertical: 10,
    },
    addButtonText: {
      color: theme.PRIMARY_COLOR,
    },
    saveButton: {
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginVertical: 20,
      backgroundColor: theme.PRIMARY_COLOR,
    },
    saveButtonText: {
      fontSize: 16,
      color: theme.BACKGROUND_COLOR,
    },
    deleteButton: {
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginVertical: 10,
      backgroundColor: 'red', // Adjust based on your theme
    },
    deleteButtonText: {
      fontSize: 16,
      color: '#fff', // White text
    },

    dropdownMenu: {
      position: 'absolute',
      top: 460, // Adjust based on placement
      left: 20, // Adjust based on placement
      maxWidth: 200, // Set a maximum width in pixels
      borderRadius: 5,
      borderWidth: 1,
      borderColor: theme.SECONDARY_COLOR,
      backgroundColor: theme.BACKGROUND_COLOR,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,
      zIndex: 1000,
    },
    dropdownItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderColor: theme.SECONDARY_COLOR,
    },
    dropdownItemText: {
      fontSize: 14,
    },
    filterIconContainer: {
      borderWidth: 1,
      borderColor: theme.SECONDARY_COLOR,
      borderRadius: 5,
      padding: 10,
      backgroundColor: theme.BACKGROUND_COLOR,
    },
    dropdownTriggerText: {
      color: theme.TEXT_COLOR,
    },
  });
}
