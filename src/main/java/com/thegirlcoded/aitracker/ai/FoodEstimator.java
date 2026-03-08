package com.thegirlcoded.aitracker.ai;

import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Keyword-based macro estimator for common Indian/general foods.
 * Used as fallback when Gemini AI is unavailable.
 * Values per typical single serving.
 */
@Component
public class FoodEstimator {

    // { food keyword -> [calories, protein, carbs, fats, fiber] }
    private static final Map<String, int[]> FOOD_DB = new LinkedHashMap<>();

    static {
        // Indian staples
        FOOD_DB.put("roti",     new int[]{80,  3,  15, 1, 1});
        FOOD_DB.put("chapati",  new int[]{80,  3,  15, 1, 1});
        FOOD_DB.put("paratha",  new int[]{150, 4,  20, 6, 2});
        FOOD_DB.put("rice",     new int[]{200, 4,  44, 0, 1});
        FOOD_DB.put("dal",      new int[]{150, 9,  22, 3, 6});
        FOOD_DB.put("daal",     new int[]{150, 9,  22, 3, 6});
        FOOD_DB.put("rajma",    new int[]{180, 12, 28, 2, 8});
        FOOD_DB.put("chole",    new int[]{180, 10, 28, 4, 8});
        FOOD_DB.put("paneer",   new int[]{265, 18, 4,  20,0});
        FOOD_DB.put("sabzi",    new int[]{80,  3,  10, 4, 3});
        FOOD_DB.put("sabji",    new int[]{80,  3,  10, 4, 3});
        FOOD_DB.put("curry",    new int[]{150, 8,  12, 8, 3});
        FOOD_DB.put("biryani",  new int[]{350, 15, 50, 10,2});
        FOOD_DB.put("pulao",    new int[]{260, 8,  45, 6, 2});
        FOOD_DB.put("idli",     new int[]{40,  2,  8,  0, 1});
        FOOD_DB.put("dosa",     new int[]{120, 3,  20, 4, 1});
        FOOD_DB.put("sambar",   new int[]{80,  4,  12, 2, 4});
        FOOD_DB.put("upma",     new int[]{180, 5,  30, 5, 2});
        FOOD_DB.put("poha",     new int[]{200, 4,  36, 5, 2});
        // Dairy
        FOOD_DB.put("raita",    new int[]{60,  3,  5,  3, 0});
        FOOD_DB.put("curd",     new int[]{60,  3,  5,  3, 0});
        FOOD_DB.put("yogurt",   new int[]{60,  5,  7,  1, 0});
        FOOD_DB.put("milk",     new int[]{120, 6,  10, 5, 0});
        FOOD_DB.put("lassi",    new int[]{150, 5,  20, 5, 0});
        FOOD_DB.put("chai",     new int[]{50,  1,  6,  2, 0});
        FOOD_DB.put("tea",      new int[]{30,  1,  5,  1, 0});
        FOOD_DB.put("coffee",   new int[]{35,  1,  5,  2, 0});
        FOOD_DB.put("butter",   new int[]{72,  0,  0,  8, 0});
        FOOD_DB.put("ghee",     new int[]{45,  0,  0,  5, 0});
        // Proteins
        FOOD_DB.put("eggs",     new int[]{70,  6,  0,  5, 0});
        FOOD_DB.put("egg",      new int[]{70,  6,  0,  5, 0});
        FOOD_DB.put("chicken",  new int[]{165, 31, 0,  4, 0});
        FOOD_DB.put("fish",     new int[]{130, 22, 0,  5, 0});
        FOOD_DB.put("mutton",   new int[]{200, 26, 0,  10,0});
        // Others
        FOOD_DB.put("banana",   new int[]{90,  1,  23, 0, 3});
        FOOD_DB.put("apple",    new int[]{80,  0,  21, 0, 4});
        FOOD_DB.put("bread",    new int[]{80,  3,  15, 1, 1});
        FOOD_DB.put("toast",    new int[]{80,  3,  15, 1, 1});
        FOOD_DB.put("oats",     new int[]{150, 5,  27, 3, 4});
        FOOD_DB.put("salad",    new int[]{50,  2,  8,  1, 3});
        FOOD_DB.put("sandwich", new int[]{220, 10, 28, 8, 3});
    }

    public String estimate(String description) {
        String lower = description.toLowerCase();
        int[] totals = new int[5]; // cal, protein, carbs, fats, fiber
        StringBuilder matched = new StringBuilder();
        boolean found = false;

        for (Map.Entry<String, int[]> entry : FOOD_DB.entrySet()) {
            if (lower.contains(entry.getKey())) {
                int qty = extractQty(lower, entry.getKey());
                int[] v = entry.getValue();
                for (int i = 0; i < 5; i++) totals[i] += v[i] * qty;
                matched.append("- ").append(qty > 1 ? qty + "x " : "").append(entry.getKey()).append("\n");
                found = true;
            }
        }

        if (!found) {
            totals = new int[]{400, 15, 45, 12, 4};
            matched.append("- Could not identify specific foods — used average meal estimate\n");
        }

        return String.format(
            "CALORIES: %d\nPROTEIN: %d\nCARBS: %d\nFATS: %d\nFIBER: %d\n\n" +
            "ASSUMPTIONS:\n%s" +
            "- Portion sizes assumed as one typical serving unless quantity was mentioned\n" +
            "- Cooking oil/spices add ~10-15%% to fats and calories\n\n" +
            "TIP: Log consistently so your weekly AI report can spot patterns in your nutrition!\n\n" +
            "⚠️ Estimated locally (Gemini unavailable — add billing to Google Cloud to enable AI estimates).",
            totals[0], totals[1], totals[2], totals[3], totals[4], matched
        );
    }

    private int extractQty(String text, String food) {
        int idx = text.indexOf(food);
        if (idx <= 0) return 1;
        String before = text.substring(Math.max(0, idx - 6), idx).trim();
        String[] parts = before.split("\\s+");
        try { return Integer.parseInt(parts[parts.length - 1]); }
        catch (Exception e) { return 1; }
    }
}
