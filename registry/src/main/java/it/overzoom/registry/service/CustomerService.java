package it.overzoom.registry.service;

import java.util.List;

import it.overzoom.registry.domain.Customer;
import it.overzoom.registry.exception.ResourceNotFoundException;

public interface CustomerService {

    List<Customer> findAll();

    Customer getById(String customerId) throws ResourceNotFoundException;

    Customer create(Customer customer);

    Customer update(String customerId, Customer customerDetails) throws ResourceNotFoundException;

}
