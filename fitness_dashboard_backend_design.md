# AI Fitness & Hormone-Aware Health Dashboard (Backend Design)

## Project Overview

A full‑stack health analytics platform that tracks nutrition, workouts,
weight, steps, and menstrual cycle data, while providing AI-powered
insights and recommendations.

Tech Stack: - Backend: Spring Boot - Database: PostgreSQL - AI
Integration: Spring AI (LLM integration) - Scheduler: Spring Cron Jobs -
Frontend (later): React + TypeScript + Vite

------------------------------------------------------------------------

# Backend Architecture

Frontend (React) \| Spring Boot REST API \| Spring AI (LLM prompts) \|
PostgreSQL Database

------------------------------------------------------------------------

# Project Structure

fitness-dashboard │ ├── controller │ ├── WeightController │ ├──
MealController │ ├── WorkoutController │ ├── StepsController │ └──
CycleController │ ├── service │ ├── WeightService │ ├── MealService │
├── WorkoutService │ ├── StepsService │ └── CycleService │ ├──
repository │ ├── WeightRepository │ ├── MealRepository │ ├──
WorkoutRepository │ ├── StepsRepository │ └── CycleRepository │ ├──
entity │ ├── User │ ├── WeightLog │ ├── MealLog │ ├── WorkoutLog │ ├──
StepLog │ └── CycleLog │ └── dto

------------------------------------------------------------------------

# Database Entities

## User

``` java
@Entity
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer age;
    private Integer height; // cm
    private Double goalWeight; // kg
}
```

------------------------------------------------------------------------

## WeightLog

``` java
@Entity
@Data
public class WeightLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private Double weight;

    @ManyToOne
    private User user;
}
```

------------------------------------------------------------------------

## MealLog

``` java
@Entity
@Data
public class MealLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private String foodName;

    private Integer calories;
    private Integer protein;
    private Integer carbs;
    private Integer fats;
    private Integer fiber;

    @ManyToOne
    private User user;
}
```

------------------------------------------------------------------------

## WorkoutLog

``` java
@Entity
@Data
public class WorkoutLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private String exercise;

    private Integer sets;
    private Integer reps;
    private Double weight;
    private Integer durationMinutes;

    @ManyToOne
    private User user;
}
```

------------------------------------------------------------------------

## StepLog

``` java
@Entity
@Data
public class StepLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private Integer steps;

    @ManyToOne
    private User user;
}
```

------------------------------------------------------------------------

## CycleLog

``` java
@Entity
@Data
public class CycleLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate cycleStartDate;
    private Integer cycleLength;

    @ManyToOne
    private User user;
}
```

------------------------------------------------------------------------

# Repository Example

``` java
public interface WeightRepository extends JpaRepository<WeightLog, Long> {
    List<WeightLog> findByUserIdOrderByDateDesc(Long userId);
}
```

------------------------------------------------------------------------

# Service Example

``` java
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
}
```

------------------------------------------------------------------------

# Controller Example

``` java
@RestController
@RequestMapping("/weights")
@RequiredArgsConstructor
public class WeightController {

    private final WeightService weightService;

    @PostMapping
    public WeightLog logWeight(@RequestBody WeightLog log) {
        return weightService.logWeight(log);
    }

    @GetMapping("/{userId}")
    public List<WeightLog> getWeightHistory(@PathVariable Long userId) {
        return weightService.getWeightHistory(userId);
    }
}
```

------------------------------------------------------------------------

# Reminder Scheduler

Morning reminder:

``` java
@Component
public class ReminderScheduler {

    @Scheduled(cron = "0 0 8 * * ?")
    public void morningReminder() {
        System.out.println("Reminder: Log your weight!");
    }

    @Scheduled(cron = "0 0 20 * * ?")
    public void workoutReminder() {
        System.out.println("Reminder: Time to workout!");
    }
}
```

------------------------------------------------------------------------

# AI Integration (Spring AI)

Dependency (Maven):

``` xml
<dependency>
 <groupId>org.springframework.ai</groupId>
 <artifactId>spring-ai-openai-spring-boot-starter</artifactId>
</dependency>
```

Example AI Service:

``` java
@Service
public class NutritionAIService {

    private final ChatClient chatClient;

    public NutritionAIService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public String estimateMacros(String mealDescription) {
        return chatClient.prompt()
                .user("Estimate macros for: " + mealDescription)
                .call()
                .content();
    }
}
```

------------------------------------------------------------------------

# Planned AI Features

1.  Meal → Macro estimation
2.  Daily fitness feedback
3.  Hormonal cycle workout suggestions
4.  Weekly health reports
5.  Plateau detection

------------------------------------------------------------------------

# Core APIs

Weight POST /weights GET /weights/{userId}

Meals POST /meals GET /meals/{date}

Workouts POST /workouts GET /workouts/history

Steps POST /steps

Cycle POST /cycle GET /cycle/status

------------------------------------------------------------------------

# Future Features

-   AI Fitness Coach
-   Fat Loss Prediction Model
-   Habit Score System
-   Progress Photo Tracking
-   Sleep Tracking
