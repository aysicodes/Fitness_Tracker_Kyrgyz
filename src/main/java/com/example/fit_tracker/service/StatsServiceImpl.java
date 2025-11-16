package com.example.fit_tracker.service;

import com.example.fit_tracker.dto.StatsDTO;
import com.example.fit_tracker.repository.ActivityRepository;
import com.example.fit_tracker.repository.GoalRepository;
import com.example.fit_tracker.repository.WorkoutRepository;
import com.example.fit_tracker.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class StatsServiceImpl implements StatsService {

    private final GoalRepository goalRepository;
    private final ActivityRepository activityRepository;
    private final WorkoutRepository workoutRepository;

    public StatsDTO getStats() {
        // 1. Получаем ID текущего пользователя
        Long userId = getCurrentUserId();

        // 2. Goals
        Long achievedGoals = goalRepository.countByUserIdAndAchievedTrue(userId);
        Long notAchievedGoals = goalRepository.countByUserIdAndAchievedFalse(userId);

        // 3. Activity Totals (Используем Long для шагов, как в репозитории)
        Long totalSteps = activityRepository.getTotalStepsByUserId(userId); // <<< Long
        Double totalDistance = activityRepository.getTotalDistanceByUserId(userId);
        Integer totalActivityCaloriesBurned = activityRepository.getTotalActivityCaloriesByUserId(userId);

        // 4. Timeframe calculation
        Date date30DaysAgo = Date.from(Instant.now().minus(30, ChronoUnit.DAYS));

        // 5. Activity Last 30 Days (Используем Long для шагов)
        Long stepsLast30Days = activityRepository.getStepsSinceDate(userId, date30DaysAgo); // <<< Long
        Double avgDistanceLast30Days = activityRepository.getAverageDistanceSinceDate(userId, date30DaysAgo);

        // 6. Workout Totals
        Integer totalWorkoutDuration = workoutRepository.getTotalDurationByUserId(userId);
        Integer totalWorkoutCaloriesBurned = workoutRepository.getTotalCaloriesBurnedByUserId(userId);

        // 7. Workout Last 30 Days
        Integer calories30Days = workoutRepository.getCaloriesBurnedSinceDate(userId, date30DaysAgo);


        int totalCaloriesBurned = (totalActivityCaloriesBurned != null ? totalActivityCaloriesBurned : 0) +
                (totalWorkoutCaloriesBurned != null ? totalWorkoutCaloriesBurned : 0);

        StatsDTO dto = new StatsDTO();

        // --- МАППИНГ ДАННЫХ (с защитой от Null и корректными типами) ---
        dto.setAchievedGoals(achievedGoals != null ? achievedGoals : 0L);
        dto.setNotAchievedGoals(notAchievedGoals != null ? notAchievedGoals : 0L);

        // Шаги и Дистанция (Long и Double)
        dto.setSteps(totalSteps != null ? totalSteps.intValue() : 0); // Конвертируем Long в Integer для DTO, если это требуется
        dto.setDistance(totalDistance != null ? totalDistance : 0.0);

        // Калории и Длительность
        dto.setTotalCaloriesBurned(totalCaloriesBurned);
        dto.setDuration(totalWorkoutDuration != null ? totalWorkoutDuration : 0);

        // Статистика за 30 дней (Шаги Long -> Integer, если требуется)
        dto.setStepsLast30Days(stepsLast30Days != null ? stepsLast30Days.intValue() : 0);
        dto.setAverageDistanceLast30Days(avgDistanceLast30Days != null ? avgDistanceLast30Days : 0.0);
        dto.setCaloriesBurnedLast30Days(calories30Days != null ? calories30Days : 0);

        return dto;
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            return ((UserDetailsImpl) authentication.getPrincipal()).getId();
        }
        throw new RuntimeException("User not authenticated or user ID not found.");
    }
}