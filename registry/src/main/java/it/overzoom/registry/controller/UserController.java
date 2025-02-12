package it.overzoom.registry.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.overzoom.registry.domain.User;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.service.UserService;
import jakarta.validation.Valid;
import lombok.SneakyThrows;

@RestController
@RequestMapping("/api/registry/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("")
    public ResponseEntity<List<User>> findAll(Pageable pageable) {
        Page<User> page = userService.findAll(pageable);
        return ResponseEntity.ok().body(page.getContent());
    }

    @GetMapping("/{id}")
    @SneakyThrows
    public ResponseEntity<User> findById(@PathVariable(value = "id") String userId) {
        User user = userService.findById(
                userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utente non trovato per questo id :: " + userId));

        return ResponseEntity.ok().body(user);
    }

    @PostMapping("")
    public User create(@Valid @RequestBody User user) {
        return userService.create(user);
    }

    @PutMapping("")
    public User update(@Valid @RequestBody User user) {
        return userService.update(user);
    }
}
