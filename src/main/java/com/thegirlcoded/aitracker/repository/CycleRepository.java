package com.thegirlcoded.aitracker.repository;

import com.thegirlcoded.aitracker.Entity.CycleLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CycleRepository extends JpaRepository<CycleLog, Long> {
    // Get the most recent cycle log for a user
    Optional<CycleLog> findTopByUserIdOrderByLastPeriodDateDesc(Long userId);
}
