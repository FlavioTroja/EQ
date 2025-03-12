package it.overzoom.registry.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import it.overzoom.registry.model.Report;

@Repository
public interface ReportRepository extends MongoRepository<Report, String> {

    Page<Report> findByLocationId(String locationId, Pageable pageable);

    List<Report> findByLocationId(String locationId);
}
