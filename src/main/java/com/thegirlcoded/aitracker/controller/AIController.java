package com.thegirlcoded.aitracker.controller;

import com.thegirlcoded.aitracker.ai.InsightAIService;
import com.thegirlcoded.aitracker.ai.NutritionAIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AIController {

    private final NutritionAIService nutritionAIService;
    private final InsightAIService insightAIService;

    /**
     * POST /ai/nutrition
     * Body: { "meal": "2 eggs, dal, 2 roti, curd" }
     * Returns Gemini's macro estimate + health tip
     */
    @PostMapping("/nutrition")
    public ResponseEntity<Map<String, String>> estimateNutrition(@RequestBody Map<String, String> body) {
        String meal = body.get("meal");
        if (meal == null || meal.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please provide a 'meal' field"));
        }
        String result = nutritionAIService.estimateMacros(meal);
        return ResponseEntity.ok(Map.of("insight", result));
    }

    /**
     * POST /ai/insight
     * Body: { "userId": 1, "date": "2026-03-07" }
     * Returns personalized daily health insight from Gemini
     */
    @PostMapping("/insight")
    public ResponseEntity<Map<String, String>> getDailyInsight(@RequestBody Map<String, String> body) {
        Long userId = Long.parseLong(body.get("userId"));
        LocalDate date = LocalDate.parse(body.get("date"));
        String result = insightAIService.getDailyInsight(userId, date);
        return ResponseEntity.ok(Map.of("insight", result));
    }

    /**
     * GET /ai/weekly-report/{userId}
     * Returns a weekly health summary from Gemini
     */
    @GetMapping("/weekly-report/{userId}")
    public ResponseEntity<Map<String, String>> getWeeklyReport(@PathVariable Long userId) {
        String result = insightAIService.getWeeklyReport(userId);
        return ResponseEntity.ok(Map.of("report", result));
    }
}
