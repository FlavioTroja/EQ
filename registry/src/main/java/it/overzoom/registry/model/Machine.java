package it.overzoom.registry.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "machine")
public class Machine {

    @Id
    private String id;

    private String name;

    private TypeMachine type;

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

    public TypeMachine getType() {
        return type;
    }

    public void setType(TypeMachine type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "Machine [id=" + id + ", name=" + name + ", type=" + type + "]";
    }

}
