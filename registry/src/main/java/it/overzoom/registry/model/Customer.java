package it.overzoom.registry.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

@Document(collection = "customer")
public class Customer {

    @Id
    private String id;

    @Indexed
    @NotNull
    private String userId;

    @NotNull
    private String name;

    private String fiscalCode;

    private String vatCode;

    @Email
    private String pec;

    private String sdi;

    private PaymentMethod paymentMethod;

    @Email
    private String email;

    private String phoneNumber;

    private String notes;

    @DBRef
    private List<Location> locations;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFiscalCode() {
        return fiscalCode;
    }

    public void setFiscalCode(String fiscalCode) {
        this.fiscalCode = fiscalCode;
    }

    public String getVatCode() {
        return vatCode;
    }

    public void setVatCode(String vatCode) {
        this.vatCode = vatCode;
    }

    public String getPec() {
        return pec;
    }

    public void setPec(String pec) {
        this.pec = pec;
    }

    public String getSdi() {
        return sdi;
    }

    public void setSdi(String sdi) {
        this.sdi = sdi;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<Location> getLocations() {
        return locations;
    }

    public void setLocations(List<Location> locations) {
        this.locations = locations;
    }

    @Override
    public String toString() {
        return "Customer [id=" + id + ", userId=" + userId + ", name=" + name + ", fiscalCode=" + fiscalCode
                + ", vatCode=" + vatCode + ", pec=" + pec + ", sdi=" + sdi + ", paymentMethod=" + paymentMethod
                + ", email=" + email + ", phoneNumber=" + phoneNumber + ", notes=" + notes + ", locations=" + locations
                + "]";
    }
}
