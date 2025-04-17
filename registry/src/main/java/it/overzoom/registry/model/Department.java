package it.overzoom.registry.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "department")
public class Department {

    @Id
    private String id;

    private String name;

    @Indexed
    private String locationId;

    private Integer completedSources;

    @DBRef
    private List<Source> sources;

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

    public List<Source> getSources() {
        return sources;
    }

    public void setSources(List<Source> sources) {
        this.sources = sources;
    }

    public Integer getCompletedSources() {
        return completedSources;
    }

    public void setCompletedSources(Integer completedSources) {
        this.completedSources = completedSources;
    }

    @Override
    public String toString() {
        return "Department [id=" + id + ", name=" + name + ", locationId=" + locationId + ", completedSources="
                + completedSources + ", sources=" + sources + "]";
    }

}
