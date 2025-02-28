package it.overzoom.registry.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import it.overzoom.registry.model.Measurement;

@Repository
public interface MeasurementRepository extends MongoRepository<Measurement, String> {
}
