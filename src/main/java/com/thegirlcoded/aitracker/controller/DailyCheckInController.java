package com.thegirlcoded.aitracker.controller;

import com.thegirlcoded.aitracker.Entity.DailyCheckIn;
import com.thegirlcoded.aitracker.service.DailyCheckInService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/checkin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DailyCheckInController {

    private final DailyCheckInService checkInService;

    @PostMapping
    public ResponseEntity<DailyCheckIn> logCheckIn(@RequestBody DailyCheckIn checkIn) {
        return ResponseEntity.ok(checkInService.logCheckIn(checkIn));
    }

    @GetMapping("/{userId}/{date}")
    public ResponseEntity<?> getCheckIn(
            @PathVariable Long userId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return checkInService.getCheckIn(userId, date)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(Map.of("message", "No check-in logged for this date")));
    }
}
