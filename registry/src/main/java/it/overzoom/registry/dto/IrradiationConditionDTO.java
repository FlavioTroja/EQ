package it.overzoom.registry.dto;

import java.util.ArrayList;
import java.util.List;

import it.overzoom.registry.model.KeyValue;

public class IrradiationConditionDTO {

    private String id;
    private String setUpMeasure;
    private List<KeyValue> parameters;
    private String sourceId;

    private Integer completedMeasurements;

    private List<MeasurementDTO> measurements = new ArrayList<>();

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

    public List<KeyValue> getParameters() {
        return parameters;
    }

    public void setParameters(List<KeyValue> parameters) {
        this.parameters = parameters;
    }

    public String getSourceId() {
        return sourceId;
    }

    public void setSourceId(String sourceId) {
        this.sourceId = sourceId;
    }

    public List<MeasurementDTO> getMeasurements() {
        return measurements;
    }

    public void setMeasurements(List<MeasurementDTO> measurements) {
        this.measurements = measurements;
    }

    public Integer getCompletedMeasurements() {
        return completedMeasurements;
    }

    public void setCompletedMeasurements(Integer completedMeasurements) {
        this.completedMeasurements = completedMeasurements;
    }
}