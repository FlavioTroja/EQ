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
import it.overzoom.registry.model.Location;
import it.overzoom.registry.service.LocationServiceImpl;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/registry/customers/{customerId}/locations")
public class LocationController {

    private static final Logger log = LoggerFactory.getLogger(LocationController.class);

    @Autowired
    private LocationServiceImpl locationService;

    @GetMapping("")
    public ResponseEntity<Page<Location>> findCustomerId(@PathVariable(value = "customerId") String customerId,
            Pageable pageable) throws ResourceNotFoundException, BadRequestException {
        log.info("REST request to get a page of Locations by customerId: " + customerId);
        Page<Location> page = locationService.findByCustomerId(customerId, pageable);
        return ResponseEntity.ok().body(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Location> findById(@PathVariable(value = "id") String locationId)
            throws ResourceNotFoundException, BadRequestException {
        Location location = locationService.findById(locationId);
        return ResponseEntity.ok(location);
    }

    @PostMapping("")
    public ResponseEntity<Location> create(@PathVariable(value = "customerId") String customerId,
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
    public ResponseEntity<Location> partialUpdate(@PathVariable(value = "id") String id,
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
}
