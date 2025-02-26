package it.overzoom.registry.controller;

import java.net.URI;
import java.net.URISyntaxException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
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
import it.overzoom.registry.model.Machine;
import it.overzoom.registry.service.MachineServiceImpl;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/registry/machines")
public class MachineController {

    private static final Logger log = LoggerFactory.getLogger(MachineController.class);

    @Autowired
    private MachineServiceImpl machineService;

    @GetMapping("")
    public ResponseEntity<Page<Machine>> findAll(Pageable pageable) {
        log.info("REST request to get a page of Machines");
        Page<Machine> page = machineService.findAll(pageable);
        return ResponseEntity.ok().body(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Machine> findById(@PathVariable(value = "id") String locationId)
            throws ResourceNotFoundException {
        return machineService.findById(locationId)
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
    public ResponseEntity<Machine> partialUpdate(@PathVariable(value = "id") String id,
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
}
