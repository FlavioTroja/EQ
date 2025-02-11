package it.overzoom.eq.calendar.domain;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Meeting {

    @Id
    @UuidGenerator
    private String id;

    private String title;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private Boolean validate;

    private String link;

    private String note;

    private String location;

    private LocalDateTime notificationDate;

    @ManyToMany
    @JoinTable(name = "meeting_user", joinColumns = @JoinColumn(name = "meeting_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> users = new HashSet<>();
}
