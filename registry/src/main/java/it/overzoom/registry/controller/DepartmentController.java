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
import it.overzoom.registry.service.CustomerService;
import it.overzoom.registry.service.DepartmentService;
import it.overzoom.registry.service.LocationService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/registry/locations/{locationId}/departments")
public class DepartmentController {

    private static final Logger log = LoggerFactory.getLogger(DepartmentController.class);
    private final LocationService locationService;
    private final CustomerService customerService;
    private final DepartmentService departmentService;

    public DepartmentController(LocationService locationService, CustomerService customerService,
            DepartmentService departmentService) {
        this.locationService = locationService;
        this.customerService = customerService;
        this.departmentService = departmentService;
    }

    @GetMapping("")
    public ResponseEntity<Page<Department>> findLocationId(@PathVariable("locationId") String locationId,
            Pageable pageable) throws ResourceNotFoundException, BadRequestException {
        log.info("REST request to get a page of Departments by locationId: " + locationId);

        Location location = locationService.findById(locationId);
        if (!customerService.hasAccess(location.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per accedere a questo cliente.");
        }

        Page<Department> page = departmentService.findByLocationId(locationId, pageable);
        return ResponseEntity.ok().body(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> findById(@PathVariable(value = "id") String departmentId)
            throws ResourceNotFoundException, BadRequestException {

        Department department = departmentService.findById(departmentId);
        Location location = locationService.findById(department.getLocationId());
        if (!customerService.hasAccess(location.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per accedere a questo reparto.");
        }
        return ResponseEntity.ok(department);
    }

    @PostMapping("")
    public ResponseEntity<Department> create(@PathVariable("id") String locationId,
            @Valid @RequestBody Department department)
            throws BadRequestException, URISyntaxException, ResourceNotFoundException {
        log.info("REST request to save Department : " + department.toString());
        if (department.getId() != null) {
            throw new BadRequestException("Una nuova sede non può già avere un ID");
        }

        Location location = locationService.findById(locationId);
        if (!customerService.hasAccess(location.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per accedere a questo reparto.");
        }

        department.setLocationId(locationId);
        department = departmentService.create(department);
        return ResponseEntity
                .created(new URI(
                        "/api/registry/locations/" + department.getLocationId() + "/departments/" + department.getId()))
                .body(department);
    }

    @PutMapping("")
    public ResponseEntity<Department> update(@Valid @RequestBody Department department)
            throws BadRequestException, ResourceNotFoundException {
        log.info("REST request to update Department: " + department.toString());
        if (department.getId() == null) {
            throw new BadRequestException("ID invalido.");
        }
        if (!departmentService.existsById(department.getId())) {
            throw new ResourceNotFoundException("Cliente non trovato.");
        }

        Department updateDepartment = departmentService.update(department).orElseThrow(
                () -> new ResourceNotFoundException("Reparto non trovato con questo ID :: " + department.getId()));

        return ResponseEntity.ok().body(updateDepartment);
    }

    @PatchMapping(value = "/{id}", consumes = { "application/json",
            "application/merge-patch+json" })
    public ResponseEntity<Department> partialUpdate(@PathVariable(value = "id") String id,
            @RequestBody Department department) throws BadRequestException,
            ResourceNotFoundException {
        log.info("REST request to partial update Department: " +
                department.toString());
        if (id == null) {
            throw new BadRequestException("ID invalido.");
        }
        if (!departmentService.existsById(id)) {
            throw new ResourceNotFoundException("Cliente non trovato.");
        }

        Department updateDepartment = departmentService.partialUpdate(id, department)
                .orElseThrow(() -> new ResourceNotFoundException("Reparto non trovato con questo ID :: " + id));

        return ResponseEntity.ok().body(updateDepartment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String departmentId)
            throws ResourceNotFoundException, BadRequestException {

        Department dept = departmentService.findById(departmentId);

        Location loc = locationService.findById(dept.getLocationId());
        if (!customerService.hasAccess(loc.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per accedere a questo reparto.");
        }

        departmentService.deleteById(departmentId);

        return ResponseEntity.noContent().build();
    }
}
