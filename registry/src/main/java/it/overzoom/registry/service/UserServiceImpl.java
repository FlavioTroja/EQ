package it.overzoom.registry.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.overzoom.registry.dto.UserDTO;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.mapper.UserMapper;
import it.overzoom.registry.model.User;
import it.overzoom.registry.repository.UserRepository;
import it.overzoom.registry.security.SecurityUtils;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public boolean hasAccess(String userId) throws ResourceNotFoundException {
        return SecurityUtils.isAdmin() || SecurityUtils.isCurrentUser(userId);
    }

    public Page<UserDTO> findAll(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::toDto);
    }

    public Optional<User> findById(String userId) {
        return userRepository.findByUserId(userId);
    }

    public boolean existsById(String id) {
        return userRepository.existsById(id);
    }

    @Transactional
    public User create(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public Optional<User> update(User user) {
        return this.findById(user.getId()).map(existingUser -> {
            existingUser.setPhoneNumber(user.getPhoneNumber());
            existingUser.setLevel(user.getLevel());
            existingUser.setPhoto(user.getPhoto());
            return existingUser;
        }).map(this::create);
    }

    @Transactional
    public Optional<User> partialUpdate(String id, User user) {
        return this.findById(id)
                .map(existingUser -> {
                    if (user.getUserId() != null) {
                        existingUser.setUserId(user.getUserId());
                    }
                    if (user.getLevel() != null) {
                        existingUser.setLevel(user.getLevel());
                    }
                    if (user.getPhoneNumber() != null) {
                        existingUser.setPhoneNumber(user.getPhoneNumber());
                    }
                    if (user.getPhoto() != null) {
                        existingUser.setPhoto(user.getPhoto());
                    }

                    return existingUser;
                })
                .map(this::create);
    }
}
