package it.overzoom.registry.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.overzoom.registry.domain.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

}
