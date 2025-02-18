package it.overzoom.registry.controller;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.User;
import it.overzoom.registry.security.SecurityUtils;
import it.overzoom.registry.service.UserServiceImpl;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/registry/users")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserServiceImpl userService;

    @GetMapping("")
    public ResponseEntity<List<User>> findAll(
            Pageable pageable) {
        log.info("REST request to get a page of Users");
        Page<User> page = userService.findAll(pageable);
        return ResponseEntity.ok().body(page.getContent());
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getMyProfile() throws ResourceNotFoundException {
        return userService.findByUserId(SecurityUtils.getCurrentUserId())
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Utente non trovato."));
    }

    @PostMapping("")
    public ResponseEntity<User> create(@Valid @RequestBody User user) throws BadRequestException, URISyntaxException {
        log.info("REST request to save User : " + user.toString());
        if (user.getId() != null) {
            throw new BadRequestException("Un nuovo cliente non può già avere un ID");
        }
        user = userService.create(user);
        return ResponseEntity.created(new URI("/api/users/" + user.getId())).body(user);
    }

    @PutMapping("")
    public ResponseEntity<User> update(@Valid @RequestBody User user) throws BadRequestException,
            ResourceNotFoundException {
        log.info("REST request to update User:" + user.toString());
        if (user.getId() == null) {
            throw new BadRequestException("ID invalido.");
        }
        if (!userService.existsById(user.getId())) {
            throw new ResourceNotFoundException("Cliente non trovato.");
        }

        User updateUser = userService.update(user).orElseThrow(
                () -> new ResourceNotFoundException("Cliente non trovato con questo ID :: " + user.getId()));

        return ResponseEntity.ok().body(updateUser);
    }

    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<User> partialUpdate(@PathVariable(value = "id") String id,
            @RequestBody User user) throws BadRequestException,
            ResourceNotFoundException {
        log.info("REST request to partial update User: " + user.toString());
        if (id == null) {
            throw new BadRequestException("ID invalido.");
        }
        if (!userService.existsById(id)) {
            throw new ResourceNotFoundException("Cliente non trovato.");
        }

        User updateUser = userService.partialUpdate(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente non trovato con questo ID :: " + id));

        return ResponseEntity.ok().body(updateUser);
    }

}
