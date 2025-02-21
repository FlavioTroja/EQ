package it.overzoom.registry.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import it.overzoom.registry.model.Customer;

public interface CustomerService {

    Page<Customer> findAll(Pageable pageable);

    Optional<Customer> findById(String id);

    Page<Customer> findByUserId(String userId, Pageable pageable);

    boolean existsById(String id);

    Customer create(Customer customer);

    Optional<Customer> update(Customer customer);

    Optional<Customer> partialUpdate(String id, Customer customer);
}