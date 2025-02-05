package it.overzoom.registry.domain;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Email;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Customer {

    @Id
    @UuidGenerator
    private String id;

    private String name;

    @Email
    private String email;

    private String phone;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
