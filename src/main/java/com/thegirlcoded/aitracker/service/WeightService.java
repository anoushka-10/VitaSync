package com.thegirlcoded.aitracker.service;

import com.thegirlcoded.aitracker.Entity.WeightLog;
import com.thegirlcoded.aitracker.repository.WeightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.OptionalDouble;

@Service
@RequiredArgsConstructor
public class WeightService {

    private final WeightRepository weightRepository;

    public WeightLog logWeight(WeightLog log) {
        return weightRepository.save(log);
    }

    public List<WeightLog> getWeightHistory(Long userId) {
        return weightRepository.findByUserIdOrderByDateDesc(userId);
    }

    public Double getWeeklyAverage(Long userId) {
        List<WeightLog> history = weightRepository.findByUserIdOrderByDateDesc(userId);
        List<WeightLog> last7 = history.stream().limit(7).toList();
        OptionalDouble avg = last7.stream().mapToDouble(WeightLog::getWeight).average();
        return avg.isPresent() ? Math.round(avg.getAsDouble() * 10.0) / 10.0 : null;
    }
}
