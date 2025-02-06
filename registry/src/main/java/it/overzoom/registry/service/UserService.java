package it.overzoom.registry.service;

import java.util.List;
import java.util.Optional;

import it.overzoom.registry.domain.User;

public interface UserService {

    Optional<User> findById(String id);

    List<User> findAll();

    User create(User user);

    User update(User user);
}
