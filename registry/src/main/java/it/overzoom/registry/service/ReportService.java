package it.overzoom.registry.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import it.overzoom.registry.dto.ReportDTO;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Report;

public interface ReportService {

    Page<Report> findByLocationId(String sourceId, Pageable pageable);

    Optional<Report> findById(String id);

    boolean existsById(String id);

    Report create(Report report);

    ReportDTO prepare(String locationId) throws ResourceNotFoundException;
}