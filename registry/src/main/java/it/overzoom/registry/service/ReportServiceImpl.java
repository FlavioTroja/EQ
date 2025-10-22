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
import it.overzoom.registry.model.IrradiationCondition;
import it.overzoom.registry.model.Location;
import it.overzoom.registry.model.Measurement;
import it.overzoom.registry.model.Report;
import it.overzoom.registry.model.Source;
import it.overzoom.registry.repository.CustomerRepository;
import it.overzoom.registry.repository.DepartmentRepository;
import it.overzoom.registry.repository.IrradiationConditionRepository;
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
    private final IrradiationConditionRepository icRepository;

    public ReportServiceImpl(
            ReportRepository reportRepository,
            LocationRepository locationRepository,
            CustomerRepository customerRepository,
            MeasurementRepository measurementRepository,
            DepartmentRepository departmentRepository,
            SourceRepository sourceRepository,
            IrradiationConditionRepository icRepository) {

        this.reportRepository = reportRepository;
        this.locationRepository = locationRepository;
        this.customerRepository = customerRepository;
        this.measurementRepository = measurementRepository;
        this.departmentRepository = departmentRepository;
        this.sourceRepository = sourceRepository;
        this.icRepository = icRepository;
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

    /**
     * Prepara un ReportDTO per una determinata Location:
     * - recupera Location → Customer
     * - recupera tutti i Department legati a quella Location
     * - per ciascun Department, recupera tutte le Source
     * - per ciascuna Source, recupera tutte le IrradiationCondition
     * - per ciascuna IrradiationCondition, recupera tutte le Measurement
     * - infine, costruisce due liste di Measurement:
     * • lastMeasurements (quelle del giorno più recente)
     * • prospectMeasurements (il resto)
     */
    @Override
    public ReportDTO prepare(String locationId) throws ResourceNotFoundException {
        ReportDTO reportDTO = new ReportDTO();

        // 1) Verifico che la Location esista
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new ResourceNotFoundException("Sede non trovata."));

        // 2) Recupero il Customer
        Customer customer = customerRepository.findById(location.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente non trovato."));

        reportDTO.setLocation(location);
        reportDTO.setCustomer(customer);

        // 3) Recupero tutti i Department collegati a questa Location
        List<Department> departments = departmentRepository.findByLocationId(locationId);
        departments.forEach(dept -> {
            // 4) Per ogni Department, recupero tutte le Source
            List<Source> sources = sourceRepository.findByDepartmentId(dept.getId());

            sources.forEach(source -> {
                // 5) Per ogni Source, recupero tutte le IrradiationCondition
                List<IrradiationCondition> conditions = icRepository.findBySourceId(source.getId());

                // 6) Per ogni IrradiationCondition, recupero tutte le Measurement
                conditions.forEach(ic -> {
                    List<Measurement> measurements = measurementRepository
                            .findByIrradiationConditionId(ic.getId());
                    ic.setMeasurementPoints(measurements);
                });

                // 7) Assegno la lista di condizioni (popolate di misurazioni) alla Source
                source.setIrradiationConditions(conditions);
            });

            // 8) Assegno la lista di Source (popolate di condizioni) al Department
            dept.setSources(sources);
        });

        // 9) Ora costruisco la lista unica di tutte le misurazioni:
        // departments → sources → conditions → measurements
        List<Measurement> allMeasurements = departments.stream()
                // filtro eventuali dept senza sources
                .filter(dept -> dept.getSources() != null)
                .flatMap(dept -> dept.getSources().stream())
                // filtro eventuali source senza condizioni
                .filter(source -> source.getIrradiationConditions() != null)
                .flatMap(source -> source.getIrradiationConditions().stream())
                // filtro eventuali condition senza misurazioni
                .filter(ic -> ic.getMeasurementPoints() != null)
                .flatMap(ic -> ic.getMeasurementPoints().stream())
                .collect(Collectors.toList());

        if (!allMeasurements.isEmpty()) {
            // 10) Trovo il LocalDate più recente
            LocalDate latestDay = allMeasurements.stream()
                    .map(m -> m.getDate().toLocalDate())
                    .max(Comparator.naturalOrder())
                    .orElseThrow(); // non verrà mai lanciato perché la lista non è vuota

            // 11) Copio in due liste separate: quelle del giorno più recente e tutte le
            // altre
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
