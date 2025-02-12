package it.overzoom.registry.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import it.overzoom.registry.model.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
}
