package it.overzoom.registry.service;

import java.util.List;
import java.util.Optional;

import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Source;

public interface SourceService {

    List<Source> findByDepartmentId(String departmentId)
            throws ResourceNotFoundException, BadRequestException;

    Source findById(String id) throws ResourceNotFoundException, BadRequestException;

    boolean existsById(String id);

    Source create(Source department) throws ResourceNotFoundException, BadRequestException;

    Optional<Source> update(Source department);

    Optional<Source> partialUpdate(String id, Source department) throws ResourceNotFoundException, BadRequestException;

    void deleteById(String id) throws BadRequestException, ResourceNotFoundException;

    boolean existsByDepartmentId(String departmentId);
}