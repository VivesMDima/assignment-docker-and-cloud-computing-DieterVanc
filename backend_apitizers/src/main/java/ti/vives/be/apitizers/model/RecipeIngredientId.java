package ti.vives.be.apitizers.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class RecipeIngredientId implements Serializable {
    private static final long serialVersionUID = 1531057655950219087L;
    @NotNull
    @Column(name = "recipe_id", nullable = false)
    private Integer recipeId;

    @NotNull
    @Column(name = "ingredient_id", nullable = false)
    private Integer ingredientId;

    public Integer getRecipeId() {
        return recipeId;
    }

    public void setRecipeId(Integer recipeId) {
        this.recipeId = recipeId;
    }

    public Integer getIngredientId() {
        return ingredientId;
    }

    public void setIngredientId(Integer ingredientId) {
        this.ingredientId = ingredientId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        RecipeIngredientId entity = (RecipeIngredientId) o;
        return Objects.equals(this.ingredientId, entity.ingredientId) &&
                Objects.equals(this.recipeId, entity.recipeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(ingredientId, recipeId);
    }

}