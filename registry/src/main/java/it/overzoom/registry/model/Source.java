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

    private String phantom;

    private Integer load;

    private Date expirationDate;

    @Indexed
    private String departmentId;

    @Indexed
    private String machineId;

    private Integer completedMeasurements;

    @DBRef
    List<IrradiationCondition> irradiationConditions;

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

    public String getMachineId() {
        return machineId;
    }

    public void setMachineId(String machineId) {
        this.machineId = machineId;
    }

    public List<IrradiationCondition> getIrradiationConditions() {
        return irradiationConditions;
    }

    public void setIrradiationConditions(List<IrradiationCondition> irradiationConditions) {
        this.irradiationConditions = irradiationConditions;
    }

    public Integer getCompletedMeasurements() {
        return completedMeasurements;
    }

    public void setCompletedMeasurements(Integer completedMeasurements) {
        this.completedMeasurements = completedMeasurements;
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
