package com.thegirlcoded.aitracker.service;

import com.thegirlcoded.aitracker.Entity.WorkoutLog;
import com.thegirlcoded.aitracker.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkoutService {

    private final WorkoutRepository workoutRepository;

    public WorkoutLog logWorkout(WorkoutLog log) {
        return workoutRepository.save(log);
    }

    public List<WorkoutLog> getWorkoutHistory(Long userId) {
        return workoutRepository.findByUserIdOrderByDateDesc(userId);
    }
}
