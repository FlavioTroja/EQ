package it.overzoom.eq.calendar.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import it.overzoom.eq.calendar.domain.Meeting;

public interface MeetingService {

    Optional<Meeting> findById(String customerId);

    boolean existsById(String customerId);

    Meeting create(Meeting customer);

    Optional<Meeting> update(Meeting customer);

    Optional<Meeting> partialUpdate(String customerId, Meeting customer);

    List<Meeting> findMeetingsToday();

    List<Meeting> findMeetingsByInterval(LocalDateTime startDate, LocalDateTime endDate);
}
