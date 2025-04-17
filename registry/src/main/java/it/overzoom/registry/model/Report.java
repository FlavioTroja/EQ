package it.overzoom.registry.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "report")
public class Report {

    @Id
    private String id;

    @Indexed
    private String customerId;

    @Indexed
    private String locationId;

    private LocalDateTime creationDate;

    private LocalDateTime readDate;

    private LocalDateTime expirationDate;

    private String filename;

    private String warningSignage;

    private String safetyLights;

    private String ppe;

    private String safetyDevices;

    private String dosimeters;

    private String radiationRules;

    private String prevReportNotes;

    private String actionsRequired;

    private String recommendations;

    private String conclusion;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getLocationId() {
        return locationId;
    }

    public void setLocationId(String locationId) {
        this.locationId = locationId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public LocalDateTime getReadDate() {
        return readDate;
    }

    public void setReadDate(LocalDateTime readDate) {
        this.readDate = readDate;
    }

    public LocalDateTime getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDateTime expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getWarningSignage() {
        return warningSignage;
    }

    public void setWarningSignage(String warningSignage) {
        this.warningSignage = warningSignage;
    }

    public String getSafetyLights() {
        return safetyLights;
    }

    public void setSafetyLights(String safetyLights) {
        this.safetyLights = safetyLights;
    }

    public String getPpe() {
        return ppe;
    }

    public void setPpe(String ppe) {
        this.ppe = ppe;
    }

    public String getSafetyDevices() {
        return safetyDevices;
    }

    public void setSafetyDevices(String safetyDevices) {
        this.safetyDevices = safetyDevices;
    }

    public String getDosimeters() {
        return dosimeters;
    }

    public void setDosimeters(String dosimeters) {
        this.dosimeters = dosimeters;
    }

    public String getRadiationRules() {
        return radiationRules;
    }

    public void setRadiationRules(String radiationRules) {
        this.radiationRules = radiationRules;
    }

    public String getPrevReportNotes() {
        return prevReportNotes;
    }

    public void setPrevReportNotes(String prevReportNotes) {
        this.prevReportNotes = prevReportNotes;
    }

    public String getActionsRequired() {
        return actionsRequired;
    }

    public void setActionsRequired(String actionsRequired) {
        this.actionsRequired = actionsRequired;
    }

    public String getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(String recommendations) {
        this.recommendations = recommendations;
    }

    public String getConclusion() {
        return conclusion;
    }

    public void setConclusion(String conclusion) {
        this.conclusion = conclusion;
    }

    @Override
    public String toString() {
        return "Report [id=" + id + ", customerId=" + customerId + ", locationId=" + locationId + ", creationDate="
                + creationDate + ", readDate=" + readDate + ", expirationDate=" + expirationDate + ", filename="
                + filename + ", warningSignage=" + warningSignage + ", safetyLights=" + safetyLights + ", ppe=" + ppe
                + ", safetyDevices=" + safetyDevices + ", dosimeters=" + dosimeters + ", radiationRules="
                + radiationRules + ", prevReportNotes=" + prevReportNotes + ", actionsRequired=" + actionsRequired
                + ", recommendations=" + recommendations + ", conclusion=" + conclusion + "]";
    }

}
