package ti.vives.be.apitizers.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ti.vives.be.apitizers.dto.request.IngredientRequest;
import ti.vives.be.apitizers.dto.response.IngredientResponse;
import ti.vives.be.apitizers.service.IngredientService;

import java.util.List;

@RestController
@RequestMapping("/api/ingredients")
public class IngredientController {

    private final IngredientService ingredientService;

    public IngredientController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @GetMapping
    public List<IngredientResponse> getAllIngredients() {
        return ingredientService.getAllIngredients();
    }

    @GetMapping("/{id}")
    public IngredientResponse getIngredientById(@PathVariable Integer id) {
        return ingredientService.getIngredientById(id);
    }

    @PostMapping
    public ResponseEntity<IngredientResponse> createIngredient(@RequestBody IngredientRequest ingredientRequest) {
        IngredientResponse response = ingredientService.createIngredient(ingredientRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIngredient(@PathVariable Integer id) {
        ingredientService.deleteIngredient(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{id}")
    public IngredientResponse updateIngredient(@PathVariable Integer id, @RequestBody IngredientRequest ingredientRequest) {
        return ingredientService.updateIngredient(id, ingredientRequest);
    }
}
