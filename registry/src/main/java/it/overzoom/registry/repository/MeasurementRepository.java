package it.overzoom.registry.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import it.overzoom.registry.model.Measurement;

@Repository
public interface MeasurementRepository extends MongoRepository<Measurement, String> {

    Page<Measurement> findByIrradiationConditionId(String irradiationConditionId, Pageable pageable);

    List<Measurement> findByIrradiationConditionId(String irradiationConditionId);

    boolean existsByIrradiationConditionId(String irradiationConditionId);
}
