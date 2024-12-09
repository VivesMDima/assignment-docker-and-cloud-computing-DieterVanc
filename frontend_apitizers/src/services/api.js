const BASE_URL = 'http://localhost:8080/api';
// const BASE_URL = 'http://192.168.0.224:8080/api';
// const BASE_URL = 'http://10.195.228.223:8080/api';

import { Platform } from 'react-native';

export const fetchRecipes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/recipes`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchRecipeById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/recipes/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipe');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createRecipe = async (recipe, image) => {
  try {
    const formData = new FormData();

    formData.append('recipe', JSON.stringify(recipe));

    if (image) {
      if (Platform.OS === 'web' && image.blob) {
        formData.append('image', image.blob, image.fileName);
      } else {
        formData.append('image', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.fileName || `recipe_${Date.now()}.jpg`,
        });
      }
    }

    const response = await fetch(`${BASE_URL}/recipes`, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Failed to create recipe: ${response.status} - ${errorMessage}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
};

export const updateRecipe = async (id, recipe, image) => {
  try {
    const formData = new FormData();
    formData.append('recipe', JSON.stringify(recipe));
    if (image) {
      if (Platform.OS === 'web' && image.blob) {
        formData.append('image', image.blob, image.fileName);
      } else if (typeof image.uri === 'string') {
        formData.append('image', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.fileName || `recipe_${Date.now()}.jpg`,
        });
      }
    }

    const response = await fetch(`${BASE_URL}/recipes/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Failed to update recipe: ${response.status} - ${errorMessage}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const toggleFavorite = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/recipes/${id}/toggle-favorite`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to toggle favorite status: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error in toggleFavorite:', error);
    return null;
  }
};

export const fetchIngredientsByRecipeId = async (recipeId) => {
  try {
    const response = await fetch(`${BASE_URL}/recipes/${recipeId}/ingredients`);
    if (!response.ok) {
      throw new Error('Failed to fetch ingredients');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    return [];
  }
};

export const deleteRecipe = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/recipes/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete recipe: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return false;
  }
};
