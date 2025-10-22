package it.overzoom.registry.service;

import java.util.List;

import it.overzoom.registry.dto.LocationDTO;
import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Location;

public interface LocationService {

        List<Location> findByCustomerId(String customerId)
                        throws ResourceNotFoundException, BadRequestException;

        Location findById(String id) throws ResourceNotFoundException, BadRequestException;

        boolean existsById(String id);

        Location create(Location location) throws ResourceNotFoundException, BadRequestException;

        Location update(Location location) throws ResourceNotFoundException, BadRequestException;

        Location partialUpdate(String id, Location location)
                        throws ResourceNotFoundException, BadRequestException;

        void deleteById(String id) throws BadRequestException, ResourceNotFoundException;
}