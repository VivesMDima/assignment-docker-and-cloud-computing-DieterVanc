package ti.vives.be.apitizers.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ti.vives.be.apitizers.dto.request.RecipeIngredientRequest;
import ti.vives.be.apitizers.dto.response.RecipeIngredientResponse;
import ti.vives.be.apitizers.service.RecipeIngredientService;

import java.util.List;

@RestController
@RequestMapping("/api/recipes/{recipeId}/ingredients")
public class RecipeIngredientController {

    private final RecipeIngredientService recipeIngredientService;

    public RecipeIngredientController(RecipeIngredientService recipeIngredientService) {
        this.recipeIngredientService = recipeIngredientService;
    }

    @PostMapping
    public ResponseEntity<RecipeIngredientResponse> addRecipeIngredient(@PathVariable Integer recipeId,
                                                                        @RequestBody RecipeIngredientRequest request) {
        RecipeIngredientResponse response = recipeIngredientService.addRecipeIngredient(recipeId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public List<RecipeIngredientResponse> getRecipeIngredients(@PathVariable Integer recipeId) {
        return recipeIngredientService.getRecipeIngredientsByRecipeId(recipeId);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteRecipeIngredients(@PathVariable Integer recipeId) {
        recipeIngredientService.deleteRecipeIngredientsByRecipeId(recipeId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
