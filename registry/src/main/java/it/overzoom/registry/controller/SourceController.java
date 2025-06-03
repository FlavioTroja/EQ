package it.overzoom.registry.controller;

import java.net.URI;
import java.net.URISyntaxException;

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

import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Department;
import it.overzoom.registry.model.Location;
import it.overzoom.registry.model.Source;
import it.overzoom.registry.service.CustomerService;
import it.overzoom.registry.service.DepartmentService;
import it.overzoom.registry.service.LocationService;
import it.overzoom.registry.service.SourceService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/registry/departments/{departmentId}/sources")
public class SourceController {

    private static final Logger log = LoggerFactory.getLogger(SourceController.class);
    private final DepartmentService departmentService;
    private final LocationService locationService;
    private final CustomerService customerService;
    private final SourceService sourceService;

    public SourceController(DepartmentService departmentService, LocationService locationService,
            CustomerService customerService, SourceService sourceService) {
        this.departmentService = departmentService;
        this.locationService = locationService;
        this.customerService = customerService;
        this.sourceService = sourceService;
    }

    @GetMapping("")
    public ResponseEntity<Page<Source>> findDepartmentId(@PathVariable("departmentId") String departmentId,
            Pageable pageable) throws ResourceNotFoundException, BadRequestException {
        log.info("REST request to get a page of Sources by departmentId: " + departmentId);

        Department department = departmentService.findById(departmentId);
        Location location = locationService.findById(department.getLocationId());
        if (!customerService.hasAccess(location.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per accedere a questa sorgente.");
        }

        Page<Source> page = sourceService.findByDepartmentId(departmentId, pageable);
        return ResponseEntity.ok().body(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Source> findById(@PathVariable(value = "id") String sourceId)
            throws ResourceNotFoundException, BadRequestException {

        Source source = sourceService.findById(sourceId);
        Department department = departmentService.findById(source.getDepartmentId());
        Location location = locationService.findById(department.getLocationId());
        if (!customerService.hasAccess(location.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per accedere a questa sorgente.");
        }
        return ResponseEntity.ok(source);
    }

    @PostMapping("")
    public ResponseEntity<Source> create(@PathVariable("departmentId") String departmentId,
            @Valid @RequestBody Source source)
            throws BadRequestException, URISyntaxException, ResourceNotFoundException {
        log.info("REST request to save Source : " + source.toString());
        if (source.getId() != null) {
            throw new BadRequestException("Una nuova sede non può già avere un ID");
        }

        Department department = departmentService.findById(departmentId);
        Location location = locationService.findById(department.getLocationId());
        if (!customerService.hasAccess(location.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per accedere a questa sorgente.");
        }

        source.setDepartmentId(departmentId);
        source = sourceService.create(source);
        return ResponseEntity
                .created(new URI(
                        "/api/registry/departments/" + source.getDepartmentId() + "/sources/" + source.getId()))
                .body(source);
    }

    @PutMapping("")
    public ResponseEntity<Source> update(@Valid @RequestBody Source source)
            throws BadRequestException, ResourceNotFoundException {
        log.info("REST request to update Source: " + source.toString());
        if (source.getId() == null) {
            throw new BadRequestException("ID invalido.");
        }

        Source updateSource = sourceService.update(source)
                .orElseThrow(() -> new ResourceNotFoundException("Sorgente non trovata."));

        return ResponseEntity.ok().body(updateSource);
    }

    @PatchMapping(value = "/{id}", consumes = { "application/json",
            "application/merge-patch+json" })
    public ResponseEntity<Source> partialUpdate(@PathVariable(value = "id") String id,
            @RequestBody Source source) throws BadRequestException,
            ResourceNotFoundException {
        log.info("REST request to partial update Source: " +
                source.toString());
        if (id == null) {
            throw new BadRequestException("ID invalido.");
        }

        Source updateSource = sourceService.partialUpdate(id, source).orElseThrow(
                () -> new ResourceNotFoundException("Sorgente non trovata con questo ID :: " + id));

        return ResponseEntity.ok().body(updateSource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String sourceId)
            throws ResourceNotFoundException, BadRequestException {

        Source src = sourceService.findById(sourceId);

        Department dept = departmentService.findById(src.getDepartmentId());
        Location loc = locationService.findById(dept.getLocationId());
        if (!customerService.hasAccess(loc.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per accedere a questa sorgente.");
        }

        sourceService.deleteById(sourceId);

        return ResponseEntity.noContent().build();
    }
}
