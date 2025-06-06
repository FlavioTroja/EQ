package it.overzoom.registry.controller;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

import it.overzoom.registry.dto.DepartmentDTO;
import it.overzoom.registry.dto.LocationDTO;
import it.overzoom.registry.dto.MachineDTO;
import it.overzoom.registry.dto.SourceDTO;
import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.mapper.DepartmentMapper;
import it.overzoom.registry.mapper.LocationMapper;
import it.overzoom.registry.mapper.MachineMapper;
import it.overzoom.registry.mapper.SourceMapper;
import it.overzoom.registry.model.Location;
import it.overzoom.registry.repository.MachineRepository;
import it.overzoom.registry.service.CustomerService;
import it.overzoom.registry.service.LocationService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/registry/customers/{customerId}/locations")
public class LocationController {

    private static final Logger log = LoggerFactory.getLogger(LocationController.class);

    private final LocationService locationService;
    private final CustomerService customerService;
    private final MachineRepository machineRepository;
    private final LocationMapper locationMapper;
    private final DepartmentMapper departmentMapper;
    private final SourceMapper sourceMapper;
    private final MachineMapper machineMapper;

    public LocationController(
            LocationService locationService,
            CustomerService customerService,
            MachineRepository machineRepository,
            LocationMapper locationMapper,
            DepartmentMapper departmentMapper,
            SourceMapper sourceMapper,
            MachineMapper machineMapper) {
        this.locationService = locationService;
        this.customerService = customerService;
        this.machineRepository = machineRepository;
        this.locationMapper = locationMapper;
        this.departmentMapper = departmentMapper;
        this.sourceMapper = sourceMapper;
        this.machineMapper = machineMapper;
    }

    @GetMapping("")
    public ResponseEntity<List<LocationDTO>> findCustomerId(@PathVariable("customerId") String customerId)
            throws ResourceNotFoundException, BadRequestException {
        log.info("REST request to get a page of Locations by customerId: " + customerId);

        if (!customerService.hasAccess(customerId)) {
            throw new BadRequestException("Non hai i permessi per accedere a questa sede.");
        }

        List<LocationDTO> list = locationService.findByCustomerId(customerId);
        return ResponseEntity.ok().body(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LocationDTO> findById(@PathVariable("id") String locationId)
            throws ResourceNotFoundException, BadRequestException {

        // 1) Recupero entità Location (già popolata di Department e Source, ma senza
        // MachineDTO)
        Location location = locationService.findById(locationId);

        // 2) Controllo permessi
        if (!customerService.hasAccess(location.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per accedere a questa sede.");
        }

        // 3) Converto Location → LocationDTO
        LocationDTO locationDto = locationMapper.toDto(location);

        // 4) “Annido” Departments → Sources → MachineWithoutCustomers
        List<DepartmentDTO> deptDtos = location.getDepartments().stream()
                .map(deptEntity -> {
                    DepartmentDTO deptDto = departmentMapper.toDto(deptEntity);

                    List<SourceDTO> srcDtos = deptEntity.getSources().stream()
                            .map(srcEntity -> {
                                // 4.2.1) Mappa Source → SourceDTO (predefinito)
                                SourceDTO srcDto = sourceMapper.toDto(srcEntity);

                                // 4.2.2) Se c’è machineId, lo recupero e uso toDtoWithoutCustomers(...)
                                String machineId = srcEntity.getMachineId();
                                if (machineId != null) {
                                    machineRepository.findById(machineId).ifPresent(machineEntity -> {
                                        // Ecco la differenza: uso toDtoWithoutCustomers
                                        MachineDTO mDto = machineMapper.toDtoWithoutCustomers(machineEntity);
                                        srcDto.setMachine(mDto);
                                    });
                                }

                                // mantieni eventuali altri campi di SourceDTO
                                return srcDto;
                            })
                            .collect(Collectors.toList());

                    deptDto.setSources(srcDtos);
                    deptDto.setCompletedSources(srcDtos.size());
                    return deptDto;
                })
                .collect(Collectors.toList());

        locationDto.setDepartments(deptDtos);
        locationDto.setCompletedDepartments(deptDtos.size());

        return ResponseEntity.ok(locationDto);
    }

    @PostMapping("")
    public ResponseEntity<Location> create(@PathVariable("customerId") String customerId,
            @Valid @RequestBody Location location)
            throws BadRequestException, URISyntaxException, ResourceNotFoundException {
        log.info("REST request to save Location : " + location.toString());
        if (location.getId() != null) {
            throw new BadRequestException("Una nuova sede non può già avere un ID");
        }
        location.setCustomerId(customerId);
        location = locationService.create(location);
        return ResponseEntity
                .created(new URI(
                        "/api/registry/customers/" + location.getCustomerId() + "/locations/" + location.getId()))
                .body(location);
    }

    @PutMapping("")
    public ResponseEntity<Location> update(@Valid @RequestBody Location location)
            throws BadRequestException, ResourceNotFoundException {
        log.info("REST request to update Location: " + location.toString());
        if (location.getId() == null) {
            throw new BadRequestException("ID invalido.");
        }
        if (!locationService.existsById(location.getId())) {
            throw new ResourceNotFoundException("Cliente non trovato.");
        }

        Location updateLocation = locationService.update(location);

        return ResponseEntity.ok().body(updateLocation);
    }

    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Location> partialUpdate(@PathVariable("id") String id,
            @RequestBody Location location) throws BadRequestException, ResourceNotFoundException {
        log.info("REST request to partial update Location: " + location.toString());
        if (id == null) {
            throw new BadRequestException("ID invalido.");
        }
        if (!locationService.existsById(id)) {
            throw new ResourceNotFoundException("Cliente non trovato.");
        }

        Location updateLocation = locationService.partialUpdate(id, location);

        return ResponseEntity.ok().body(updateLocation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String locationId)
            throws ResourceNotFoundException, BadRequestException {

        Location loc = locationService.findById(locationId);

        if (!customerService.hasAccess(loc.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per accedere a questa sede.");
        }

        locationService.deleteById(locationId);

        return ResponseEntity.noContent().build();
    }
}
