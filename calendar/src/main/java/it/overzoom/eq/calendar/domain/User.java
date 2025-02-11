package it.overzoom.eq.calendar.domain;

import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
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

    @Email
    private String email;

    @ManyToMany(mappedBy = "users")
    private Set<Meeting> meetings = new HashSet<>();
}
