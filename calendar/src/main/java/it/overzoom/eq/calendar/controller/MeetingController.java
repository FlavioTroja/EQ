package it.overzoom.eq.calendar.controller;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import it.overzoom.eq.calendar.domain.Meeting;
import it.overzoom.eq.calendar.exception.BadRequestException;
import it.overzoom.eq.calendar.exception.ResourceNotFoundException;
import it.overzoom.eq.calendar.service.MeetingServiceImpl;
import jakarta.validation.Valid;
import lombok.SneakyThrows;
import lombok.extern.java.Log;

@Log
@RestController
@RequestMapping("/api/calendar/meetings")
public class MeetingController {

    @Autowired
    private MeetingServiceImpl meetingService;

    @GetMapping("/{id}")
    @SneakyThrows
    public ResponseEntity<Meeting> findById(@PathVariable(value = "id") String meetingId) {
        log.info("REST request to get meeting by ID : " + meetingId);
        Meeting meeting = meetingService.findById(meetingId)
                .orElseThrow(() -> new ResourceNotFoundException("Meeting non trovato per questo id :: " + meetingId));
        return ResponseEntity.ok().body(meeting);
    }

    @PostMapping("")
    @SneakyThrows
    public ResponseEntity<Meeting> create(@Valid @RequestBody Meeting meeting) {
        log.info("REST request to save Meeting : " + meeting.toString());
        if (meeting.getId() != null) {
            throw new BadRequestException("Un nuovo meeting non può già avere un ID");
        }
        meeting = meetingService.create(meeting);
        return ResponseEntity.created(new URI("/api/calendar/meetings/" + meeting.getId())).body(meeting);
    }

    @PutMapping("")
    @SneakyThrows
    public ResponseEntity<Meeting> update(@Valid @RequestBody Meeting meeting) {
        log.info("REST request to update Meeting : " + meeting.toString());
        if (meeting.getId() == null) {
            throw new BadRequestException("ID invalido.");
        }
        if (!meetingService.existsById(meeting.getId())) {
            throw new ResourceNotFoundException("Meeting non trovato.");
        }
        Meeting updatedMeeting = meetingService.update(meeting)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Meeting non trovato con questo ID :: " + meeting.getId()));
        return ResponseEntity.ok().body(updatedMeeting);
    }

    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    @SneakyThrows
    public ResponseEntity<Meeting> partialUpdate(@PathVariable(value = "id") String meetingId,
            @RequestBody Meeting meeting) {
        log.info("REST request to partial update Meeting : " + meeting.toString());
        if (meetingId == null) {
            throw new BadRequestException("ID invalido.");
        }
        if (!meetingService.existsById(meetingId)) {
            throw new ResourceNotFoundException("Meeting non trovato.");
        }
        Meeting updatedMeeting = meetingService.partialUpdate(meetingId, meeting)
                .orElseThrow(() -> new ResourceNotFoundException("Meeting non trovato con questo ID :: " + meetingId));
        return ResponseEntity.ok().body(updatedMeeting);
    }

    /**
     * Endpoint per recuperare tutti i meeting del giorno corrente.
     */
    @GetMapping("/today")
    public ResponseEntity<List<Meeting>> findMeetingsToday() {
        log.info("REST request to get today's Meetings");
        List<Meeting> meetings = meetingService.findMeetingsToday();
        return ResponseEntity.ok().body(meetings);
    }

    /**
     * Endpoint per recuperare i meeting in un determinato intervallo di
     * date/orario.
     * 
     * I parametri devono essere passati nel formato ISO-8601 (ad es.
     * "2025-02-11T08:30:00").
     */
    @GetMapping("/interval")
    public ResponseEntity<List<Meeting>> findMeetingsByInterval(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.info("REST request to get Meetings by interval from " + startDate + "to " + endDate);
        List<Meeting> meetings = meetingService.findMeetingsByInterval(startDate, endDate);
        return ResponseEntity.ok().body(meetings);
    }
}
