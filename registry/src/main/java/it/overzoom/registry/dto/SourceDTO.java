package it.overzoom.registry.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.validation.constraints.NotNull;

public class SourceDTO {

    private String id;

    @NotNull
    private String sn;

    private String phantom;

    private Integer load;

    private Date expirationDate;

    @NotNull
    private String departmentId;

    @NotNull
    private String machineId;

    private Integer completedIrradiationConditions;

    private List<IrradiationConditionDTO> irradiationConditions = new ArrayList<>();

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

    public Integer getCompletedIrradiationConditions() {
        return completedIrradiationConditions;
    }

    public void setCompletedIrradiationConditions(Integer completedIrradiationConditions) {
        this.completedIrradiationConditions = completedIrradiationConditions;
    }

    public List<IrradiationConditionDTO> getIrradiationConditions() {
        return irradiationConditions;
    }

    public void setIrradiationConditions(List<IrradiationConditionDTO> irradiationConditions) {
        this.irradiationConditions = irradiationConditions;
    }

    public String getMachineId() {
        return machineId;
    }

    public void setMachineId(String machineId) {
        this.machineId = machineId;
    }

    public String getPhantom() {
        return phantom;
    }

    public void setPhantom(String phantom) {
        this.phantom = phantom;
    }

    public Integer getLoad() {
        return load;
    }

    public void setLoad(Integer load) {
        this.load = load;
    }
}
