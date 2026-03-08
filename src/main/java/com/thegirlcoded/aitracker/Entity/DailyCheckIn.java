package com.thegirlcoded.aitracker.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class DailyCheckIn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private Integer energyLevel; // 1–10
    private String mood;         // e.g. "Good", "Tired", "Anxious"
    private Double sleepHours;
    private String stressLevel;  // Low / Medium / High

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
