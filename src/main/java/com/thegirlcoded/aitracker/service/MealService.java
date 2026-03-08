package com.thegirlcoded.aitracker.service;

import com.thegirlcoded.aitracker.Entity.MealLog;
import com.thegirlcoded.aitracker.Entity.User;
import com.thegirlcoded.aitracker.ai.FoodEstimator;
import com.thegirlcoded.aitracker.ai.NutritionAIService;
import com.thegirlcoded.aitracker.repository.MealRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class MealService {

    private final MealRepository mealRepository;
    private final NutritionAIService nutritionAIService;
    private final FoodEstimator foodEstimator;

    public MealLog logMeal(MealLog meal) {
        return mealRepository.save(meal);
    }

    /**
     * Takes a plain-text meal description, calls AI (or falls back to keyword estimator),
     * parses macros, and saves everything to DB.
     */
    public MealLog logMealFromDescription(Long userId, LocalDate date, String mealType, String description) {
        String aiResponse;

        // Try Gemini, fall back to keyword estimator if anything goes wrong
        try {
            aiResponse = nutritionAIService.estimateMacros(description);
        } catch (Throwable t) {
            log.warn("Gemini failed ({}), using local estimator.", t.getMessage());
            aiResponse = foodEstimator.estimate(description);
        }

        MealLog meal = new MealLog();
        meal.setDate(date);
        meal.setMealType(mealType);
        meal.setDescription(description);
        meal.setFoodName(description.length() > 80 ? description.substring(0, 80) + "…" : description);
        meal.setAiNotes(aiResponse);
        meal.setCalories(parseField(aiResponse, "CALORIES"));
        meal.setProtein(parseField(aiResponse, "PROTEIN"));
        meal.setCarbs(parseField(aiResponse, "CARBS"));
        meal.setFats(parseField(aiResponse, "FATS"));
        meal.setFiber(parseField(aiResponse, "FIBER"));

        User user = new User();
        user.setId(userId);
        meal.setUser(user);

        return mealRepository.save(meal);
    }

    /** Extracts a number from lines like "CALORIES: 450" */
    private Integer parseField(String text, String fieldName) {
        if (text == null) return null;
        Pattern p = Pattern.compile(fieldName + "[:\\s]+([\\d]+)", Pattern.CASE_INSENSITIVE);
        Matcher m = p.matcher(text);
        if (m.find()) {
            try { return Integer.parseInt(m.group(1)); } catch (NumberFormatException ignored) {}
        }
        return null;
    }

    public List<MealLog> getMealsByDate(Long userId, LocalDate date) {
        return mealRepository.findByUserIdAndDate(userId, date);
    }

    public List<MealLog> getAllMeals(Long userId) {
        return mealRepository.findByUserIdOrderByDateDesc(userId);
    }

    public Map<String, Integer> getDailyMacroSummary(Long userId, LocalDate date) {
        List<MealLog> meals = mealRepository.findByUserIdAndDate(userId, date);
        Map<String, Integer> summary = new HashMap<>();
        summary.put("totalCalories", meals.stream().mapToInt(m -> m.getCalories() != null ? m.getCalories() : 0).sum());
        summary.put("totalProtein",  meals.stream().mapToInt(m -> m.getProtein()  != null ? m.getProtein()  : 0).sum());
        summary.put("totalCarbs",    meals.stream().mapToInt(m -> m.getCarbs()    != null ? m.getCarbs()    : 0).sum());
        summary.put("totalFats",     meals.stream().mapToInt(m -> m.getFats()     != null ? m.getFats()     : 0).sum());
        summary.put("totalFiber",    meals.stream().mapToInt(m -> m.getFiber()    != null ? m.getFiber()    : 0).sum());
        return summary;
    }
}
