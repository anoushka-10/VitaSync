package com.thegirlcoded.aitracker.controller;

import com.thegirlcoded.aitracker.Entity.StepLog;
import com.thegirlcoded.aitracker.service.StepService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/steps")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StepController {

    private final StepService stepService;

    @PostMapping
    public ResponseEntity<StepLog> logSteps(@RequestBody StepLog log) {
        return ResponseEntity.ok(stepService.logSteps(log));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<StepLog>> getStepHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(stepService.getStepHistory(userId));
    }
}
