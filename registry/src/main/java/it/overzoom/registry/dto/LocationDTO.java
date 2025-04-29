package it.overzoom.registry.dto;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.NotNull;

public class LocationDTO {

    private String id;

    @NotNull
    private String customerId;

    @NotNull
    private String name;

    private String address;

    private String city;

    private String province;

    private Integer completedDepartments;

    private List<DepartmentDTO> departments = new ArrayList<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public Integer getCompletedDepartments() {
        return completedDepartments;
    }

    public void setCompletedDepartments(Integer completedDepartments) {
        this.completedDepartments = completedDepartments;
    }

    public List<DepartmentDTO> getDepartments() {
        return departments;
    }

    public void setDepartments(List<DepartmentDTO> departments) {
        this.departments = departments;
    }
}
