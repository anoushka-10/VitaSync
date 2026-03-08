package com.thegirlcoded.aitracker.repository;

import com.thegirlcoded.aitracker.Entity.StepLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StepRepository extends JpaRepository<StepLog, Long> {
    List<StepLog> findByUserIdOrderByDateDesc(Long userId);
}
