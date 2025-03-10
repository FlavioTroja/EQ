package it.overzoom.registry.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Source;

public interface SourceService {

    Page<Source> findByDepartmentId(String departmentId, Pageable pageable)
            throws ResourceNotFoundException, BadRequestException;

    Source findById(String id) throws ResourceNotFoundException, BadRequestException;

    boolean existsById(String id);

    Source create(Source department) throws ResourceNotFoundException, BadRequestException;

    // Optional<Source> update(Source department);

    // Optional<Source> partialUpdate(String id, Source department);
}