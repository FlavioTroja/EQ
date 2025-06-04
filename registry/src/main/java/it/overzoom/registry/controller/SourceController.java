package it.overzoom.registry.controller;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    private final SourceService sourceService;
    private final DepartmentService departmentService;
    private final LocationService locationService;
    private final CustomerService customerService;

    public SourceController(
            DepartmentService departmentService,
            LocationService locationService,
            CustomerService customerService,
            SourceService sourceService) {
        this.departmentService = departmentService;
        this.locationService = locationService;
        this.customerService = customerService;
        this.sourceService = sourceService;
    }

    /**
     * GET paginato di tutte le Source per un Department.
     *
     * Esempio: GET /api/registry/departments/dep123/sources?page=0&size=10
     */
    @GetMapping
    public ResponseEntity<List<Source>> findByDepartmentId(
            @PathVariable("departmentId") String departmentId) throws ResourceNotFoundException, BadRequestException {

        log.info("REST request to get a page of Sources by departmentId: {}", departmentId);

        Department department = departmentService.findById(departmentId);
        Location location = locationService.findById(department.getLocationId());
        if (!customerService.hasAccess(location.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per accedere a queste sorgenti.");
        }

        List<Source> list = sourceService.findByDepartmentId(departmentId);
        return ResponseEntity.ok(list);
    }

    /**
     * GET di una singola Source.
     *
     * Esempio: GET /api/registry/departments/dep123/sources/src456
     */
    @GetMapping("/{id}")
    public ResponseEntity<Source> findById(
            @PathVariable("departmentId") String departmentId,
            @PathVariable("id") String sourceId)
            throws ResourceNotFoundException, BadRequestException {

        Source source = sourceService.findById(sourceId);
        // Verifico che sia effettivamente sotto il Department corretto
        if (!source.getDepartmentId().equals(departmentId)) {
            throw new BadRequestException("La sorgente non appartiene a questo dipartimento.");
        }

        Department department = departmentService.findById(source.getDepartmentId());
        Location location = locationService.findById(department.getLocationId());
        if (!customerService.hasAccess(location.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per accedere a questa sorgente.");
        }

        return ResponseEntity.ok(source);
    }

    /**
     * POST di una nuova Source sotto un Department.
     *
     * Esempio: POST /api/registry/departments/dep123/sources
     */
    @PostMapping
    public ResponseEntity<Source> create(
            @PathVariable("departmentId") String departmentId,
            @Valid @RequestBody Source source)
            throws BadRequestException, URISyntaxException, ResourceNotFoundException {

        log.info("REST request to save Source : {}", source);

        if (source.getId() != null) {
            throw new BadRequestException("Una nuova sorgente non può già avere un ID");
        }

        Department department = departmentService.findById(departmentId);
        Location location = locationService.findById(department.getLocationId());
        if (!customerService.hasAccess(location.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per creare questa sorgente.");
        }

        source.setDepartmentId(departmentId);
        Source created = sourceService.create(source);

        return ResponseEntity
                .created(new URI("/api/registry/departments/" + departmentId + "/sources/" + created.getId()))
                .body(created);
    }

    /**
     * PUT (full update) di una Source.
     *
     * Esempio: PUT /api/registry/departments/dep123/sources
     */
    @PutMapping
    public ResponseEntity<Source> update(@Valid @RequestBody Source source)
            throws BadRequestException, ResourceNotFoundException {

        log.info("REST request to update Source: {}", source);

        if (source.getId() == null) {
            throw new BadRequestException("ID invalido.");
        }

        // Non c'è bisogno di verificare di nuovo il Department qui, 
        // perché il service provvede a salvare direttamente l’oggetto con il departmentId già impostato.
        Source updated = sourceService.update(source)
                .orElseThrow(() -> new ResourceNotFoundException("Sorgente non trovata."));

        return ResponseEntity.ok(updated);
    }

    /**
     * PATCH (partial update) di una Source.
     *
     * Esempio: PATCH /api/registry/departments/dep123/sources/src456
     */
    @PatchMapping("/{id}")
    public ResponseEntity<Source> partialUpdate(
            @PathVariable("departmentId") String departmentId,
            @PathVariable("id") String id,
            @RequestBody Source source)
            throws BadRequestException, ResourceNotFoundException {

        log.info("REST request to partial update Source: {}", source);

        if (!sourceService.existsById(id)) {
            throw new ResourceNotFoundException("Sorgente non trovata con questo ID: " + id);
        }

        Source existing = sourceService.findById(id);
        if (!existing.getDepartmentId().equals(departmentId)) {
            throw new BadRequestException("La sorgente non appartiene a questo dipartimento.");
        }

        Department department = departmentService.findById(existing.getDepartmentId());
        Location location = locationService.findById(department.getLocationId());
        if (!customerService.hasAccess(location.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per modificare questa sorgente.");
        }

        Source updated = sourceService.partialUpdate(id, source)
                .orElseThrow(() -> new ResourceNotFoundException("Errore durante il partial update di Source."));

        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE di una Source.
     *
     * Esempio: DELETE /api/registry/departments/dep123/sources/src456
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable("departmentId") String departmentId,
            @PathVariable("id") String sourceId)
            throws ResourceNotFoundException, BadRequestException {

        Source src = sourceService.findById(sourceId);
        if (!src.getDepartmentId().equals(departmentId)) {
            throw new BadRequestException("La sorgente non appartiene a questo dipartimento.");
        }

        Department dept = departmentService.findById(src.getDepartmentId());
        Location loc = locationService.findById(dept.getLocationId());
        if (!customerService.hasAccess(loc.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per cancellare questa sorgente.");
        }

        sourceService.deleteById(sourceId);
        return ResponseEntity.noContent().build();
    }
}
