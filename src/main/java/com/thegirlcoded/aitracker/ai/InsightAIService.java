package com.thegirlcoded.aitracker.ai;

import com.thegirlcoded.aitracker.Entity.CycleLog;
import com.thegirlcoded.aitracker.Entity.DailyCheckIn;
import com.thegirlcoded.aitracker.service.CycleService;
import com.thegirlcoded.aitracker.service.DailyCheckInService;
import com.thegirlcoded.aitracker.service.MealService;
import com.thegirlcoded.aitracker.service.StepService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

/**
 * Generates personalized daily health insights by combining the user's logged data
 * (macros, steps, workout, mood, cycle) into a rich prompt for Gemini.
 */
@Service
@RequiredArgsConstructor
public class InsightAIService {

    private final ChatClient chatClient;
    private final MealService mealService;
    private final StepService stepService;
    private final CycleService cycleService;
    private final DailyCheckInService checkInService;

    public String getDailyInsight(Long userId, LocalDate date) {
        // Gather today's data
        Map<String, Integer> macros = mealService.getDailyMacroSummary(userId, date);

        // Steps — use today's latest entry if available
        var steps = stepService.getStepHistory(userId).stream()
                .filter(s -> s.getDate().equals(date))
                .findFirst();

        // Cycle info
        Optional<CycleLog> cycle = cycleService.getLatestCycle(userId);

        // Daily check-in
        Optional<DailyCheckIn> checkIn = checkInService.getCheckIn(userId, date);

        // Build the context for the AI
        String prompt = """
                You are a warm, knowledgeable personal health coach. Based on the user's data for today (%s), provide personalized insights and actionable advice.
                
                Today's Data:
                - Calories consumed: %d kcal
                - Protein: %d g
                - Carbs: %d g
                - Fats: %d g
                - Fiber: %d g
                - Steps: %s
                - Energy level: %s / 10
                - Mood: %s
                - Sleep: %s hours
                - Stress: %s
                - Last period date: %s
                - Cycle length: %s days
                
                Please provide:
                1. One observation about their nutrition today
                2. One observation about their activity (steps)
                3. A cycle-aware tip (if cycle data is available)
                4. An overall encouragement message
                
                Keep the tone warm, supportive, and motivating. Be specific to their data.
                """.formatted(
                date,
                macros.getOrDefault("totalCalories", 0),
                macros.getOrDefault("totalProtein", 0),
                macros.getOrDefault("totalCarbs", 0),
                macros.getOrDefault("totalFats", 0),
                macros.getOrDefault("totalFiber", 0),
                steps.map(s -> String.valueOf(s.getSteps())).orElse("not logged"),
                checkIn.map(c -> String.valueOf(c.getEnergyLevel())).orElse("not logged"),
                checkIn.map(DailyCheckIn::getMood).orElse("not logged"),
                checkIn.map(c -> String.valueOf(c.getSleepHours())).orElse("not logged"),
                checkIn.map(DailyCheckIn::getStressLevel).orElse("not logged"),
                cycle.map(c -> c.getLastPeriodDate().toString()).orElse("not logged"),
                cycle.map(c -> String.valueOf(c.getCycleLength())).orElse("not available")
        );

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }

    public String getWeeklyReport(Long userId) {
        var weightHistory = stepService.getStepHistory(userId).stream().limit(7).toList();
        int avgSteps = weightHistory.stream().mapToInt(s -> s.getSteps()).sum() /
                       Math.max(weightHistory.size(), 1);

        String prompt = """
                You are a health analytics expert. Generate a concise weekly health summary for a user.
                
                This week's averages:
                - Average daily steps: %d
                
                Please provide:
                1. A brief weekly performance summary
                2. One key achievement to celebrate
                3. One area to focus on next week
                4. An estimated health trend observation
                
                Keep it motivating and action-focused.
                """.formatted(avgSteps);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }
}
