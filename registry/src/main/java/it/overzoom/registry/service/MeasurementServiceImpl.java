package it.overzoom.registry.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Measurement;
import it.overzoom.registry.repository.MeasurementRepository;

@Service
public class MeasurementServiceImpl implements MeasurementService {

    private final MeasurementRepository measurementRepository;

    public MeasurementServiceImpl(MeasurementRepository measurementRepository) {
        this.measurementRepository = measurementRepository;
    }

    @Override
    public Page<Measurement> findBySourceId(String sourceId, Pageable pageable) {
        return measurementRepository.findBySourceId(sourceId, pageable);
    }

    @Override
    public Optional<Measurement> findById(String id) {
        return measurementRepository.findById(id);
    }

    @Override
    public boolean existsById(String id) {
        return measurementRepository.existsById(id);
    }

    @Override
    @Transactional
    public Measurement create(Measurement measurement) {
        return measurementRepository.save(measurement);
    }

    @Override
    @Transactional
    public Optional<Measurement> partialUpdate(String id, Measurement measurement) {
        return this.findById(id)
                .map(existingMeasurement -> {
                    if (measurement.getKey() != null) {
                        existingMeasurement.setKey(measurement.getKey());
                    }
                    if (measurement.getValue() != null) {
                        existingMeasurement.setValue(measurement.getValue());
                    }
                    return existingMeasurement;
                })
                .map(this::create);
    }

    @Override
    @Transactional
    public void deleteById(String id) throws ResourceNotFoundException, BadRequestException {
        measurementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Misurazione non trovata."));
        measurementRepository.deleteById(id);
    }
}