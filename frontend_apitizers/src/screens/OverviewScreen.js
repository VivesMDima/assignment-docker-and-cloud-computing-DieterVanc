import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { fetchRecipes, fetchCategories } from '../services/api';
import { ThemeContext } from '../contexts/ThemeContext';
import RecipeCard from '../components/RecipeCard';
import { useFocusEffect } from '@react-navigation/native';

export default function OverviewScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const { width: screenWidth } = useWindowDimensions();

  let numColumns = 1;
  if (screenWidth > 800) {
    numColumns = 3;
  } else if (screenWidth > 600) {
    numColumns = 2;
  }

  const horizontalSpacing = 10;
  const containerPadding = 50;
  const availableWidth = screenWidth - containerPadding;
  const itemWidth =
    (availableWidth - (numColumns - 1) * horizontalSpacing) / numColumns;

  useFocusEffect(
    React.useCallback(() => {
      const loadInitialData = async () => {
        try {
          const fetchedRecipes = await fetchRecipes();
          const fetchedCategories = await fetchCategories();

          setRecipes(fetchedRecipes);
          // setFilteredRecipes(fetchedRecipes);
          setCategories(
            fetchedCategories.map((category) => ({
              id: category.id,
              name: category.name,
            }))
          );
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      loadInitialData();
    }, [])
  );

  useEffect(() => {
    handleSearch(searchQuery);
  }, [recipes]);

  const handleSearch = (query) => {
    setSearchQuery(query);

    const baseRecipes =
      selectedCategory === null
        ? recipes
        : recipes.filter((recipe) => recipe.categoryName === selectedCategory);

    if (query === '') {
      setFilteredRecipes(baseRecipes);
    } else {
      const filtered = baseRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }
  };

  const handleCategorySelect = (categoryName) => {
    if (categoryName === selectedCategory) {
      setSelectedCategory(null);
      setFilteredRecipes(
        searchQuery === ''
          ? recipes
          : recipes.filter((recipe) =>
              recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
      );
    } else {
      setSelectedCategory(categoryName);
      const filteredByCategory = recipes.filter(
        (recipe) => recipe.categoryName === categoryName
      );
      setFilteredRecipes(
        searchQuery === ''
          ? filteredByCategory
          : filteredByCategory.filter((recipe) =>
              recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
      );
    }
    setIsDropdownVisible(false);
  };

  // Create the dynamic stylesheet after theme is available
  const styles = createStyles(theme, itemWidth, numColumns, horizontalSpacing);

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
      <View style={styles.header}>
        <TextInput
          style={styles.searchBar}
          placeholder='Search recipes...'
          placeholderTextColor={theme.SECONDARY_COLOR}
          value={searchQuery}
          onChangeText={handleSearch}
          accessible={true}
          accessibilityLabel='Search recipes'
          accessibilityHint='Enter keywords to search recipes'
          accessibilityRole='search'
          accessibilityState={{ busy: filteredRecipes.length === 0 }}
        />
        <Pressable
          style={styles.filterIconContainer}
          onPress={() => setIsDropdownVisible(!isDropdownVisible)}
          accessible={true}
          accessibilityLabel='Filter recipes'
          accessibilityHint='Opens category filter menu'
          accessibilityRole='button'
        >
          <Icon name='filter' size={24} color={theme.PRIMARY_COLOR} />
        </Pressable>
      </View>

      {isDropdownVisible && (
        <View style={styles.dropdownMenu}>
          {categories.map((category) => (
            <Pressable
              key={category.id}
              style={[
                styles.dropdownItem,
                selectedCategory === category.name && {
                  backgroundColor: theme.PRIMARY_COLOR,
                },
              ]}
              onPress={() => handleCategorySelect(category.name)}
              accessible={true}
              accessibilityLabel={category.name}
              accessibilityHint={`Filter recipes by ${category.name} category`}
              accessibilityRole='button'
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  {
                    color:
                      selectedCategory === category.name
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

      <FlatList
        key={numColumns}
        data={filteredRecipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

function createStyles(theme, itemWidth, numColumns, horizontalSpacing) {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: theme.BACKGROUND_COLOR,
    },
    flatListContent: {
      flexGrow: 1,
      paddingRight: 15,
      alignItems: 'center',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    searchBar: {
      flex: 1,
      height: 40,
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      color: theme.TEXT_COLOR,
      borderColor: theme.SECONDARY_COLOR,
      backgroundColor: theme.BACKGROUND_COLOR,
    },
    filterIconContainer: {
      marginLeft: 10,
      padding: 10,
    },
    dropdownMenu: {
      position: 'absolute',
      top: 60,
      right: 40,
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
    list: {
      // no special justifyContent here; handled by columnWrapperStyle
    },
  });
}
