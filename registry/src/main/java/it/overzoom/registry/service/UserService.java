package it.overzoom.registry.service;

import java.util.Optional;

import it.overzoom.registry.domain.User;

public interface UserService {

    Optional<User> findById(String id);
}
