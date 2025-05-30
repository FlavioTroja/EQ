package it.overzoom.registry.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Measurement;

public interface MeasurementService {

    Page<Measurement> findBySourceId(String sourceId, Pageable pageable);

    Optional<Measurement> findById(String id);

    boolean existsById(String id);

    Measurement create(Measurement measurement);

    Optional<Measurement> partialUpdate(String id, Measurement measurement);

    void deleteById(String id) throws ResourceNotFoundException, BadRequestException;
}