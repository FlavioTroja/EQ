package it.overzoom.registry.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.validation.constraints.NotNull;

public class SourceDTO {

    private String id;

    @NotNull
    private String sn;

    private Date expirationDate;

    @NotNull
    private String departmentId;

    @NotNull
    private String machineId;

    private Integer completedMeasurements;

    private List<MeasurementDTO> measurements = new ArrayList<>();

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

    public Integer getCompletedMeasurements() {
        return completedMeasurements;
    }

    public void setCompletedMeasurements(Integer completedMeasurements) {
        this.completedMeasurements = completedMeasurements;
    }

    public List<MeasurementDTO> getMeasurements() {
        return measurements;
    }

    public void setMeasurements(List<MeasurementDTO> measurements) {
        this.measurements = measurements;
    }

    public String getMachineId() {
        return machineId;
    }

    public void setMachineId(String machineId) {
        this.machineId = machineId;
    }
}
