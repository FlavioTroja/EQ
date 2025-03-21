package it.overzoom.gateway.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserDto {

    private String id;
    private String userId;
    @NotNull
    private String username;
    @Email
    private String email;
    @NotNull
    private String firstName;
    @NotNull
    private String lastName;
    private String phoneNumber;
    private String level;
    private String photo;
    private String[] roles;
}
