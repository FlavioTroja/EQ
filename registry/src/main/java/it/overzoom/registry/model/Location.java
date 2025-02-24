package it.overzoom.registry.model;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "location")
public class Location {

    @Id
    private String id;

    private String name;
    
    private String address;
    
    private List<Machine> machines;

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
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }

    public List<Machine> getMachines() {
        return machines;
    }

    public void setMachines(List<Machine> machines) {
        this.machines = machines;
    }

    @Override
    public String toString() {
        return "Location [id=" + id + ", name=" + name + ", address=" + address + ", machines=" + machines + "]";
    }
}
