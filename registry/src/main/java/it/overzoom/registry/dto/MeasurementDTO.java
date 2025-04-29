package it.overzoom.registry.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;

public class MeasurementDTO {

    private String id;

    private LocalDateTime date;

    @NotNull
    private String key;

    @NotNull
    private Float value;

    @NotNull
    private String sourceId;

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
