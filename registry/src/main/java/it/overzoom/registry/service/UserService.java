package it.overzoom.registry.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import it.overzoom.registry.domain.User;

public interface UserService {

    Optional<User> findById(String id);

    Page<User> findAll(Pageable pageable);

    User create(User user);

    User update(User user);
}
