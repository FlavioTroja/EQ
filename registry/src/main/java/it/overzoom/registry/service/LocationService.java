package it.overzoom.registry.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import it.overzoom.registry.dto.LocationDTO;
import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Location;

public interface LocationService {

        Page<LocationDTO> findByCustomerId(String customerId, Pageable pageable)
                        throws ResourceNotFoundException, BadRequestException;

        List<LocationDTO> findByCustomerId(String customerId)
                        throws ResourceNotFoundException, BadRequestException;

        Location findById(String id) throws ResourceNotFoundException, BadRequestException;

        boolean existsById(String id);

        Location create(Location location) throws ResourceNotFoundException, BadRequestException;

        Location update(Location location) throws ResourceNotFoundException, BadRequestException;

        Location partialUpdate(String id, Location location)
                        throws ResourceNotFoundException, BadRequestException;

        void deleteById(String id) throws BadRequestException, ResourceNotFoundException;
}