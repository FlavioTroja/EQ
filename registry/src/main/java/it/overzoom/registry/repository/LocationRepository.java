package it.overzoom.registry.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import it.overzoom.registry.model.Location;

@Repository
public interface LocationRepository extends MongoRepository<Location, String> {

        Page<Location> findByCustomerId(String customerId, Pageable pageable);

        List<Location> findByCustomerId(String customerId);
}
