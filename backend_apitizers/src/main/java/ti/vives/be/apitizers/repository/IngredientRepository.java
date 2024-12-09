package ti.vives.be.apitizers.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ti.vives.be.apitizers.model.Ingredient;

import java.util.Optional;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Integer> {
    Optional<Ingredient> findByName(String name);
    boolean existsByName(String name);
}
