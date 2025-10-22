package it.overzoom.registry.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Customer;

public interface CustomerService {

    Page<Customer> findAll(Pageable pageable);

    /**
     * Retrieves a customer by their unique identifier.
     *
     * @param id the unique identifier of the customer to retrieve
     * @return the {@link Customer} corresponding to the specified id
     * @throws ResourceNotFoundException if no customer with the given id is found
     * @throws BadRequestException       if the provided id is invalid or malformed
     */
    Customer findById(String id) throws ResourceNotFoundException, BadRequestException;

    Page<Customer> findByUserId(String userId, Pageable pageable);

    boolean existsById(String id);

    Customer create(Customer customer);

    Customer createWithNested(Customer customer);

    Customer update(Customer customer) throws ResourceNotFoundException, BadRequestException;

    Customer partialUpdate(String id, Customer customer)
            throws ResourceNotFoundException, BadRequestException;

    void deleteById(String id) throws BadRequestException, ResourceNotFoundException;

    boolean hasAccess(String customerId) throws ResourceNotFoundException;

    List<Customer> findCustomersByMachine(String machineId);
}