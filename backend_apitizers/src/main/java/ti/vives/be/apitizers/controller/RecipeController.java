package ti.vives.be.apitizers.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ti.vives.be.apitizers.dto.request.RecipeRequest;
import ti.vives.be.apitizers.dto.response.RecipeResponse;
import ti.vives.be.apitizers.service.RecipeService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping
    public List<RecipeResponse> getAllRecipes() {
        return recipeService.getAllRecipes();
    }

    @GetMapping("/{id}")
    public RecipeResponse getRecipeById(@PathVariable Integer id) {
        return recipeService.getRecipeById(id);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<RecipeResponse> createRecipe(
            @RequestPart("recipe") String recipeJson,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) throws IOException {

        // Debugging: Log the incoming JSON and image
        System.out.println("Received recipe JSON: " + recipeJson);
        if (imageFile != null) {
            System.out.println("Received image: " + imageFile.getOriginalFilename());
        } else {
            System.out.println("No image received");
        }

        // Map the JSON string to a RecipeRequest object
        ObjectMapper objectMapper = new ObjectMapper();
        RecipeRequest recipeRequest = objectMapper.readValue(recipeJson, RecipeRequest.class);


        System.out.println("Received recipe: " + recipeRequest);
        if (imageFile != null) {
            System.out.println("Received image: " + imageFile.getOriginalFilename());
        } else {
            System.out.println("No image received");
        }

        RecipeResponse response = recipeService.createRecipe(recipeRequest, imageFile);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public RecipeResponse updateRecipe(
            @PathVariable Integer id,
            @RequestPart("recipe") String recipeJson,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        RecipeRequest recipeRequest = objectMapper.readValue(recipeJson, RecipeRequest.class);

        return recipeService.updateRecipe(id, recipeRequest, imageFile);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Integer id) {
        recipeService.deleteRecipe(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/{id}/toggle-favorite")
    public ResponseEntity<RecipeResponse> toggleFavorite(@PathVariable Integer id) {
        RecipeResponse updatedRecipe = recipeService.toggleFavorite(id);
        return ResponseEntity.ok(updatedRecipe);
    }

}
