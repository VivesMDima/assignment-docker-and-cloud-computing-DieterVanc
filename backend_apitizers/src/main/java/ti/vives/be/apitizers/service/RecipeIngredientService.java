package ti.vives.be.apitizers.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ti.vives.be.apitizers.dto.request.RecipeIngredientRequest;
import ti.vives.be.apitizers.dto.response.RecipeIngredientResponse;
import ti.vives.be.apitizers.exceptions.ResourceNotFoundException;
import ti.vives.be.apitizers.model.*;
import ti.vives.be.apitizers.repository.*;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecipeIngredientService {

    private final RecipeIngredientRepository recipeIngredientRepository;
    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;

    public RecipeIngredientService(RecipeIngredientRepository recipeIngredientRepository,
                                   RecipeRepository recipeRepository,
                                   IngredientRepository ingredientRepository) {
        this.recipeIngredientRepository = recipeIngredientRepository;
        this.recipeRepository = recipeRepository;
        this.ingredientRepository = ingredientRepository;
    }

    @Transactional
    public RecipeIngredientResponse addRecipeIngredient(Integer recipeId, RecipeIngredientRequest request) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ResourceNotFoundException(recipeId, "Recipe"));

        Ingredient ingredient;
        if (request.getIngredientId() != null) {
            ingredient = ingredientRepository.findById(request.getIngredientId())
                    .orElseThrow(() -> new ResourceNotFoundException(request.getIngredientId(), "Ingredient"));
        } else {
            ingredient = ingredientRepository.findByName(request.getIngredientName())
                    .orElseGet(() -> {
                        Ingredient newIngredient = new Ingredient();
                        newIngredient.setName(request.getIngredientName());
                        return ingredientRepository.save(newIngredient);
                    });
        }

        RecipeIngredientId recipeIngredientId = new RecipeIngredientId();
        recipeIngredientId.setRecipeId(recipe.getId());
        recipeIngredientId.setIngredientId(ingredient.getId());

        RecipeIngredient recipeIngredient = new RecipeIngredient();
        recipeIngredient.setId(recipeIngredientId);
        recipeIngredient.setRecipe(recipe);
        recipeIngredient.setIngredient(ingredient);
        recipeIngredient.setQuantity(request.getQuantity());
        recipeIngredient.setUnit(request.getUnit());

        RecipeIngredient savedRecipeIngredient = recipeIngredientRepository.save(recipeIngredient);

        return new RecipeIngredientResponse(
                savedRecipeIngredient.getIngredient().getId(),
                savedRecipeIngredient.getIngredient().getName(),
                savedRecipeIngredient.getQuantity(),
                savedRecipeIngredient.getUnit()
        );
    }

    public List<RecipeIngredientResponse> getRecipeIngredientsByRecipeId(Integer recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ResourceNotFoundException(recipeId, "Recipe"));

        return recipe.getRecipeIngredients()
                .stream()
                .map(recipeIngredient -> new RecipeIngredientResponse(
                        recipeIngredient.getIngredient().getId(),
                        recipeIngredient.getIngredient().getName(),
                        recipeIngredient.getQuantity(),
                        recipeIngredient.getUnit()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteRecipeIngredientsByRecipeId(Integer recipeId) {
        recipeIngredientRepository.deleteAllByRecipeId(recipeId);
    }
}
