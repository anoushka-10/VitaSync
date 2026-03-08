package com.thegirlcoded.aitracker.controller;

import com.thegirlcoded.aitracker.Entity.MealLog;
import com.thegirlcoded.aitracker.Entity.User;
import com.thegirlcoded.aitracker.service.UserService;
import com.thegirlcoded.aitracker.service.MealService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AnalyticsController {

    private final UserService userService;
    private final MealService mealService;

    @GetMapping("/daily-balance")
    public ResponseEntity<Map<String, Object>> getDailyBalance(
            @AuthenticationPrincipal OAuth2User principal,
            @RequestParam(required = false) String date) {
        
        if (principal == null) return ResponseEntity.status(401).build();
        
        String googleSub = principal.getAttribute("sub");
        User user = userService.findByGoogleSub(googleSub);
        
        LocalDate targetDate = (date != null) ? LocalDate.parse(date) : LocalDate.now();
        
        // Get total calories for the day
        double consumed = mealService.getAllMeals(user.getId()).stream()
                .filter(m -> m.getDate().equals(targetDate))
                .mapToDouble(m -> m.getCalories() != null ? m.getCalories() : 0.0)
                .sum();
                
        double tdee = (user.getTdee() != null) ? user.getTdee() : 2000.0;
        double balance = consumed - tdee; // Positive = surplus, Negative = deficit
        
        Map<String, Object> result = new HashMap<>();
        result.put("consumed", consumed);
        result.put("target", tdee);
        result.put("balance", balance);
        result.put("status", balance > 0 ? "SURPLUS" : "DEFICIT");
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/macro-trends")
    public ResponseEntity<List<Map<String, Object>>> getMacroTrends(
            @AuthenticationPrincipal OAuth2User principal,
            @RequestParam(defaultValue = "7") int days) {
        
        if (principal == null) return ResponseEntity.status(401).build();
        
        String googleSub = principal.getAttribute("sub");
        User user = userService.findByGoogleSub(googleSub);
        
        List<Map<String, Object>> trends = new ArrayList<>();
        LocalDate today = LocalDate.now();
        
        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            List<MealLog> meals = mealService.getMealsByDate(user.getId(), date);
            
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", date.toString());
            dayData.put("calories", meals.stream().mapToInt(m -> m.getCalories() != null ? m.getCalories() : 0).sum());
            dayData.put("protein",  meals.stream().mapToInt(m -> m.getProtein()  != null ? m.getProtein()  : 0).sum());
            dayData.put("carbs",    meals.stream().mapToInt(m -> m.getCarbs()    != null ? m.getCarbs()    : 0).sum());
            dayData.put("fats",     meals.stream().mapToInt(m -> m.getFats()     != null ? m.getFats()     : 0).sum());
            trends.add(dayData);
        }
        
        return ResponseEntity.ok(trends);
    }

    @GetMapping("/deficit-history")
    public ResponseEntity<List<Map<String, Object>>> getDeficitHistory(
            @AuthenticationPrincipal OAuth2User principal,
            @RequestParam(defaultValue = "7") int days) {
        
        if (principal == null) return ResponseEntity.status(401).build();
        
        String googleSub = principal.getAttribute("sub");
        User user = userService.findByGoogleSub(googleSub);
        double tdee = (user.getTdee() != null) ? user.getTdee() : 2000.0;
        
        List<Map<String, Object>> history = new ArrayList<>();
        LocalDate today = LocalDate.now();
        
        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            int consumed = mealService.getMealsByDate(user.getId(), date).stream()
                    .mapToInt(m -> m.getCalories() != null ? m.getCalories() : 0)
                    .sum();
            
            Map<String, Object> entry = new HashMap<>();
            entry.put("date", date.toString());
            entry.put("consumed", consumed);
            entry.put("target", tdee);
            entry.put("balance", consumed - tdee);
            history.add(entry);
        }
        
        return ResponseEntity.ok(history);
    }

    @GetMapping("/weekly-summary")
    public ResponseEntity<Map<String, Object>> getWeeklySummary(
            @AuthenticationPrincipal OAuth2User principal) {
        
        if (principal == null) return ResponseEntity.status(401).build();
        
        String googleSub = principal.getAttribute("sub");
        User user = userService.findByGoogleSub(googleSub);
        double tdee = (user.getTdee() != null) ? user.getTdee() : 2000.0;
        
        LocalDate today = LocalDate.now();
        double totalConsumed = 0;
        for (int i = 0; i < 7; i++) {
            totalConsumed += mealService.getMealsByDate(user.getId(), today.minusDays(i)).stream()
                    .mapToInt(m -> m.getCalories() != null ? m.getCalories() : 0)
                    .sum();
        }
        
        double totalTarget = tdee * 7;
        double weeklyBalance = totalConsumed - totalTarget;
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalConsumed", totalConsumed);
        summary.put("totalTarget", totalTarget);
        summary.put("weeklyBalance", weeklyBalance);
        summary.put("averageDailyDeficit", Math.abs(weeklyBalance / 7.0));
        summary.put("status", weeklyBalance > 0 ? "SURPLUS" : "DEFICIT");
        
        return ResponseEntity.ok(summary);
    }
}
