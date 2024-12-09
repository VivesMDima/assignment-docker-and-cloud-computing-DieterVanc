package ti.vives.be.apitizers.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ti.vives.be.apitizers.model.Recipe;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Integer> {
}
