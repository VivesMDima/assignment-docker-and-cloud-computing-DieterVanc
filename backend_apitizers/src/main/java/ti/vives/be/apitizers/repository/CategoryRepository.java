package ti.vives.be.apitizers.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ti.vives.be.apitizers.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
