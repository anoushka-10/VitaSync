package com.thegirlcoded.aitracker.controller;

import com.thegirlcoded.aitracker.Entity.WorkoutLog;
import com.thegirlcoded.aitracker.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workouts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WorkoutController {

    private final WorkoutService workoutService;

    @PostMapping
    public ResponseEntity<WorkoutLog> logWorkout(@RequestBody WorkoutLog log) {
        return ResponseEntity.ok(workoutService.logWorkout(log));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<WorkoutLog>> getWorkoutHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(workoutService.getWorkoutHistory(userId));
    }
}
