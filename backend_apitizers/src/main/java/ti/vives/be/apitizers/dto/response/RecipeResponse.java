package ti.vives.be.apitizers.dto.response;

public class RecipeResponse {

    private Integer id;
    private String name;
    private String description;
    private String instructions;
    private Boolean isHealthy;
    private Boolean isFavorite;
    private String categoryName;
    private String image;

    public RecipeResponse(Integer id, String name, String description, String instructions, Boolean isHealthy, Boolean isFavorite, String categoryName, String image) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.instructions = instructions;
        this.isHealthy = isHealthy;
        this.isFavorite = isFavorite;
        this.categoryName = categoryName;
        this.image = image;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

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

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
