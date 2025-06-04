package it.overzoom.registry.service;

import java.util.List;
import java.util.Optional;

import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Department;

public interface DepartmentService {

    List<Department> findByLocationId(String locationId)
            throws ResourceNotFoundException, BadRequestException;

    Department findById(String id) throws ResourceNotFoundException, BadRequestException;

    boolean existsById(String id);

    Department create(Department department) throws ResourceNotFoundException, BadRequestException;

    Optional<Department> update(Department department);

    Optional<Department> partialUpdate(String id, Department department);

    void deleteById(String id) throws BadRequestException, ResourceNotFoundException;
}