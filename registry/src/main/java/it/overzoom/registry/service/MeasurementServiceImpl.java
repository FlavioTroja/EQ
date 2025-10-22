package it.overzoom.registry.service;

import java.util.List;
import java.util.Optional;

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
    public List<Measurement> findByIrradiationConditionId(String irradiationConditionId) {
        return measurementRepository.findByIrradiationConditionId(irradiationConditionId);
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
    public Optional<Measurement> partialUpdate(String id, Measurement m) {
        return measurementRepository.findById(id)
                .map(existing -> {
                    if (m.getDate() != null)
                        existing.setDate(m.getDate());
                    if (m.getName() != null)
                        existing.setName(m.getName());
                    if (m.getUnitMeasurement1() != null)
                        existing.setUnitMeasurement1(m.getUnitMeasurement1());
                    if (m.getUnitMeasurement2() != null)
                        existing.setUnitMeasurement2(m.getUnitMeasurement2());
                    if (m.getValue1() != null)
                        existing.setValue1(m.getValue1());
                    if (m.getValue2() != null)
                        existing.setValue2(m.getValue2());
                    if (m.getIrradiationConditionId() != null)
                        existing.setIrradiationConditionId(m.getIrradiationConditionId());
                    return measurementRepository.save(existing);
                });
    }

    @Override
    @Transactional
    public void deleteById(String id) throws ResourceNotFoundException, BadRequestException {
        measurementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Misurazione non trovata."));
        measurementRepository.deleteById(id);
    }

    @Override
    public boolean existsByIrradiationConditionId(String irradiationConditionId) {
        return measurementRepository.existsByIrradiationConditionId(irradiationConditionId);
    }

    @Override
    @Transactional
    public void deleteAll(List<Measurement> measurements) {
        measurementRepository.deleteAll(measurements);
    }
}