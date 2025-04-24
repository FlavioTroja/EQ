package it.overzoom.registry.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import it.overzoom.registry.model.Source;

@Repository
public interface SourceRepository extends MongoRepository<Source, String> {

    Page<Source> findByDepartmentId(String departmentId, Pageable pageable);

    List<Source> findByDepartmentId(String departmentId);

    List<Source> findByMachine_Id(String machineId);
}
