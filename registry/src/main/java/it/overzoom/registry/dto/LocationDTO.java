package it.overzoom.registry.dto;

public class LocationDTO {

    private String id;

    private String customerId;

    private String name;

    private String address;

    private String city;

    private String province;

    private Integer completedDepartments;

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

}
