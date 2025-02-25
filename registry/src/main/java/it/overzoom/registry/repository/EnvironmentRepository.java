package it.overzoom.registry.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import it.overzoom.registry.model.Environment;

@Repository
public interface EnvironmentRepository extends MongoRepository<Environment, String> {

}
