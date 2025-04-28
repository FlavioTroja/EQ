package it.overzoom.registry.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import it.overzoom.registry.dto.CustomerDTO;
import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Customer;

public interface CustomerService {

    Page<CustomerDTO> findAll(Pageable pageable);

    CustomerDTO findById(String id) throws ResourceNotFoundException, BadRequestException;

    Page<CustomerDTO> findByUserId(String userId, Pageable pageable);

    boolean existsById(String id);

    CustomerDTO create(Customer customer);

    CustomerDTO update(Customer customer) throws ResourceNotFoundException, BadRequestException;

    CustomerDTO partialUpdate(String id, Customer customer)
            throws ResourceNotFoundException, BadRequestException;

    void deleteById(String id);

    boolean hasAccess(String customerId) throws ResourceNotFoundException;

    List<CustomerDTO> findCustomersByMachine(String machineId);
}