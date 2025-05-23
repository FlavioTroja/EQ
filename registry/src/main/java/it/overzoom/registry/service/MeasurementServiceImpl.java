package it.overzoom.registry.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import it.overzoom.registry.model.Measurement;
import it.overzoom.registry.repository.MeasurementRepository;

@Service
public class MeasurementServiceImpl implements MeasurementService {

    @Autowired
    private MeasurementRepository measurementRepository;

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
    public Measurement create(Measurement measurement) {
        return measurementRepository.save(measurement);
    }

    @Override
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
}