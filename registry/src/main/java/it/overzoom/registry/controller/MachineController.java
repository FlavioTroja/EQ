package it.overzoom.registry.controller;

import java.net.URI;
import java.net.URISyntaxException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import it.overzoom.registry.dto.MachineDTO;
import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Machine;
import it.overzoom.registry.service.MachineService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/registry/machines")
public class MachineController {

    private static final Logger log = LoggerFactory.getLogger(MachineController.class);
    private final MachineService machineService;

    public MachineController(MachineService machineService) {
        this.machineService = machineService;
    }

    /**
     * LISTA PAGINATA di tutte le macchine (oppure ricerca per nome se è passato
     * 'q').
     *
     * - Se è presente il parametro 'q', viene chiamato searchByName(q, pageable).
     * - Altrimenti, ritorna tutte le macchine con findAll(pageable).
     *
     * Esempi:
     * GET /api/registry/machines?page=0&size=10
     * GET /api/registry/machines?q=abc&page=0&size=10
     */
    @GetMapping("")
    public ResponseEntity<Page<Machine>> findAll(
            @RequestParam(value = "q", required = false) String query,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {

        log.info("REST request to get a page of Machines; autocomplete query = {}", query);

        Page<Machine> page;
        if (query != null && !query.trim().isEmpty()) {
            page = machineService.searchByName(query.trim(), pageable);
        } else {
            page = machineService.findAll(pageable);
        }

        return ResponseEntity.ok(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MachineDTO> findById(@PathVariable("id") String machineId)
            throws ResourceNotFoundException {
        return machineService.findById(machineId)
                .map(ResponseEntity::ok).orElseThrow(() -> new ResourceNotFoundException("Macchina non trovata."));
    }

    @PostMapping("")
    public ResponseEntity<Machine> create(@Valid @RequestBody Machine machine)
            throws BadRequestException, URISyntaxException {
        log.info("REST request to save Machine : " + machine.toString());
        if (machine.getId() != null) {
            throw new BadRequestException("Un nuovo cliente non può già avere un ID");
        }
        machine = machineService.create(machine);
        return ResponseEntity.created(new URI("/api/machines/" + machine.getId())).body(machine);
    }

    @PutMapping("")
    public ResponseEntity<Machine> update(@Valid @RequestBody Machine machine) throws BadRequestException,
            ResourceNotFoundException {
        log.info("REST request to update Machine:" + machine.toString());
        if (machine.getId() == null) {
            throw new BadRequestException("ID invalido.");
        }
        if (!machineService.existsById(machine.getId())) {
            throw new ResourceNotFoundException("Cliente non trovato.");
        }
        Machine updateMachine = machineService.update(machine).orElseThrow(
                () -> new ResourceNotFoundException("Cliente non trovato con questo ID :: " + machine.getId()));

        return ResponseEntity.ok().body(updateMachine);
    }

    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Machine> partialUpdate(@PathVariable("id") String id,
            @RequestBody Machine machine) throws BadRequestException,
            ResourceNotFoundException {
        log.info("REST request to partial update Machine: " + machine.toString());
        if (id == null) {
            throw new BadRequestException("ID invalido.");
        }
        if (!machineService.existsById(id)) {
            throw new ResourceNotFoundException("Cliente non trovato.");
        }
        Machine updateMachine = machineService.partialUpdate(id, machine)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente non trovato con questo ID :: " + id));

        return ResponseEntity.ok().body(updateMachine);
    }

    /**
     * DELETE /{id} : elimina la Machine con l'id specificato.
     *
     * @param id l'identificativo della Machine da eliminare
     * @return ResponseEntity<Void> con status 204 (No Content) se eliminato,
     *         oppure 404 (Not Found) se non esiste
     * @throws ResourceNotFoundException se la Machine non viene trovata
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMachine(@PathVariable("id") String id) throws ResourceNotFoundException {
        log.info("REST request to delete Machine : {}", id);

        if (machineService.existsById(id) == false) {
            throw new ResourceNotFoundException("Macchina non trovata con id :: " + id);
        }

        machineService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
