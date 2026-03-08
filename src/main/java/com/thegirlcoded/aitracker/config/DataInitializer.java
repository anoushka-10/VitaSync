package com.thegirlcoded.aitracker.config;

import com.thegirlcoded.aitracker.Entity.User;
import com.thegirlcoded.aitracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;

    /**
     * Seeds a default user on startup so all endpoints work immediately.
     * User ID will be 1. You can update this profile via PUT /users/1.
     */
    @Bean
    public ApplicationRunner seedDefaultUser() {
        return args -> {
            if (userRepository.count() == 0) {
                User user = new User();
                user.setName("Anoushka");
                user.setAge(22);
                user.setHeight(165.0); // cm
                user.setCurrentWeight(58.0); // kg
                user.setGoalWeight(60.0); // kg
                user.setSex("FEMALE");
                user.setActivityLevel("MODERATE");
                user.setTargetCalories(1800);
                userRepository.save(user);
                System.out.println("✅ Default user seeded: " + user.getName() + " (id=1)");
            }
        };
    }
}
