package com.thegirlcoded.aitracker.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class WeightLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private Double weight; // kg

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}