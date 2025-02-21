package it.overzoom.registry.controller;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;

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

import it.overzoom.registry.dto.UserDTO;
import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.mapper.UserMapper;
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
    public ResponseEntity<List<UserDTO>> findAll(
            Pageable pageable) {
        log.info("REST request to get a page of Users");
        Page<User> page = userService.findAll(pageable);
        return ResponseEntity.ok().body(page.getContent().stream().map(UserMapper::toDto).collect(Collectors.toList()));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getMyProfile() throws ResourceNotFoundException {
        return userService.findByUserId(SecurityUtils.getCurrentUserId()).map(UserMapper::toDto)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Utente non trovato."));
    }

    @PostMapping("")
    public ResponseEntity<UserDTO> create(@Valid @RequestBody UserDTO userDTO)
            throws BadRequestException, URISyntaxException {
        log.info("REST request to save User : " + userDTO.toString());
        if (userDTO.getId() != null) {
            throw new BadRequestException("Un nuovo cliente non può già avere un ID");
        }
        User user = UserMapper.toEntity(userDTO);
        user = userService.create(user);
        return ResponseEntity.created(new URI("/api/users/" + userDTO.getId())).body(UserMapper.toDto(user));
    }

    @PutMapping("")
    public ResponseEntity<UserDTO> update(@Valid @RequestBody UserDTO userDTO) throws BadRequestException,
            ResourceNotFoundException {
        log.info("REST request to update User:" + userDTO.toString());
        if (userDTO.getId() == null) {
            throw new BadRequestException("ID invalido.");
        }
        if (!userService.existsById(userDTO.getId())) {
            throw new ResourceNotFoundException("Cliente non trovato.");
        }
        User user = UserMapper.toEntity(userDTO);
        User updateUser = userService.update(user).orElseThrow(
                () -> new ResourceNotFoundException("Cliente non trovato con questo ID :: " + user.getId()));

        return ResponseEntity.ok().body(UserMapper.toDto(updateUser));
    }

    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserDTO> partialUpdate(@PathVariable(value = "id") String id,
            @RequestBody UserDTO userDTO) throws BadRequestException,
            ResourceNotFoundException {
        log.info("REST request to partial update User: " + userDTO.toString());
        if (id == null) {
            throw new BadRequestException("ID invalido.");
        }
        if (!userService.existsById(id)) {
            throw new ResourceNotFoundException("Cliente non trovato.");
        }
        User user = UserMapper.toEntity(userDTO);
        User updateUser = userService.partialUpdate(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente non trovato con questo ID :: " + id));

        return ResponseEntity.ok().body(UserMapper.toDto(updateUser));
    }
}
