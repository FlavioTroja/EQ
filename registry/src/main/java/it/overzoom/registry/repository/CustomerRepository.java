package it.overzoom.registry.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import it.overzoom.registry.model.Customer;

@Repository
public interface CustomerRepository extends MongoRepository<Customer, String> {

    Page<Customer> findByUserId(String userId, Pageable pageable);
}
