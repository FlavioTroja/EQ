package it.overzoom.registry.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import it.overzoom.registry.model.Department;

@Repository
public interface DepartmentRepository extends MongoRepository<Department, String> {

    Page<Department> findByLocationId(String locationId, Pageable pageable);

    List<Department> findByLocationId(String locationId);

    List<Department> findByIdIn(List<String> ids);

}
