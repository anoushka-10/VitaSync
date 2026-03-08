package com.thegirlcoded.aitracker.controller;

import com.thegirlcoded.aitracker.Entity.CycleLog;
import com.thegirlcoded.aitracker.service.CycleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/cycle")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CycleController {

    private final CycleService cycleService;

    // Log or update last period date + cycle length
    @PostMapping
    public ResponseEntity<CycleLog> logCycle(@RequestBody CycleLog log) {
        return ResponseEntity.ok(cycleService.logCycle(log));
    }

    // Returns last period date and cycle length — AI interprets phase
    @GetMapping("/{userId}/status")
    public ResponseEntity<?> getCycleStatus(@PathVariable Long userId) {
        return cycleService.getLatestCycle(userId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(Map.of("message", "No cycle data logged yet")));
    }
}
