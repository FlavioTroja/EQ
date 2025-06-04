package it.overzoom.registry.service;

import java.util.List;
import java.util.Optional;

import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.IrradiationCondition;

public interface IrradiationConditionService {

    IrradiationCondition create(IrradiationCondition ic) throws ResourceNotFoundException, BadRequestException;

    Optional<IrradiationCondition> findById(String id);

    List<IrradiationCondition> findBySourceId(String sourceId) throws ResourceNotFoundException;

    Optional<IrradiationCondition> update(IrradiationCondition ic) throws ResourceNotFoundException, BadRequestException;

    Optional<IrradiationCondition> partialUpdate(String id, IrradiationCondition ic) throws ResourceNotFoundException;

    void deleteById(String id) throws ResourceNotFoundException, BadRequestException;

    public boolean existsById(String id);
}
