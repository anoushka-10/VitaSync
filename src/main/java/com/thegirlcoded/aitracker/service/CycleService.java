package com.thegirlcoded.aitracker.service;

import com.thegirlcoded.aitracker.Entity.CycleLog;
import com.thegirlcoded.aitracker.repository.CycleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CycleService {

    private final CycleRepository cycleRepository;

    // Save or update the user's latest cycle log
    public CycleLog logCycle(CycleLog log) {
        return cycleRepository.save(log);
    }

    // Return the most recent cycle entry — AI will interpret phase/predictions
    public Optional<CycleLog> getLatestCycle(Long userId) {
        return cycleRepository.findTopByUserIdOrderByLastPeriodDateDesc(userId);
    }
}
