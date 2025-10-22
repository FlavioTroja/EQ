package it.overzoom.registry.controller;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.overzoom.registry.dto.CustomerDTO;
import it.overzoom.registry.dto.DepartmentDTO;
import it.overzoom.registry.dto.IrradiationConditionDTO;
import it.overzoom.registry.dto.LocationDTO;
import it.overzoom.registry.dto.MeasurementDTO;
import it.overzoom.registry.dto.SourceDTO;
import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.mapper.CustomerMapper;
import it.overzoom.registry.mapper.DepartmentMapper;
import it.overzoom.registry.mapper.IrradiationConditionMapper;
import it.overzoom.registry.mapper.LocationMapper;
import it.overzoom.registry.mapper.MeasurementMapper;
import it.overzoom.registry.mapper.SourceMapper;
import it.overzoom.registry.model.Customer;
import it.overzoom.registry.repository.DepartmentRepository;
import it.overzoom.registry.repository.IrradiationConditionRepository;
import it.overzoom.registry.repository.LocationRepository;
import it.overzoom.registry.repository.MeasurementRepository;
import it.overzoom.registry.repository.SourceRepository;
import it.overzoom.registry.security.SecurityUtils;
import it.overzoom.registry.service.CustomerService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/registry/customers")
public class CustomerController {

    private static final Logger log = LoggerFactory.getLogger(CustomerController.class);
    private final CustomerService customerService;
    private final CustomerMapper customerMapper;
    private final LocationRepository locationRepository;
    private final LocationMapper locationMapper;
    private final DepartmentMapper departmentMapper;
    private final SourceMapper sourceMapper;
    private final DepartmentRepository departmentRepository;
    private final SourceRepository sourceRepository;
    private final IrradiationConditionRepository irradiationConditionRepository;
    private final IrradiationConditionMapper irradiationConditionMapper;
    private final MeasurementRepository measurementRepository;
    private final MeasurementMapper measurementMapper;

    public CustomerController(CustomerService customerService, CustomerMapper customerMapper,
            LocationRepository locationRepository, LocationMapper locationMapper, DepartmentMapper departmentMapper,
            SourceMapper sourceMapper, IrradiationConditionRepository irradiationConditionRepository,
            IrradiationConditionMapper irradiationConditionMapper, MeasurementRepository measurementRepository,
            MeasurementMapper measurementMapper, DepartmentRepository departmentRepository,
            SourceRepository sourceRepository) {
        this.locationRepository = locationRepository;
        this.customerService = customerService;
        this.customerMapper = customerMapper;
        this.locationMapper = locationMapper;
        this.departmentMapper = departmentMapper;
        this.sourceMapper = sourceMapper;
        this.irradiationConditionRepository = irradiationConditionRepository;
        this.irradiationConditionMapper = irradiationConditionMapper;
        this.measurementRepository = measurementRepository;
        this.measurementMapper = measurementMapper;
        this.departmentRepository = departmentRepository;
        this.sourceRepository = sourceRepository;
    }

    @GetMapping("")
    public ResponseEntity<Page<CustomerDTO>> findAll(Pageable pageable) throws ResourceNotFoundException {
        log.info("REST request to get a page of Customers");
        Page<CustomerDTO> page = !SecurityUtils.isAdmin()
                ? customerService.findByUserId(SecurityUtils.getCurrentUserId(), pageable)
                : customerService.findAll(pageable).map(customerMapper::toDto);
        return ResponseEntity.ok().body(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> findById(@PathVariable("id") String customerId)
            throws ResourceNotFoundException, BadRequestException {

        if (!customerService.hasAccess(customerId)) {
            throw new BadRequestException("Non hai i permessi per accedere a questo cliente.");
        }

        // Recupera l'entità pura dal service
        Customer customer = customerService.findById(customerId);

        // Inizia il mapping
        CustomerDTO dto = customerMapper.toDto(customer);

        // Locations
        List<LocationDTO> locDtos = locationRepository.findByCustomerId(customerId)
                .stream()
                .map(locationMapper::toDto)
                .collect(Collectors.toList());
        dto.setLocations(locDtos);

        // Per ogni Location → Departments → Sources → Irradiation → Measurements
        locDtos.forEach(locDto -> {
            List<DepartmentDTO> deptDtos = departmentRepository.findByLocationId(locDto.getId())
                    .stream()
                    .map(departmentMapper::toDto)
                    .collect(Collectors.toList());
            locDto.setDepartments(deptDtos);
            locDto.setCompletedDepartments(deptDtos.size());

            deptDtos.forEach(deptDto -> {
                List<SourceDTO> srcDtos = sourceRepository.findByDepartmentId(deptDto.getId())
                        .stream()
                        .map(sourceMapper::toDto)
                        .collect(Collectors.toList());
                deptDto.setSources(srcDtos);
                deptDto.setCompletedSources(srcDtos.size());

                srcDtos.forEach(srcDto -> {
                    List<IrradiationConditionDTO> icDtos = irradiationConditionRepository.findBySourceId(srcDto.getId())
                            .stream()
                            .map(irradiationConditionMapper::toDto)
                            .collect(Collectors.toList());
                    srcDto.setIrradiationConditions(icDtos);
                    srcDto.setCompletedIrradiationConditions(icDtos.size());

                    icDtos.forEach(icDto -> {
                        List<MeasurementDTO> mDtos = measurementRepository.findByIrradiationConditionId(icDto.getId())
                                .stream()
                                .map(measurementMapper::toDto)
                                .collect(Collectors.toList());
                        icDto.setMeasurementPoints(mDtos);
                        icDto.setCompletedMeasurements(mDtos.size());
                    });
                });
            });
        });

        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<CustomerDTO> create(@Valid @RequestBody CustomerDTO dto)
            throws BadRequestException, URISyntaxException, ResourceNotFoundException {
        log.info("REST request to save Customer : {}", dto);
        if (dto.getId() != null) {
            throw new BadRequestException("Un nuovo cliente non può già avere un ID");
        }
        dto.setUserId(SecurityUtils.getCurrentUserId());
        CustomerDTO result = customerService.createWithNested(dto);
        return ResponseEntity
                .created(new URI("/api/registry/customers/" + result.getId()))
                .body(result);
    }

    @PutMapping("")
    public ResponseEntity<CustomerDTO> update(@Valid @RequestBody Customer customer)
            throws BadRequestException, ResourceNotFoundException {
        log.info("REST request to update Customer: " + customer.toString());
        if (customer.getId() == null) {
            throw new BadRequestException("ID invalido.");
        }
        if (!customerService.existsById(customer.getId())) {
            throw new ResourceNotFoundException("Cliente non trovato.");
        }

        CustomerDTO updateCustomer = customerService.update(customer);

        return ResponseEntity.ok().body(updateCustomer);
    }

    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CustomerDTO> partialUpdate(@PathVariable("id") String id,
            @RequestBody Customer customer) throws BadRequestException, ResourceNotFoundException {
        log.info("REST request to partial update Customer: " + customer.toString());
        if (id == null) {
            throw new BadRequestException("ID invalido.");
        }
        if (!customerService.existsById(id)) {
            throw new ResourceNotFoundException("Cliente non trovato.");
        }

        CustomerDTO updateCustomer = customerService.partialUpdate(id, customer);

        return ResponseEntity.ok().body(updateCustomer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable("id") String customerId)
            throws ResourceNotFoundException, BadRequestException {

        if (!customerService.existsById(customerId)) {
            throw new ResourceNotFoundException("Cliente non trovato.");
        }
        customerService.deleteById(customerId);
        return ResponseEntity.noContent().build();
    }

}
