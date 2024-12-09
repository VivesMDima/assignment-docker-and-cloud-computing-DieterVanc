package ti.vives.be.apitizers.dto.request;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class RecipeIngredientRequest {

    @NotNull
    private Integer ingredientId; // Will be null if the ingredient doesn't exist and needs to be created.

    @NotNull
    private String ingredientName; // For creating a new ingredient if it doesn't exist.

    @NotNull
    private BigDecimal quantity;

    private String unit;

    // Getters and Setters
    public Integer getIngredientId() {
        return ingredientId;
    }

    public void setIngredientId(Integer ingredientId) {
        this.ingredientId = ingredientId;
    }

    public String getIngredientName() {
        return ingredientName;
    }

    public void setIngredientName(String ingredientName) {
        this.ingredientName = ingredientName;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }
}
