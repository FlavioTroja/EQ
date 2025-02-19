package it.overzoom.registry.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import it.overzoom.registry.model.User;

public interface UserService {

    Page<User> findAll(Pageable pageable);

    Optional<User> findById(String id);

    Optional<User> findByUserId(String userId);

    boolean existsById(String id);

    User create(User user);

    Optional<User> update(User user);

    Optional<User> partialUpdate(String id, User user);
}
