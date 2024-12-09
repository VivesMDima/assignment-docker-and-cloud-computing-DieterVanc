import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

export default function RecipeCard({
  item,
  theme,
  itemWidth,
  numColumns,
  horizontalSpacing,
  onPress,
}) {
  const isLastInRow = item.index % numColumns === numColumns - 1;
  const styles = createStyles(theme);

  return (
    <Pressable
      style={[
        styles.recipeContainer,
        {
          width: itemWidth,
          marginRight: isLastInRow ? 0 : horizontalSpacing,
        },
      ]}
      onPress={onPress}
      accessible={true}
      accessibilityRole='button'
      accessibilityLabel={`${item.name}, ${item.categoryName}`}
      accessibilityHint='Tap to view recipe details.'
    >
      <Image
        source={{
          uri: item.image ? item.image : 'https://via.placeholder.com/150',
        }}
        style={styles.recipeImage}
        accessible={true}
        accessibilityRole='image'
        accessibilityLabel={
          item.image ? `${item.name} image` : 'Placeholder image'
        }
      />
      <View style={styles.recipeContent}>
        <Text style={styles.recipeCategory} accessibilityRole='text'>
          {item.categoryName}
        </Text>
        <Text style={styles.recipeTitle} accessibilityRole='header'>
          {item.name}
        </Text>
        {item.isFavorite && (
          <Icon2
            name='favorite'
            size={20}
            style={styles.favoriteIcon}
            accessible={true}
            accessibilityRole='image'
            accessibilityLabel='Favorite icon'
            accessibilityHint='Indicates this recipe is a favorite.'
          />
        )}
      </View>
    </Pressable>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    recipeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.CARD_BACKGROUND,
      borderRadius: 15,
      marginBottom: 15,
      padding: 15,
      shadowColor: theme.SHADOW_COLOR,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    recipeImage: {
      width: 80,
      height: 80,
      borderRadius: 15,
      marginRight: 10,
    },
    recipeContent: {
      flex: 1,
      justifyContent: 'center',
    },
    recipeCategory: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.PRIMARY_COLOR,
    },
    recipeTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.TEXT_COLOR,
    },
    favoriteIcon: {
      position: 'absolute',
      color: theme.FAVORITE_ICON,
      top: 5,
      right: 5,
    },
  });
}
