package com.thegirlcoded.aitracker.repository;

import com.thegirlcoded.aitracker.Entity.WorkoutLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutRepository extends JpaRepository<WorkoutLog, Long> {
    List<WorkoutLog> findByUserIdOrderByDateDesc(Long userId);
}
