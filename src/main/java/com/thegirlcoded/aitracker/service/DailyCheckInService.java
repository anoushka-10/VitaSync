package com.thegirlcoded.aitracker.service;

import com.thegirlcoded.aitracker.Entity.DailyCheckIn;
import com.thegirlcoded.aitracker.repository.DailyCheckInRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DailyCheckInService {

    private final DailyCheckInRepository checkInRepository;

    public DailyCheckIn logCheckIn(DailyCheckIn checkIn) {
        return checkInRepository.save(checkIn);
    }

    public Optional<DailyCheckIn> getCheckIn(Long userId, LocalDate date) {
        return checkInRepository.findByUserIdAndDate(userId, date);
    }
}
