package com.thegirlcoded.aitracker.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String googleSub; // Google's unique user ID
    
    private Integer age;
    private Double height; // cm
    private Double currentWeight; // kg
    private Double goalWeight; // kg
    
    private String sex; // MALE, FEMALE
    private String activityLevel; // SEDENTARY, LIGHT, MODERATE, ACTIVE, VERY_ACTIVE
    
    private Integer targetCalories; // daily calorie goal
    private Double bmr;
    private Double tdee;
}