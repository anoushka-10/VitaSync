package com.thegirlcoded.aitracker.repository;

import com.thegirlcoded.aitracker.Entity.DailyCheckIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface DailyCheckInRepository extends JpaRepository<DailyCheckIn, Long> {
    Optional<DailyCheckIn> findByUserIdAndDate(Long userId, LocalDate date);
}
