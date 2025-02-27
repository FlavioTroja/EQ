package it.overzoom.registry.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Department;

public interface DepartmentService {

    Page<Department> findByLocationId(String locationId, Pageable pageable)
            throws ResourceNotFoundException, BadRequestException;

    Department findById(String id) throws ResourceNotFoundException, BadRequestException;

    boolean existsById(String id);

    Department create(Department department) throws ResourceNotFoundException, BadRequestException;

    // Optional<Department> update(Department department);

    // Optional<Department> partialUpdate(String id, Department department);
}