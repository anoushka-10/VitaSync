package com.thegirlcoded.aitracker.repository;

import com.thegirlcoded.aitracker.Entity.MealLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<MealLog, Long> {
    List<MealLog> findByUserIdAndDate(Long userId, LocalDate date);
    List<MealLog> findByUserIdOrderByDateDesc(Long userId);
}
