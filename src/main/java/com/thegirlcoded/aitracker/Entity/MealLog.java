package com.thegirlcoded.aitracker.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class MealLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private String foodName;
    private String mealType; // BREAKFAST, LUNCH, DINNER, SNACK

    @Column(columnDefinition = "TEXT")
    private String description;   // plain text the user typed

    private Integer calories;
    private Integer protein;  // grams
    private Integer carbs;    // grams
    private Integer fats;     // grams
    private Integer fiber;    // grams

    @Column(columnDefinition = "TEXT")
    private String aiNotes;   // full AI response including assumptions

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}