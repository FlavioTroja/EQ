package it.overzoom.registry.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import it.overzoom.registry.model.IrradiationCondition;

@Repository
public interface IrradiationConditionRepository extends MongoRepository<IrradiationCondition, String> {

    Page<IrradiationCondition> findBySourceId(String sourceId, Pageable pageable);

    List<IrradiationCondition> findBySourceId(String sourceId);

    boolean existsBySourceId(String sourceId);
}
