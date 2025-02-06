package it.overzoom.registry.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import it.overzoom.registry.domain.Customer;

public interface CustomerService {

    Page<Customer> findAll(Pageable pageable);

    Optional<Customer> findById(String customerId);

    boolean existsById(String customerId);

    Customer create(Customer customer);

    Optional<Customer> update(Customer customer);

    Optional<Customer> partialUpdate(String customerId, Customer customer);
}
