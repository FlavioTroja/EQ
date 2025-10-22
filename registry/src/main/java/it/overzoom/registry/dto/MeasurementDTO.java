package it.overzoom.registry.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;

public class MeasurementDTO {

    private String id;

    @NotNull
    private String name;

    private String unitMeasurement1;

    private String unitMeasurement2;

    private LocalDateTime date;

    private Float value1;

    private Float value2;

    @NotNull
    private String irradiationConditionId;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUnitMeasurement1() {
        return unitMeasurement1;
    }

    public void setUnitMeasurement1(String unitMeasurement1) {
        this.unitMeasurement1 = unitMeasurement1;
    }

    public String getUnitMeasurement2() {
        return unitMeasurement2;
    }

    public void setUnitMeasurement2(String unitMeasurement2) {
        this.unitMeasurement2 = unitMeasurement2;
    }

    public Float getValue1() {
        return value1;
    }

    public void setValue1(Float value1) {
        this.value1 = value1;
    }

    public Float getValue2() {
        return value2;
    }

    public void setValue2(Float value2) {
        this.value2 = value2;
    }

    public String getIrradiationConditionId() {
        return irradiationConditionId;
    }

    public void setIrradiationConditionId(String irradiationConditionId) {
        this.irradiationConditionId = irradiationConditionId;
    }
}
