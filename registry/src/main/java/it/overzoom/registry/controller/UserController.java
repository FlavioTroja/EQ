package it.overzoom.registry.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.overzoom.registry.domain.User;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.repository.UserRepository;
import it.overzoom.registry.service.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/registry/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @GetMapping("/")
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable(value = "id") String userId) throws ResourceNotFoundException {
        User user = userService.findById(
                userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for this id :: " + userId));

        return ResponseEntity.ok().body(user);
    }

    @PostMapping("/")
    public User create(@Valid @RequestBody User user) {
        return userRepository.save(user);
    }
}
