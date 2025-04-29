package it.overzoom.registry.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import it.overzoom.registry.model.Customer;

@Repository
public interface CustomerRepository extends MongoRepository<Customer, String> {

    Page<Customer> findByUserId(String userId, Pageable pageable);

    /**
     * Trova tutti i customer che referenziano almeno
     * una location il cui id è in locationIds.
     */
    @Query("{ 'locations.$id': { $in: ?0 } }")
    List<Customer> findDistinctByLocationIds(List<String> locationIds);
}
