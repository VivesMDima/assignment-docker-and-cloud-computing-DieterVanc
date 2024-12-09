package ti.vives.be.apitizers.service;

import ti.vives.be.apitizers.exceptions.ResourceNotFoundException;
import ti.vives.be.apitizers.dto.response.CategoryResponse;
import ti.vives.be.apitizers.model.Category;
import ti.vives.be.apitizers.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public CategoryResponse getCategoryById(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id, "Category"));
        return new CategoryResponse(category.getId(), category.getName(), category.getDescription());
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(category -> new CategoryResponse(category.getId(), category.getName(), category.getDescription()))
                .collect(Collectors.toList());
    }
}
