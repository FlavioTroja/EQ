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

    public Optional<User> findById(String userId) {
        return userRepository.findById(userId);
    }

    public boolean existsById(String userId) {
        return userRepository.existsById(userId);
    }

    public User create(User user) {
        return userRepository.save(user);
    }

    public Optional<User> update(User userDetails) {
        return this.findById(userDetails.getId()).map(existingUser -> {
            existingUser.setName(userDetails.getName());
            existingUser.setEmail(userDetails.getEmail());
            existingUser.setPhoneNumber(userDetails.getPhoneNumber());
            existingUser.setRoles(userDetails.getRoles());
            return existingUser;
        }).map(this::create);
    }

    public Optional<User> partialUpdate(String userId, User userDetails) {
        return this.findById(userId)
                .map(existingUser -> {
                    if (userDetails.getName() != null) {
                        existingUser.setName(userDetails.getName());
                    }
                    if (userDetails.getEmail() != null) {
                        existingUser.setEmail(userDetails.getEmail());
                    }
                    if (userDetails.getPhoneNumber() != null) {
                        existingUser.setPhoneNumber(userDetails.getPhoneNumber());
                    }

                    return existingUser;
                })
                .map(this::create);
    }
}
