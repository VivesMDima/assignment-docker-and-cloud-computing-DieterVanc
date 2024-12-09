package ti.vives.be.apitizers.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ti.vives.be.apitizers.model.RecipeIngredient;
import ti.vives.be.apitizers.model.RecipeIngredientId;

@Repository
public interface RecipeIngredientRepository extends JpaRepository<RecipeIngredient, RecipeIngredientId> {

    @Modifying
    @Query("DELETE FROM RecipeIngredient ri WHERE ri.recipe.id = :recipeId")
    void deleteAllByRecipeId(@Param("recipeId") Integer recipeId);
}
