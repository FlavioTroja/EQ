package it.overzoom.registry.domain;

import java.util.Set;

import org.hibernate.annotations.UuidGenerator;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "users")
public class User {

    @Id
    @UuidGenerator
    private String id;

    private String name;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private Set<Customer> customers;

}
