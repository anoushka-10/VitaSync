package com.thegirlcoded.aitracker.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

/**
 * Calls Gemini to estimate nutritional macros from a plain-text meal description.
 * Any exceptions propagate up — the caller (MealService) handles fallback.
 */
@Service
@RequiredArgsConstructor
public class NutritionAIService {

    private final ChatClient chatClient;

    public String estimateMacros(String mealDescription) {
        String prompt = """
                You are a nutrition expert AI. A user has described their meal in plain text.
                Estimate the nutritional content and clearly state your assumptions.
                
                Meal description: "%s"
                
                Respond ONLY in this exact format:
                
                CALORIES: <number>
                PROTEIN: <number>
                CARBS: <number>
                FATS: <number>
                FIBER: <number>
                
                ASSUMPTIONS:
                <bullet list of assumptions: portion sizes, cooking method, etc.>
                
                TIP: <one short friendly health tip about this meal>
                
                Use realistic estimates for home-cooked Indian/general food.
                """.formatted(mealDescription);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }
}
