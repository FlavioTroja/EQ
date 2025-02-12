package it.overzoom.eq.calendar.domain;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Meeting {

    @Id
    @UuidGenerator
    private String id;

    @NotNull
    @NotBlank
    private String title;

    @NotNull
    private LocalDateTime startDate;

    @NotNull
    private LocalDateTime endDate;

    private Boolean validate;

    private String link;

    private String note;

    private String location;

    private LocalDateTime notificationDate;

    private Set<String> users = new HashSet<>();
}
