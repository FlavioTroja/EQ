package it.overzoom.registry.controller;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDateTime;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Measurement;
import it.overzoom.registry.service.MeasurementServiceImpl;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/registry/sources/{sourceId}/measurements")
public class MeasurementController {

    private static final Logger log = LoggerFactory.getLogger(MeasurementController.class);

    @Autowired
    private MeasurementServiceImpl measurementService;

    @GetMapping("")
    public ResponseEntity<Page<Measurement>> findBySourceId(@PathVariable("id") String sourceId,
            Pageable pageable) {
        log.info("REST request to get a page of Measurements");
        Page<Measurement> page = measurementService.findBySourceId(sourceId, pageable);
        return ResponseEntity.ok().body(page);
    }

    @PostMapping("")
    public ResponseEntity<Measurement> create(@PathVariable("id") String sourceId,
            @Valid @RequestBody Measurement measurement)
            throws BadRequestException, URISyntaxException {
        log.info("REST request to save Measurement : " + measurement.toString());
        if (measurement.getId() != null) {
            throw new BadRequestException("Un nuovo cliente non può già avere un ID");
        }
        measurement.setSourceId(sourceId);
        measurement.setDate(LocalDateTime.now());
        measurement = measurementService.create(measurement);
        return ResponseEntity.created(new URI("/api/measurements/" + measurement.getId())).body(measurement);
    }

    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Measurement> partialUpdate(@PathVariable("id") String id,
            @RequestBody Measurement measurement) throws BadRequestException,
            ResourceNotFoundException {
        log.info("REST request to partial update Measurement: " + measurement.toString());
        if (id == null) {
            throw new BadRequestException("ID invalido.");
        }
        if (!measurementService.existsById(id)) {
            throw new ResourceNotFoundException("Cliente non trovato.");
        }
        Measurement updateMeasurement = measurementService.partialUpdate(id,
                measurement)
                .orElseThrow(() -> new ResourceNotFoundException("Misurazione non trovata con questo ID :: " + id));

        return ResponseEntity.ok().body(updateMeasurement);
    }
}
