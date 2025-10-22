package it.overzoom.registry.dto;

import java.util.ArrayList;
import java.util.List;

import it.overzoom.registry.model.KeyValue;

public class IrradiationConditionDTO {

    private String id;
    private String name;
    private String setUpMeasure;
    private List<KeyValue> parameters;
    private String sourceId;

    private Integer completedMeasurements;

    private List<MeasurementDTO> measurementPoints = new ArrayList<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public List<MeasurementDTO> getMeasurementPoints() {
        return measurementPoints;
    }

    public void setMeasurementPoints(List<MeasurementDTO> measurementPoints) {
        this.measurementPoints = measurementPoints;
    }

    public Integer getCompletedMeasurements() {
        return completedMeasurements;
    }

    public void setCompletedMeasurements(Integer completedMeasurements) {
        this.completedMeasurements = completedMeasurements;
    }
}