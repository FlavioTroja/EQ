package it.overzoom.registry.service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.overzoom.registry.dto.ReportDTO;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Customer;
import it.overzoom.registry.model.Department;
import it.overzoom.registry.model.Location;
import it.overzoom.registry.model.Measurement;
import it.overzoom.registry.model.Report;
import it.overzoom.registry.model.Source;
import it.overzoom.registry.repository.CustomerRepository;
import it.overzoom.registry.repository.DepartmentRepository;
import it.overzoom.registry.repository.LocationRepository;
import it.overzoom.registry.repository.MeasurementRepository;
import it.overzoom.registry.repository.ReportRepository;
import it.overzoom.registry.repository.SourceRepository;

@Service
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final LocationRepository locationRepository;
    private final CustomerRepository customerRepository;
    private final MeasurementRepository measurementRepository;
    private final DepartmentRepository departmentRepository;
    private final SourceRepository sourceRepository;

    public ReportServiceImpl(ReportRepository reportRepository, LocationRepository locationRepository,
            CustomerRepository customerRepository, MeasurementRepository measurementRepository,
            DepartmentRepository departmentRepository, SourceRepository sourceRepository) {
        this.reportRepository = reportRepository;
        this.locationRepository = locationRepository;
        this.customerRepository = customerRepository;
        this.measurementRepository = measurementRepository;
        this.departmentRepository = departmentRepository;
        this.sourceRepository = sourceRepository;
    }

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
    @Transactional
    public Report create(Report report) {
        return reportRepository.save(report);
    }

    @Override
    public ReportDTO prepare(String locationId) throws ResourceNotFoundException {
        ReportDTO reportDTO = new ReportDTO();

        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new ResourceNotFoundException("Sede non trovata."));

        Customer customer = customerRepository.findById(location.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente non trovato."));

        reportDTO.setLocation(location);
        reportDTO.setCustomer(customer);

        List<Department> departments = departmentRepository.findByLocationId(locationId);
        departments.forEach(dept -> {
            List<Source> sources = sourceRepository.findByDepartmentId(dept.getId());
            sources.forEach(source -> {
                List<Measurement> measurements = measurementRepository.findBySourceId(source.getId());
                source.setMeasurements(measurements);
            });
            dept.setSources(sources);
        });

        List<Measurement> allMeasurements = departments.stream()
                .filter(dept -> dept.getSources() != null)
                .flatMap(dept -> dept.getSources().stream())
                .filter(source -> source.getMeasurements() != null)
                .flatMap(source -> source.getMeasurements().stream())
                .collect(Collectors.toList());

        if (allMeasurements != null && !allMeasurements.isEmpty()) {
            LocalDate latestDay = allMeasurements.stream()
                    .map(m -> m.getDate().toLocalDate())
                    .max(Comparator.naturalOrder())
                    .orElse(null);

            List<Measurement> lastMeasurements = allMeasurements.stream()
                    .filter(m -> m.getDate().toLocalDate().equals(latestDay))
                    .collect(Collectors.toList());

            List<Measurement> prospectMeasurements = allMeasurements.stream()
                    .filter(m -> !m.getDate().toLocalDate().equals(latestDay))
                    .collect(Collectors.toList());

            reportDTO.setLastMeasurements(lastMeasurements);
            reportDTO.setProspectMeasurements(prospectMeasurements);
        }

        return reportDTO;
    }
}