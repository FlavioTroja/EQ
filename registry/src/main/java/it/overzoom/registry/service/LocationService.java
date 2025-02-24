package it.overzoom.registry.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import it.overzoom.registry.model.Location;

public interface LocationService {

    Page<Location> findAll(Pageable pageable);

    Optional<Location> findById(String id);

    Page<Location> findByUserId(String userId, Pageable pageable);

    boolean existsById(String id);

    Location create(Location location);

    Optional<Location> update(Location location);

    Optional<Location> partialUpdate(String id, Location location);
}