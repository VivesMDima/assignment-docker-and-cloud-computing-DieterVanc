package ti.vives.be.apitizers.dto.response;

import java.math.BigDecimal;

public class RecipeIngredientResponse {

    private Integer ingredientId;
    private String ingredientName;
    private BigDecimal quantity;
    private String unit;

    // Constructor
    public RecipeIngredientResponse(Integer ingredientId, String ingredientName, BigDecimal quantity, String unit) {
        this.ingredientId = ingredientId;
        this.ingredientName = ingredientName;
        this.quantity = quantity;
        this.unit = unit;
    }

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
