package ti.vives.be.apitizers.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public class RecipeRequest {

    @NotNull
    @Size(max = 255)
    private String name;

    @NotNull
    private String description;

    private String instructions;

    private Boolean isHealthy;

    private Boolean isFavorite;

    @NotNull
    private Integer categoryId;

    private List<RecipeIngredientRequest> recipeIngredients;

//    private String image;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public Boolean getIsHealthy() {
        return isHealthy;
    }

    public void setIsHealthy(Boolean isHealthy) {
        this.isHealthy = isHealthy;
    }

    public Boolean getIsFavorite() {
        return isFavorite;
    }

    public void setIsFavorite(Boolean isFavorite) {
        this.isFavorite = isFavorite;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public List<RecipeIngredientRequest> getRecipeIngredients() {
        return recipeIngredients;
    }

    public void setRecipeIngredients(List<RecipeIngredientRequest> recipeIngredients) {
        this.recipeIngredients = recipeIngredients;
    }

//    public String getImage() {
//        return image;
//    }
//
//    public void setImage(String image) {
//        this.image = image;
//    }
}
