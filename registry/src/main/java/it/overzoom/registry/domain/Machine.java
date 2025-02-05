package it.overzoom.registry.domain;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Machine {

    @Id
    @UuidGenerator
    private String id;

    private String name;

}
