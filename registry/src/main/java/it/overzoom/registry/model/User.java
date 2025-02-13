package it.overzoom.registry.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Document(collection = "user")
@Data
public class User {

    @Id
    private String id;

    private String name;

    @Email
    private String email;

    private String phoneNumber;

    private List<String> customers;

    private List<String> roles;

    @NotNull
    private UserType type;
}
