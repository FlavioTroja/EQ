package it.overzoom.registry.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "machine")
@Data
public class Machine {

    @Id
    private String id;

    private String name;

}
