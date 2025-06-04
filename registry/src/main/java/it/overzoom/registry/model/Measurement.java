package it.overzoom.registry.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotNull;

@Document(collection = "measurement")
public class Measurement {

    @Id
    private String id;

    private LocalDateTime date;

    @NotNull
    private String key;

    @NotNull
    private Float value;

    @Indexed
    private String irradiationConditionId;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getIrradiationConditionId() {
        return irradiationConditionId;
    }

    public void setIrradiationConditionId(String irradiationConditionId) {
        this.irradiationConditionId = irradiationConditionId;
    }

}
