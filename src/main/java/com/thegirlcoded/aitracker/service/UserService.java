package com.thegirlcoded.aitracker.service;

import com.thegirlcoded.aitracker.Entity.User;
import com.thegirlcoded.aitracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User updateUser(Long id, User updated) {
        User existing = getUserById(id);
        existing.setName(updated.getName());
        existing.setAge(updated.getAge());
        existing.setHeight(updated.getHeight());
        existing.setCurrentWeight(updated.getCurrentWeight());
        existing.setGoalWeight(updated.getGoalWeight());
        existing.setSex(updated.getSex());
        existing.setActivityLevel(updated.getActivityLevel());
        
        // Recalculate metabolic data
        calculateMetabolicData(existing);
        
        return userRepository.save(existing);
    }

    public void calculateMetabolicData(User user) {
        if (user.getAge() == null || user.getHeight() == null || user.getCurrentWeight() == null || user.getSex() == null) {
            return;
        }

        // Mifflin-St Jeor Equation
        double bmr;
        if ("MALE".equalsIgnoreCase(user.getSex())) {
            bmr = (10 * user.getCurrentWeight()) + (6.25 * user.getHeight()) - (5 * user.getAge()) + 5;
        } else {
            bmr = (10 * user.getCurrentWeight()) + (6.25 * user.getHeight()) - (5 * user.getAge()) - 161;
        }
        user.setBmr(bmr);

        double multiplier = switch (user.getActivityLevel() != null ? user.getActivityLevel().toUpperCase() : "SEDENTARY") {
            case "LIGHT" -> 1.375;
            case "MODERATE" -> 1.55;
            case "ACTIVE" -> 1.725;
            case "VERY_ACTIVE" -> 1.9;
            default -> 1.2; // SEDENTARY
        };
        user.setTdee(bmr * multiplier);
        
        // Auto-set target calories to TDEE if not set, or slightly lower for weight loss if that's the goal
        if (user.getTargetCalories() == null || user.getTargetCalories() == 0) {
            user.setTargetCalories((int) Math.round(user.getTdee()));
        }
    }

    public User syncUser(String googleSub, String email, String name) {
        return userRepository.findByGoogleSub(googleSub)
                .map(existing -> {
                    existing.setEmail(email);
                    existing.setName(name);
                    return userRepository.save(existing);
                })
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setGoogleSub(googleSub);
                    newUser.setEmail(email);
                    newUser.setName(name);
                    newUser.setTargetCalories(2000); // Default
                    return userRepository.save(newUser);
                });
    }

    public User findByGoogleSub(String googleSub) {
        return userRepository.findByGoogleSub(googleSub)
                .orElseThrow(() -> new RuntimeException("User not found with googleSub: " + googleSub));
    }
}
