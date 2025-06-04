package it.overzoom.registry.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "irradiation_condition")
public class IrradiationCondition {

    @Id
    private String id;
    private String setUpMeasure;
    private String key;
    private Float value;

    @Indexed
    private String sourceId;

    @DBRef
    List<Measurement> measurements;

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

    public List<Measurement> getMeasurements() {
        return measurements;
    }

    public void setMeasurements(List<Measurement> measurements) {
        this.measurements = measurements;
    }

}
