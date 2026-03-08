package com.thegirlcoded.aitracker.controller;

import com.thegirlcoded.aitracker.Entity.User;
import com.thegirlcoded.aitracker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<User> getMe(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        
        String googleSub = principal.getAttribute("sub");
        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");
        
        try {
            //Resilient sync: ensure user exists in our DB if they are authenticated via Google
            User user = userService.syncUser(googleSub, email, name);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateMe(@AuthenticationPrincipal OAuth2User principal, @RequestBody User updatedProfile) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        
        String googleSub = principal.getAttribute("sub");
        User user = userService.findByGoogleSub(googleSub);
        
        // Update fields
        user.setName(updatedProfile.getName());
        user.setAge(updatedProfile.getAge());
        user.setHeight(updatedProfile.getHeight());
        user.setCurrentWeight(updatedProfile.getCurrentWeight());
        user.setGoalWeight(updatedProfile.getGoalWeight());
        user.setSex(updatedProfile.getSex());
        user.setActivityLevel(updatedProfile.getActivityLevel());
        user.setTargetCalories(updatedProfile.getTargetCalories());
        
        // Recalculate BMR/TDEE
        userService.calculateMetabolicData(user);
        
        // Save using service method (which preserves other fields)
        User saved = userService.createUser(user); 
        return ResponseEntity.ok(saved);
    }
}
