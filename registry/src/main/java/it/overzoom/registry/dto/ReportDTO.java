package it.overzoom.registry.dto;

import java.util.List;

import it.overzoom.registry.model.Customer;
import it.overzoom.registry.model.Location;
import it.overzoom.registry.model.Measurement;

public class ReportDTO {

    private List<Measurement> prospectMeasurements;

    private List<Measurement> lastMeasurements;

    private Location location;

    private Customer Customer;

    public List<Measurement> getProspectMeasurements() {
        return prospectMeasurements;
    }

    public void setProspectMeasurements(List<Measurement> prospectMeasurements) {
        this.prospectMeasurements = prospectMeasurements;
    }

    public Customer getCustomer() {
        return Customer;
    }

    public void setCustomer(Customer customer) {
        Customer = customer;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public List<Measurement> getLastMeasurements() {
        return lastMeasurements;
    }

    public void setLastMeasurements(List<Measurement> lastMeasurements) {
        this.lastMeasurements = lastMeasurements;
    }
}
