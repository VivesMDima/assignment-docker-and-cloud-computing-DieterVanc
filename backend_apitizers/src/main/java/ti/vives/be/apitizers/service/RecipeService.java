package ti.vives.be.apitizers.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ti.vives.be.apitizers.dto.request.RecipeIngredientRequest;
import ti.vives.be.apitizers.dto.request.RecipeRequest;
import ti.vives.be.apitizers.dto.response.RecipeResponse;
import ti.vives.be.apitizers.exceptions.ResourceNotFoundException;
import ti.vives.be.apitizers.model.*;
import ti.vives.be.apitizers.repository.CategoryRepository;
import ti.vives.be.apitizers.repository.IngredientRepository;
import ti.vives.be.apitizers.repository.RecipeIngredientRepository;
import ti.vives.be.apitizers.repository.RecipeRepository;
import ti.vives.be.apitizers.util.FirebaseStorageUtil;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final CategoryRepository categoryRepository;
    private final IngredientRepository ingredientRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;

    public RecipeService(RecipeRepository recipeRepository,
                         CategoryRepository categoryRepository,
                         IngredientRepository ingredientRepository,
                         RecipeIngredientRepository recipeIngredientRepository) {
        this.recipeRepository = recipeRepository;
        this.categoryRepository = categoryRepository;
        this.ingredientRepository = ingredientRepository;
        this.recipeIngredientRepository = recipeIngredientRepository;
    }

    public List<RecipeResponse> getAllRecipes() {
        return recipeRepository.findAll()
                .stream()
                .map(recipe -> new RecipeResponse(
                        recipe.getId(),
                        recipe.getName(),
                        recipe.getDescription(),
                        recipe.getInstructions(),
                        recipe.getIsHealthy(),
                        recipe.getIsFavorite(),
                        recipe.getCategory() != null ? recipe.getCategory().getName() : null,
                        recipe.getImage()
                ))
                .collect(Collectors.toList());
    }

    public RecipeResponse getRecipeById(Integer id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id, "Recipe"));
        return new RecipeResponse(
                recipe.getId(),
                recipe.getName(),
                recipe.getDescription(),
                recipe.getInstructions(),
                recipe.getIsHealthy(),
                recipe.getIsFavorite(),
                recipe.getCategory() != null ? recipe.getCategory().getName() : null,
                recipe.getImage()
        );
    }

    @Transactional
    public RecipeResponse createRecipe(RecipeRequest recipeRequest, MultipartFile imageFile) throws IOException {
        Category category = categoryRepository.findById(recipeRequest.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(recipeRequest.getCategoryId(), "Category"));

        // Create the Recipe entity
        Recipe recipe = new Recipe();
        recipe.setName(recipeRequest.getName());
        recipe.setDescription(recipeRequest.getDescription());
        recipe.setInstructions(recipeRequest.getInstructions());
        recipe.setIsHealthy(recipeRequest.getIsHealthy());
        recipe.setIsFavorite(recipeRequest.getIsFavorite());
        recipe.setCategory(category);

        // Handle the image upload
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = FirebaseStorageUtil.uploadFile(imageFile, "recipes");
            recipe.setImage(imageUrl);
        }

        // Save the recipe first to generate its ID
        Recipe savedRecipe = recipeRepository.save(recipe);

        // Iterate through recipe ingredients and persist them
        for (RecipeIngredientRequest ingredientRequest : recipeRequest.getRecipeIngredients()) {
            // Check or create the ingredient
            Ingredient ingredient = ingredientRepository.findByName(ingredientRequest.getIngredientName())
                    .orElseGet(() -> {
                        Ingredient newIngredient = new Ingredient();
                        newIngredient.setName(ingredientRequest.getIngredientName());
                        return ingredientRepository.save(newIngredient);
                    });

            // Create the composite key
            RecipeIngredientId recipeIngredientId = new RecipeIngredientId();
            recipeIngredientId.setRecipeId(savedRecipe.getId());
            recipeIngredientId.setIngredientId(ingredient.getId());

            // Create and save the RecipeIngredient
            RecipeIngredient recipeIngredient = new RecipeIngredient();
            recipeIngredient.setId(recipeIngredientId);
            recipeIngredient.setRecipe(savedRecipe);
            recipeIngredient.setIngredient(ingredient);
            recipeIngredient.setQuantity(ingredientRequest.getQuantity());
            recipeIngredient.setUnit(ingredientRequest.getUnit());

            recipeIngredientRepository.save(recipeIngredient); // Save individually to avoid session conflicts
        }

        return mapToResponse(savedRecipe);
    }

    @Transactional
    public RecipeResponse updateRecipe(Integer id, RecipeRequest recipeRequest, MultipartFile imageFile) throws IOException {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id, "Recipe"));

        Category category = categoryRepository.findById(recipeRequest.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(recipeRequest.getCategoryId(), "Category"));

        recipe.setName(recipeRequest.getName());
        recipe.setDescription(recipeRequest.getDescription());
        recipe.setInstructions(recipeRequest.getInstructions());
        recipe.setIsHealthy(recipeRequest.getIsHealthy());
        recipe.setIsFavorite(recipeRequest.getIsFavorite());
        recipe.setCategory(category);

        // Handle new image if provided
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = FirebaseStorageUtil.uploadFile(imageFile, "recipes");
            recipe.setImage(imageUrl); // Replace the old image URL
        }

        // Clear and update recipe ingredients
        recipeIngredientRepository.deleteAllByRecipeId(recipe.getId());
        for (RecipeIngredientRequest ingredientRequest : recipeRequest.getRecipeIngredients()) {
            Ingredient ingredient = ingredientRepository.findByName(ingredientRequest.getIngredientName())
                    .orElseGet(() -> {
                        Ingredient newIngredient = new Ingredient();
                        newIngredient.setName(ingredientRequest.getIngredientName());
                        return ingredientRepository.save(newIngredient);
                    });

            // Create the composite key
            RecipeIngredientId recipeIngredientId = new RecipeIngredientId();
            recipeIngredientId.setRecipeId(recipe.getId());
            recipeIngredientId.setIngredientId(ingredient.getId());

            // Create and save the RecipeIngredient
            RecipeIngredient recipeIngredient = new RecipeIngredient();
            recipeIngredient.setId(recipeIngredientId);
            recipeIngredient.setRecipe(recipe);
            recipeIngredient.setIngredient(ingredient);
            recipeIngredient.setQuantity(ingredientRequest.getQuantity());
            recipeIngredient.setUnit(ingredientRequest.getUnit());

            recipeIngredientRepository.save(recipeIngredient);
        }

        Recipe updatedRecipe = recipeRepository.save(recipe);
        return mapToResponse(updatedRecipe);
    }


    @Transactional
    public void deleteRecipe(Integer id) {
        if (!recipeRepository.existsById(id)) {
            throw new ResourceNotFoundException(id, "Recipe");
        }
        recipeRepository.deleteById(id);
    }

    private RecipeResponse mapToResponse(Recipe recipe) {
        return new RecipeResponse(
                recipe.getId(),
                recipe.getName(),
                recipe.getDescription(),
                recipe.getInstructions(),
                recipe.getIsHealthy(),
                recipe.getIsFavorite(),
                recipe.getCategory() != null ? recipe.getCategory().getName() : null,
                recipe.getImage()
        );
    }

    @Transactional
    public RecipeResponse toggleFavorite(Integer id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id, "Recipe"));
        recipe.setIsFavorite(!recipe.getIsFavorite());
        Recipe updatedRecipe = recipeRepository.save(recipe);
        return mapToResponse(updatedRecipe);
    }

}
