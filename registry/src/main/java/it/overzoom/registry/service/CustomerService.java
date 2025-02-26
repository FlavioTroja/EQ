package it.overzoom.registry.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Customer;

public interface CustomerService {

    Page<Customer> findAll(Pageable pageable);

    Customer findById(String id) throws ResourceNotFoundException, BadRequestException;

    Page<Customer> findByUserId(String userId, Pageable pageable);

    boolean existsById(String id);

    Customer create(Customer customer);

    Customer update(Customer customer) throws ResourceNotFoundException, BadRequestException;

    Customer partialUpdate(String id, Customer customer)
            throws ResourceNotFoundException, BadRequestException;

    void deleteById(String id);
}