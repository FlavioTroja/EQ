package it.overzoom.registry.dto;

public class IrradiationConditionDTO {

    private String id;
    private String setUpMeasure;
    private String key;
    private Float value;
    private String sourceId;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSetUpMeasure() {
        return setUpMeasure;
    }

    public void setSetUpMeasure(String setUpMeasure) {
        this.setUpMeasure = setUpMeasure;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public Float getValue() {
        return value;
    }

    public void setValue(Float value) {
        this.value = value;
    }

    public String getSourceId() {
        return sourceId;
    }

    public void setSourceId(String sourceId) {
        this.sourceId = sourceId;
    }

}
