package it.overzoom.registry.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Location;

public interface LocationService {

    Page<Location> findByCustomerId(String customerId, Pageable pageable)
            throws ResourceNotFoundException, BadRequestException;

    Optional<Location> findById(String id);

    boolean existsById(String id);

    Location create(Location location) throws ResourceNotFoundException, BadRequestException;

    Optional<Location> update(Location location);

    Optional<Location> partialUpdate(String id, Location location);
}