package com.thegirlcoded.aitracker.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

/**
 * Calls Gemini to estimate nutritional macros from a plain-text meal
 * description.
 * Any exceptions propagate up — the caller (MealService) handles fallback.
 */
@Service
@RequiredArgsConstructor
public class NutritionAIService {

    private final ChatClient chatClient;

    public String estimateMacros(String mealDescription) {
        String prompt = """
                You are a nutrition expert AI estimating macros for everyday meals.

                The meal description may not contain exact measurements.
                Use reasonable assumptions based on typical home-cooked portions.

                Guidelines:
                - If quantities like "1 bowl", "1 plate", "1 cup" appear, assume a typical household serving.
                - If a range like "5-6" appears, assume the midpoint.
                - If vague terms like "some", "few", or "little" appear, assume a small portion.
                - Prefer conservative estimates rather than restaurant-sized servings.
                - Consider cooking methods (fried, grilled, boiled) when estimating fats and calories.
                - Do not overestimate calories when quantities are unclear.

                First mentally break the meal into individual items, estimate each item, then compute totals.

                Meal description: "%s"

                Respond ONLY in this exact format:

                CALORIES: <number>
                PROTEIN: <number>
                CARBS: <number>
                FATS: <number>
                FIBER: <number>

                ASSUMPTIONS:
                <bullet list explaining portion assumptions>

                TIP: <one short friendly health tip>
                """.formatted(mealDescription);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }
}
