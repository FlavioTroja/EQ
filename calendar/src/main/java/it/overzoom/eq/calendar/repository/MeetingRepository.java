package it.overzoom.eq.calendar.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.overzoom.eq.calendar.domain.Meeting;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, String> {

    List<Meeting> findByStartDateGreaterThanEqualAndEndDateLessThanEqual(LocalDateTime startDate,
            LocalDateTime endDate);
}
