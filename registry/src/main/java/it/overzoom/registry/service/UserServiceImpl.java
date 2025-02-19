package it.overzoom.registry.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import it.overzoom.registry.model.User;
import it.overzoom.registry.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    public Page<User> findAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByUserId(String userId) {
        return userRepository.findByUserId(userId);
    }

    public boolean existsById(String id) {
        return userRepository.existsById(id);
    }

    public User create(User user) {

        return userRepository.save(user);
    }

    public Optional<User> update(User user) {
        return this.findById(user.getId()).map(existingUser -> {
            existingUser.setName(user.getName());
            existingUser.setEmail(user.getEmail());
            existingUser.setPhoneNumber(user.getPhoneNumber());
            existingUser.setRoles(user.getRoles());
            return existingUser;
        }).map(this::create);
    }

    public Optional<User> partialUpdate(String id, User user) {
        return this.findById(id)
                .map(existingUser -> {
                    if (user.getName() != null) {
                        existingUser.setName(user.getName());
                    }
                    if (user.getEmail() != null) {
                        existingUser.setEmail(user.getEmail());
                    }
                    if (user.getPhoneNumber() != null) {
                        existingUser.setPhoneNumber(user.getPhoneNumber());
                    }

                    return existingUser;
                })
                .map(this::create);
    }
}
