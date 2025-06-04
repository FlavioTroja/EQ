package it.overzoom.registry.service;

import java.util.List;
import java.util.Optional;

import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Measurement;

public interface MeasurementService {

    List<Measurement> findByIrradiationConditionId(String irradiationConditionId);

    Optional<Measurement> findById(String id);

    boolean existsById(String id);

    Measurement create(Measurement measurement);

    Optional<Measurement> partialUpdate(String id, Measurement measurement);

    void deleteById(String id) throws ResourceNotFoundException, BadRequestException;
}