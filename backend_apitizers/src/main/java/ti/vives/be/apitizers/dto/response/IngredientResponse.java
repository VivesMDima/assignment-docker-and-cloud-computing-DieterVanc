package ti.vives.be.apitizers.dto.response;

public class IngredientResponse {

    private Integer id;
    private String name;

    public IngredientResponse(Integer id, String name) {
        this.id = id;
        this.name = name;
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
}
