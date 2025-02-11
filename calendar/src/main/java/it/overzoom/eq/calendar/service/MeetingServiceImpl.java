package it.overzoom.eq.calendar.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.overzoom.eq.calendar.domain.Meeting;
import it.overzoom.eq.calendar.repository.MeetingRepository;

@Service
public class MeetingServiceImpl implements MeetingService {

    @Autowired
    private MeetingRepository meetingRepository;

    @Override
    public Optional<Meeting> findById(String meetingId) {
        return meetingRepository.findById(meetingId);
    }

    @Override
    public boolean existsById(String meetingId) {
        return meetingRepository.existsById(meetingId);
    }

    @Override
    public Meeting create(Meeting meeting) {
        return meetingRepository.save(meeting);
    }

    @Override
    public Optional<Meeting> update(Meeting meeting) {
        return this.findById(meeting.getId()).map(existingMeeting -> {
            existingMeeting.setTitle(meeting.getTitle());
            existingMeeting.setStartDate(meeting.getStartDate());
            existingMeeting.setEndDate(meeting.getEndDate());
            existingMeeting.setLink(meeting.getLink());
            existingMeeting.setLocation(meeting.getLocation());
            existingMeeting.setNote(meeting.getNote());
            existingMeeting.setNotificationDate(meeting.getNotificationDate());
            existingMeeting.setValidate(meeting.getValidate());
            existingMeeting.setUsers(meeting.getUsers());
            return existingMeeting;
        }).map(this::create);
    }

    @Override
    public Optional<Meeting> partialUpdate(String meetingId, Meeting meeting) {
        return this.findById(meetingId)
                .map(existingMeeting -> {
                    if (meeting.getTitle() != null) {
                        existingMeeting.setTitle(meeting.getTitle());
                    }
                    if (meeting.getStartDate() != null) {
                        existingMeeting.setStartDate(meeting.getStartDate());
                    }
                    if (meeting.getEndDate() != null) {
                        existingMeeting.setEndDate(meeting.getEndDate());
                    }
                    if (meeting.getUsers() != null) {
                        existingMeeting.setUsers(meeting.getUsers());
                    }
                    if (meeting.getValidate() != null) {
                        existingMeeting.setValidate(meeting.getValidate());
                    }
                    if (meeting.getLink() != null) {
                        existingMeeting.setLink(meeting.getLink());
                    }
                    if (meeting.getNote() != null) {
                        existingMeeting.setNote(meeting.getNote());
                    }
                    if (meeting.getLocation() != null) {
                        existingMeeting.setLocation(meeting.getLocation());
                    }
                    if (meeting.getNotificationDate() != null) {
                        existingMeeting.setNotificationDate(meeting.getNotificationDate());
                    }
                    return existingMeeting;
                })
                .map(this::create);
    }

    @Override
    public List<Meeting> findMeetingsToday() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);
        return meetingRepository.findByStartDateGreaterThanEqualAndEndDateLessThanEqual(startOfDay, endOfDay);
    }

    @Override
    public List<Meeting> findMeetingsByInterval(LocalDateTime startDate, LocalDateTime endDate) {
        return meetingRepository.findByStartDateGreaterThanEqualAndEndDateLessThanEqual(startDate, endDate);
    }
}
