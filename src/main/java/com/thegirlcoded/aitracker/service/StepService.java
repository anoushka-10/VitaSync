package com.thegirlcoded.aitracker.service;

import com.thegirlcoded.aitracker.Entity.StepLog;
import com.thegirlcoded.aitracker.repository.StepRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StepService {

    private final StepRepository stepRepository;

    public StepLog logSteps(StepLog log) {
        return stepRepository.save(log);
    }

    public List<StepLog> getStepHistory(Long userId) {
        return stepRepository.findByUserIdOrderByDateDesc(userId);
    }
}
