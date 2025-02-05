package it.overzoom.registry.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.overzoom.registry.domain.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {

}
