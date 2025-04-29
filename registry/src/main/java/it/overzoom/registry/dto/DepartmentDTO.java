package it.overzoom.registry.dto;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.NotNull;

public class DepartmentDTO {

    private String id;

    @NotNull
    private String name;

    @NotNull
    private String locationId;

    private Integer completedSources;

    private List<SourceDTO> sources = new ArrayList<>();

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

    public String getLocationId() {
        return locationId;
    }

    public void setLocationId(String locationId) {
        this.locationId = locationId;
    }

    public Integer getCompletedSources() {
        return completedSources;
    }

    public void setCompletedSources(Integer completedSources) {
        this.completedSources = completedSources;
    }

    public List<SourceDTO> getSources() {
        return sources;
    }

    public void setSources(List<SourceDTO> sources) {
        this.sources = sources;
    }
}
