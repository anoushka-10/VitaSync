package com.thegirlcoded.aitracker.repository;

import com.thegirlcoded.aitracker.Entity.WeightLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeightRepository extends JpaRepository<WeightLog, Long> {
    List<WeightLog> findByUserIdOrderByDateDesc(Long userId);
}
