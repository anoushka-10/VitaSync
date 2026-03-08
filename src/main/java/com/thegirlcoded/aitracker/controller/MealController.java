package com.thegirlcoded.aitracker.controller;

import com.thegirlcoded.aitracker.Entity.MealLog;
import com.thegirlcoded.aitracker.service.MealService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/meals")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MealController {

    private final MealService mealService;

    // Manual log (kept for backwards compat)
    @PostMapping
    public ResponseEntity<MealLog> logMeal(@RequestBody MealLog meal) {
        return ResponseEntity.ok(mealService.logMeal(meal));
    }

    /**
     * Smart log: user provides a description, AI estimates macros, everything saved to DB.
     * Body: { userId, date, mealType, description }
     */
    @PostMapping("/smart-log")
    public ResponseEntity<MealLog> smartLogMeal(@RequestBody Map<String, String> body) {
        Long userId      = Long.parseLong(body.get("userId"));
        LocalDate date   = LocalDate.parse(body.get("date"));
        String mealType  = body.getOrDefault("mealType", "LUNCH");
        String description = body.get("description");
        return ResponseEntity.ok(mealService.logMealFromDescription(userId, date, mealType, description));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<MealLog>> getAllMeals(@PathVariable Long userId) {
        return ResponseEntity.ok(mealService.getAllMeals(userId));
    }

    @GetMapping("/{userId}/{date}")
    public ResponseEntity<List<MealLog>> getMealsByDate(
            @PathVariable Long userId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(mealService.getMealsByDate(userId, date));
    }

    @GetMapping("/{userId}/summary/{date}")
    public ResponseEntity<Map<String, Integer>> getDailyMacroSummary(
            @PathVariable Long userId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(mealService.getDailyMacroSummary(userId, date));
    }
}
