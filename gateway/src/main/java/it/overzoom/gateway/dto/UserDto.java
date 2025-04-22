package it.overzoom.gateway.dto;

import java.util.Arrays;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

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

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public String[] getRoles() {
        return roles;
    }

    public void setRoles(String[] roles) {
        this.roles = roles;
    }

    @Override
    public String toString() {
        return "UserDto [id=" + id + ", userId=" + userId + ", username=" + username + ", email=" + email
                + ", firstName=" + firstName + ", lastName=" + lastName + ", phoneNumber=" + phoneNumber + ", level="
                + level + ", photo=" + photo + ", roles=" + Arrays.toString(roles) + "]";
    }

}
