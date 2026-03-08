package com.thegirlcoded.aitracker.controller;

import com.thegirlcoded.aitracker.Entity.WeightLog;
import com.thegirlcoded.aitracker.service.WeightService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/weights")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WeightController {

    private final WeightService weightService;

    @PostMapping
    public ResponseEntity<WeightLog> logWeight(@RequestBody WeightLog log) {
        return ResponseEntity.ok(weightService.logWeight(log));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<WeightLog>> getWeightHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(weightService.getWeightHistory(userId));
    }

    @GetMapping("/{userId}/average")
    public ResponseEntity<Map<String, Double>> getWeeklyAverage(@PathVariable Long userId) {
        Double avg = weightService.getWeeklyAverage(userId);
        return ResponseEntity.ok(Map.of("weeklyAverage", avg != null ? avg : 0.0));
    }
}
