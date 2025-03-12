package it.overzoom.registry.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import it.overzoom.registry.model.Report;
import it.overzoom.registry.repository.ReportRepository;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Override
    public Page<Report> findByLocationId(String locationId, Pageable pageable) {
        return reportRepository.findByLocationId(locationId, pageable);
    }

    @Override
    public Optional<Report> findById(String id) {
        return reportRepository.findById(id);
    }

    @Override
    public boolean existsById(String id) {
        return reportRepository.existsById(id);
    }

    @Override
    public Report create(Report report) {
        return reportRepository.save(report);
    }
}