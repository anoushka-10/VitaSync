package com.thegirlcoded.aitracker.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class CycleLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User tells us when their last period started and how long their cycle usually is.
    // All phase/ovulation/PMS calculations are done by the AI — not hardcoded.
    private LocalDate lastPeriodDate;
    private Integer cycleLength; // typical cycle length in days, default 28

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
