package it.overzoom.registry.dto;

import java.util.List;

import it.overzoom.registry.model.Customer;
import it.overzoom.registry.model.Measurement;

public class ReportDTO {

    private List<Measurement> prospectMeasurements;

    private List<Measurement> measurements;

    private Customer Customer;

    public List<Measurement> getProspectMeasurements() {
        return prospectMeasurements;
    }

    public void setProspectMeasurements(List<Measurement> prospectMeasurements) {
        this.prospectMeasurements = prospectMeasurements;
    }

    public List<Measurement> getMeasurements() {
        return measurements;
    }

    public void setMeasurements(List<Measurement> measurements) {
        this.measurements = measurements;
    }

    public Customer getCustomer() {
        return Customer;
    }

    public void setCustomer(Customer customer) {
        Customer = customer;
    }

}
