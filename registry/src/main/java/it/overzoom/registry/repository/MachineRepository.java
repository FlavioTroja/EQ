package it.overzoom.registry.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import it.overzoom.registry.model.Machine;

@Repository
public interface MachineRepository extends MongoRepository<Machine, String> {

}
