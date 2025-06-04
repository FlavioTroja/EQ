package it.overzoom.registry.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import it.overzoom.registry.model.IrradiationCondition;

public interface IrradiationConditionService {

    IrradiationCondition createCondition(String sourceId, IrradiationCondition ic);

    Optional<IrradiationCondition> getById(String id);

    List<IrradiationCondition> getAllBySource(String sourceId);

    Page<IrradiationCondition> getPageBySource(String sourceId, Pageable pageable);

    IrradiationCondition updateCondition(String id, IrradiationCondition updated);

    void deleteCondition(String id);

    boolean existsBySource(String sourceId);
}
