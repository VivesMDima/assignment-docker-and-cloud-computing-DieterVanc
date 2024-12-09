package ti.vives.be.apitizers.service;

import org.springframework.stereotype.Service;
import ti.vives.be.apitizers.dto.request.IngredientRequest;
import ti.vives.be.apitizers.dto.response.IngredientResponse;
import ti.vives.be.apitizers.exceptions.BadRequestException;
import ti.vives.be.apitizers.exceptions.ResourceNotFoundException;
import ti.vives.be.apitizers.model.Ingredient;
import ti.vives.be.apitizers.repository.IngredientRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IngredientService {

    private final IngredientRepository ingredientRepository;

    public IngredientService(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    public List<IngredientResponse> getAllIngredients() {
        return ingredientRepository.findAll()
                .stream()
                .map(ingredient -> new IngredientResponse(ingredient.getId(), ingredient.getName()))
                .collect(Collectors.toList());
    }

    public IngredientResponse getIngredientById(Integer id) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id, "Ingredient"));
        return new IngredientResponse(ingredient.getId(), ingredient.getName());
    }

    public IngredientResponse createIngredient(IngredientRequest ingredientRequest) {
        if (ingredientRepository.existsByName(ingredientRequest.getName())) {
            throw new BadRequestException("Ingredient with name '" + ingredientRequest.getName() + "' already exists.");
        }
        Ingredient ingredient = new Ingredient();
        ingredient.setName(ingredientRequest.getName());
        Ingredient savedIngredient = ingredientRepository.save(ingredient);
        return new IngredientResponse(savedIngredient.getId(), savedIngredient.getName());
    }

    public void deleteIngredient(Integer id) {
        if (!ingredientRepository.existsById(id)) {
            throw new ResourceNotFoundException(id, "Ingredient");
        }
        ingredientRepository.deleteById(id);
    }

    public IngredientResponse updateIngredient(Integer id, IngredientRequest ingredientRequest) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id, "Ingredient"));
        if (!ingredient.getName().equals(ingredientRequest.getName()) && ingredientRepository.existsByName(ingredientRequest.getName())) {
            throw new BadRequestException("Ingredient with name '" + ingredientRequest.getName() + "' already exists.");
        }
        ingredient.setName(ingredientRequest.getName());
        Ingredient updatedIngredient = ingredientRepository.save(ingredient);
        return new IngredientResponse(updatedIngredient.getId(), updatedIngredient.getName());
    }
}
