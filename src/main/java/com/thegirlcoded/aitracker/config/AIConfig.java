package com.thegirlcoded.aitracker.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AIConfig {

    /**
     * Creates a shared ChatClient bean configured with the Gemini model.
     * The API key and model are set via application.properties.
     * Both NutritionAIService and InsightAIService inject this bean.
     */
    @Bean
    public ChatClient chatClient(ChatClient.Builder builder) {
        return builder.build();
    }
}
