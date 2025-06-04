package it.overzoom.registry.controller;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.IrradiationCondition;
import it.overzoom.registry.model.Measurement;
import it.overzoom.registry.model.Source;
import it.overzoom.registry.service.CustomerService;
import it.overzoom.registry.service.IrradiationConditionService;
import it.overzoom.registry.service.LocationService;
import it.overzoom.registry.service.MeasurementService;
import it.overzoom.registry.service.SourceService;
import it.overzoom.registry.service.DepartmentService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/registry/irradiation-conditions/{irradiationConditionId}/measurements")
public class MeasurementController {

    private static final Logger log = LoggerFactory.getLogger(MeasurementController.class);
    private final MeasurementService measurementService;
    private final IrradiationConditionService icService;
    private final SourceService sourceService;
    private final DepartmentService departmentService;
    private final LocationService locationService;
    private final CustomerService customerService;

    public MeasurementController(
            MeasurementService measurementService,
            IrradiationConditionService icService,
            SourceService sourceService,
            DepartmentService departmentService,
            LocationService locationService,
            CustomerService customerService) {
        this.measurementService = measurementService;
        this.icService = icService;
        this.sourceService = sourceService;
        this.departmentService = departmentService;
        this.locationService = locationService;
        this.customerService = customerService;
    }

    /**
     * GET paginato di Measurement per una data IrradiationCondition.
     * Controlla i permessi leggendo la Source padre.
     *
     * Esempio: GET /api/registry/irradiation-conditions/cond123/measurements?page=0&size=10
     */
    @GetMapping
    public ResponseEntity<List<Measurement>> findByIrradiationConditionId(
            @PathVariable("irradiationConditionId") String irradiationConditionId,
            Pageable pageable) throws ResourceNotFoundException, BadRequestException {

        log.info("REST request to get a page of Measurements for IrradiationCondition {}", irradiationConditionId);

        // 1) Verifico che la condizione esista
        IrradiationCondition ic = icService.findById(irradiationConditionId).orElseThrow(() ->
                new ResourceNotFoundException("Condizione di irradiazione non trovata con ID: " + irradiationConditionId));

        // 2) Recupero la Source padre
        Source src = sourceService.findById(ic.getSourceId());
        // 3) Controllo permessi utente
        String deptId = src.getDepartmentId();
        var dept = departmentService.findById(deptId);
        var loc = locationService.findById(dept.getLocationId());
        if (!customerService.hasAccess(loc.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per accedere alle misurazioni di questa condizione.");
        }

        // 4) Chiamo il service per la pagina di misurazioni
        List<Measurement> list = measurementService.findByIrradiationConditionId(irradiationConditionId);
        return ResponseEntity.ok(list);
    }

    /**
     * POST di una nuova Measurement sotto una specifica IrradiationCondition.
     *
     * Esempio: POST /api/registry/irradiation-conditions/cond123/measurements
     */
    @PostMapping
    public ResponseEntity<Measurement> create(
            @PathVariable("irradiationConditionId") String irradiationConditionId,
            @Valid @RequestBody Measurement measurement)
            throws BadRequestException, URISyntaxException, ResourceNotFoundException {

        log.info("REST request to save Measurement : {}", measurement);

        // 1) ID non deve già esistere
        if (measurement.getId() != null) {
            throw new BadRequestException("Una nuova misurazione non può già avere un ID");
        }

        // 2) Verifico che la condizione esista
        IrradiationCondition ic = icService.findById(irradiationConditionId)
                .orElseThrow(() -> new ResourceNotFoundException("Condizione di irradiazione non trovata con ID: " + irradiationConditionId));

        // 3) Controllo permessi sulla Source padre
        Source src = sourceService.findById(ic.getSourceId());
        var dept = departmentService.findById(src.getDepartmentId());
        var loc = locationService.findById(dept.getLocationId());
        if (!customerService.hasAccess(loc.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per aggiungere una misurazione a questa condizione.");
        }

        // 4) Imposto la FK e la data corrente
        measurement.setIrradiationConditionId(irradiationConditionId);
        measurement.setDate(LocalDateTime.now());

        // 5) Salvo, service si occuperà di aggiornare anche completedMeasurements su Source
        Measurement saved = measurementService.create(measurement);

        // 6) Rispondo con 201 Created
        return ResponseEntity
                .created(new URI("/api/registry/measurements/" + saved.getId()))
                .body(saved);
    }

    /**
     * PATCH (partial update) di una Measurement esistente.
     *
     * Esempio: PATCH /api/registry/irradiation-conditions/cond123/measurements/{id}
     */
    @PatchMapping("/{id}")
    public ResponseEntity<Measurement> partialUpdate(
            @PathVariable("irradiationConditionId") String irradiationConditionId,
            @PathVariable("id") String id,
            @RequestBody Measurement measurement)
            throws BadRequestException, ResourceNotFoundException {

        log.info("REST request to partial update Measurement: {}", measurement);

        // 1) Verifico coerenza condizione ↔ misurazione
        if (!measurementService.existsById(id)) {
            throw new ResourceNotFoundException("Misurazione non trovata con ID: " + id);
        }
        Measurement existing = measurementService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Misurazione non trovata con ID: " + id));

        if (!existing.getIrradiationConditionId().equals(irradiationConditionId)) {
            throw new BadRequestException("La misurazione non appartiene a questa IrradiationCondition");
        }

        // 2) Permessi sulla Source padre
        IrradiationCondition ic = icService.findById(irradiationConditionId).orElseThrow(() ->
                new ResourceNotFoundException("Condizione di irradiazione non trovata con ID: " + irradiationConditionId));
        Source src = sourceService.findById(ic.getSourceId());
        var dept = departmentService.findById(src.getDepartmentId());
        var loc = locationService.findById(dept.getLocationId());
        if (!customerService.hasAccess(loc.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per modificare questa misurazione.");
        }

        // 3) Effettuo l’aggiornamento parziale
        Measurement updated = measurementService.partialUpdate(id, measurement)
                .orElseThrow(() -> new ResourceNotFoundException("Errore nell’aggiornamento della misurazione."));

        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE di una Measurement.
     *
     * Esempio: DELETE /api/registry/irradiation-conditions/cond123/measurements/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable("irradiationConditionId") String irradiationConditionId,
            @PathVariable("id") String measurementId)
            throws ResourceNotFoundException, BadRequestException {

        // 1) Verifico che la misurazione esista e appartenga alla condizione
        Measurement m = measurementService.findById(measurementId)
                .orElseThrow(() -> new ResourceNotFoundException("Misurazione non trovata."));

        if (!m.getIrradiationConditionId().equals(irradiationConditionId)) {
            throw new BadRequestException("La misurazione non appartiene a questa IrradiationCondition.");
        }

        // 2) Permessi utente (risalgo fino alla Source)
        IrradiationCondition ic = icService.findById(irradiationConditionId).orElseThrow(() ->
                new ResourceNotFoundException("Condizione di irradiazione non trovata con ID: " + irradiationConditionId));
        Source src = sourceService.findById(ic.getSourceId());
        var dept = departmentService.findById(src.getDepartmentId());
        var loc = locationService.findById(dept.getLocationId());
        if (!customerService.hasAccess(loc.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per cancellare questa misurazione.");
        }

        // 3) Elimino la misurazione
        measurementService.deleteById(measurementId);

        return ResponseEntity.noContent().build();
    }
}
