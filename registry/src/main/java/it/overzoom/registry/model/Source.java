package it.overzoom.registry.model;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "source")
public class Source {

    @Id
    private String id;

    private String sn;

    private Date expirationDate;

    @Indexed
    private String departmentId;

    @DBRef
    private Machine machine;

    private Integer completedMeasurements;

    @DBRef
    List<Measurement> measurements;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSn() {
        return sn;
    }

    public void setSn(String sn) {
        this.sn = sn;
    }

    public Date getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(Date expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(String departmentId) {
        this.departmentId = departmentId;
    }

    public Machine getMachine() {
        return machine;
    }

    public void setMachine(Machine machine) {
        this.machine = machine;
    }

    public List<Measurement> getMeasurements() {
        return measurements;
    }

    public void setMeasurements(List<Measurement> measurements) {
        this.measurements = measurements;
    }

    public Integer getCompletedMeasurements() {
        return completedMeasurements;
    }

    public void setCompletedMeasurements(Integer completedMeasurements) {
        this.completedMeasurements = completedMeasurements;
    }

    @Override
    public String toString() {
        return "Source [id=" + id + ", sn=" + sn + ", expirationDate=" + expirationDate + ", departmentId="
                + departmentId + ", machine=" + machine + ", completedMeasurements=" + completedMeasurements
                + ", measurements=" + measurements + "]";
    }

}
