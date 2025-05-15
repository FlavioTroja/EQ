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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.overzoom.registry.dto.ReportDTO;
import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Report;
import it.overzoom.registry.service.ReportServiceImpl;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/registry/locations/{locationId}/reports")
public class ReportController {

    private static final Logger log = LoggerFactory.getLogger(ReportController.class);

    @Autowired
    private ReportServiceImpl reportService;

    @GetMapping("")
    public ResponseEntity<Page<Report>> findByLocationId(@PathVariable("id") String locationId,
            Pageable pageable) {
        log.info("REST request to get a page of Reports");
        Page<Report> page = reportService.findByLocationId(locationId, pageable);
        return ResponseEntity.ok().body(page);
    }

    @PostMapping("")
    public ResponseEntity<Report> create(@PathVariable("id") String locationId,
            @Valid @RequestBody Report report)
            throws BadRequestException, URISyntaxException {
        log.info("REST request to save Report : " + report.toString());
        if (report.getId() != null) {
            throw new BadRequestException("Un nuovo cliente non può già avere un ID");
        }
        report.setLocationId(locationId);
        report.setCreationDate(LocalDateTime.now());
        report = reportService.create(report);
        return ResponseEntity.created(new URI("/api/reports/" + report.getId())).body(report);
    }

    @GetMapping("/prepare")
    public ResponseEntity<ReportDTO> prepare(@PathVariable("id") String locationId)
            throws ResourceNotFoundException {
        log.info("REST request to prepare ReportDTO for location: {}", locationId);
        ReportDTO reportDTO = reportService.prepare(locationId);
        return ResponseEntity.ok(reportDTO);
    }
}
