package it.overzoom.registry.dto;

import java.util.ArrayList;
import java.util.List;

import it.overzoom.registry.model.TypeMachine;

public class MachineDTO {

    private String id;

    private String name;

    private TypeMachine type;

    private List<CustomerDTO> customers = new ArrayList<>();

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

    public List<CustomerDTO> getCustomers() {
        return customers;
    }

    public void setCustomers(List<CustomerDTO> customers) {
        this.customers = customers;
    }

    public TypeMachine getType() {
        return type;
    }

    public void setType(TypeMachine type) {
        this.type = type;
    }
}
