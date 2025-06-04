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
import it.overzoom.registry.model.IrradiationCondition;
import it.overzoom.registry.model.Source;
import it.overzoom.registry.service.CustomerService;
import it.overzoom.registry.service.IrradiationConditionService;
import it.overzoom.registry.service.LocationService;
import it.overzoom.registry.service.SourceService;
import it.overzoom.registry.service.DepartmentService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/registry/sources/{sourceId}/irradiation-conditions")
public class IrradiationConditionController {

    private static final Logger log = LoggerFactory.getLogger(IrradiationConditionController.class);
    private final IrradiationConditionService icService;
    private final SourceService sourceService;
    private final DepartmentService departmentService;
    private final LocationService locationService;
    private final CustomerService customerService;

    public IrradiationConditionController(
            IrradiationConditionService icService,
            SourceService sourceService,
            DepartmentService departmentService,
            LocationService locationService,
            CustomerService customerService) {
        this.icService = icService;
        this.sourceService = sourceService;
        this.departmentService = departmentService;
        this.locationService = locationService;
        this.customerService = customerService;
    }

    /**
     * GET di tutte le IrradiationCondition per una certa Source (lista completa).
     *
     * Esempio: GET /api/registry/sources/src123/irradiation-conditions
     */
    @GetMapping
    public ResponseEntity<List<IrradiationCondition>> findBySourceId(
            @PathVariable("sourceId") String sourceId) throws ResourceNotFoundException, BadRequestException {

        log.info("REST request to get all IrradiationConditions for Source {}", sourceId);

        // 1) Verifico che la Source esista
        Source src = sourceService.findById(sourceId);

        // 2) Controllo permessi utente (risalgo dal Source a Department → Location → Customer)
        var dept = departmentService.findById(src.getDepartmentId());
        var loc  = locationService.findById(dept.getLocationId());
        if (!customerService.hasAccess(loc.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per accedere a queste condizioni di irradiazione.");
        }

        // 3) Invoco il service
        List<IrradiationCondition> list = icService.findBySourceId(sourceId);
        return ResponseEntity.ok(list);
    }

    /**
     * GET di una singola IrradiationCondition.
     *
     * Esempio: GET /api/registry/sources/src123/irradiation-conditions/cond456
     */
    @GetMapping("/{id}")
    public ResponseEntity<IrradiationCondition> getById(
            @PathVariable("sourceId") String sourceId,
            @PathVariable("id") String id)
            throws ResourceNotFoundException, BadRequestException {

        log.info("REST request to get IrradiationCondition {} for Source {}", id, sourceId);

        // 1) Verifico che la Source esista
        Source src = sourceService.findById(sourceId);

        // 2) Recupero la condizione (Optional)
        IrradiationCondition ic = icService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Condizione non trovata: " + id));

        // 3) Controllo che appartenga a questa Source
        if (!ic.getSourceId().equals(sourceId)) {
            throw new BadRequestException("La condizione non appartiene a questa Source.");
        }

        // 4) Controllo permessi utente
        var dept = departmentService.findById(src.getDepartmentId());
        var loc  = locationService.findById(dept.getLocationId());
        if (!customerService.hasAccess(loc.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per accedere a questa condizione di irradiazione.");
        }

        return ResponseEntity.ok(ic);
    }

    /**
     * POST di una nuova IrradiationCondition sotto una Source.
     *
     * Esempio: POST /api/registry/sources/src123/irradiation-conditions
     */
    @PostMapping
    public ResponseEntity<IrradiationCondition> create(
            @PathVariable("sourceId") String sourceId,
            @Valid @RequestBody IrradiationCondition ic)
            throws BadRequestException, URISyntaxException, ResourceNotFoundException {

        log.info("REST request to save IrradiationCondition : {}", ic);

        // 1) Se l’oggetto ha già un ID, rifiuto
        if (ic.getId() != null) {
            throw new BadRequestException("Una nuova condizione di irradiazione non può già avere un ID");
        }

        // 2) Verifico che la Source esista
        Source src = sourceService.findById(sourceId);

        // 3) Controllo permessi utente
        var dept = departmentService.findById(src.getDepartmentId());
        var loc  = locationService.findById(dept.getLocationId());
        if (!customerService.hasAccess(loc.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per creare una condizione su questa Source.");
        }

        // 4) Imposto la FK e invoco create(ic)
        ic.setSourceId(sourceId);
        IrradiationCondition saved = icService.create(ic);

        // 5) Rispondo con 201 Created
        return ResponseEntity
                .created(new URI("/api/registry/sources/" + sourceId + "/irradiation-conditions/" + saved.getId()))
                .body(saved);
    }

    /**
     * PATCH (partial update) di una IrradiationCondition.
     *
     * Esempio: PATCH /api/registry/sources/src123/irradiation-conditions/cond456
     */
    @PatchMapping("/{id}")
    public ResponseEntity<IrradiationCondition> partialUpdate(
            @PathVariable("sourceId") String sourceId,
            @PathVariable("id") String id,
            @RequestBody IrradiationCondition ic)
            throws BadRequestException, ResourceNotFoundException {

        log.info("REST request to partial update IrradiationCondition: {}", ic);

        // 1) Verifico che la Source esista
        Source src = sourceService.findById(sourceId);

        // 2) Recupero la condizione esistente
        IrradiationCondition existing = icService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Condizione non trovata: " + id));

        // 3) Controllo che appartenga a questa Source
        if (!existing.getSourceId().equals(sourceId)) {
            throw new BadRequestException("La condizione non appartiene a questa Source.");
        }

        // 4) Controllo permessi utente
        var dept = departmentService.findById(src.getDepartmentId());
        var loc  = locationService.findById(dept.getLocationId());
        if (!customerService.hasAccess(loc.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per modificare questa condizione di irradiazione.");
        }

        // 5) Eseguo il partial update: mi assicuro di gestire l’Optional restituito
        IrradiationCondition updated = icService.partialUpdate(id, ic)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Errore durante l’aggiornamento della condizione di irradiazione."));

        return ResponseEntity.ok(updated);
    }

    /**
     * PUT (full update) di una IrradiationCondition.
     *
     * Esempio: PUT /api/registry/sources/src123/irradiation-conditions
     */
    @PutMapping
    public ResponseEntity<IrradiationCondition> fullUpdate(
            @Valid @RequestBody IrradiationCondition ic)
            throws BadRequestException, ResourceNotFoundException {

        log.info("REST request to update IrradiationCondition: {}", ic);

        // 1) Verifico che abbia l’ID
        if (ic.getId() == null) {
            throw new BadRequestException("ID mancante per l'aggiornamento della condizione di irradiazione.");
        }

        // 2) Recupero la condizione esistente
        IrradiationCondition existing = icService.findById(ic.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Condizione non trovata: " + ic.getId()));

        // 3) Verifico corrispondenza tra existing.getSourceId() e ic.getSourceId()
        if (!existing.getSourceId().equals(ic.getSourceId())) {
            throw new BadRequestException("SourceId nel body non corrisponde a quello esistente.");
        }

        // 4) Controllo permessi utente (risalgo da Source a Department → Location → Customer)
        Source src = sourceService.findById(ic.getSourceId());
        var dept = departmentService.findById(src.getDepartmentId());
        var loc  = locationService.findById(dept.getLocationId());
        if (!customerService.hasAccess(loc.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per modificare questa condizione di irradiazione.");
        }

        // 5) Eseguo l’update completo:
        IrradiationCondition updated = icService.update(ic)
                .orElseThrow(() -> new ResourceNotFoundException("Errore durante l'aggiornamento della condizione."));

        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE di una IrradiationCondition (cancella anche tutte le misurazioni associate).
     *
     * Esempio: DELETE /api/registry/sources/src123/irradiation-conditions/cond456
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable("sourceId") String sourceId,
            @PathVariable("id") String id)
            throws ResourceNotFoundException, BadRequestException {

        log.info("REST request to delete IrradiationCondition {} for Source {}", id, sourceId);

        // 1) Verifico che la Source esista
        Source src = sourceService.findById(sourceId);

        // 2) Recupero la condizione
        IrradiationCondition ic = icService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Condizione non trovata: " + id));

        // 3) Controllo che appartenga a questa Source
        if (!ic.getSourceId().equals(sourceId)) {
            throw new BadRequestException("La condizione non appartiene a questa Source.");
        }

        // 4) Controllo permessi utente
        var dept = departmentService.findById(src.getDepartmentId());
        var loc  = locationService.findById(dept.getLocationId());
        if (!customerService.hasAccess(loc.getCustomerId())) {
            throw new BadRequestException("Non hai i permessi per cancellare questa condizione di irradiazione.");
        }

        // 5) Elimino la condizione (e a cascata le misurazioni)
        icService.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
