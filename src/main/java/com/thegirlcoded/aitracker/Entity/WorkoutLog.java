package com.thegirlcoded.aitracker.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class WorkoutLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private String exercise;

    private Integer sets;
    private Integer reps;
    private Double weight;          // kg lifted
    private Integer durationMinutes;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}