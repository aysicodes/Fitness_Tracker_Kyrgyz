package com.example.fit_tracker.service;

import com.example.fit_tracker.dto.ActivityByDayDTO;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

// НОВЫЙ ИМПОРТ: для корректного маппинга даты из PostgreSQL

@Service
@RequiredArgsConstructor
public class StatsServiceImpl implements StatsService {

    private final GoalRepository goalRepository;
    private final ActivityRepository activityRepository;
    private final WorkoutRepository workoutRepository;

    public StatsDTO getStats() {
        // ... (метод getStats остается без изменений)
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


    @Override
    public List<ActivityByDayDTO> getDailyActivityLast30Days() {
        Long userId = getCurrentUserId();

        // 1. Расчет диапазона дат
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(29);
        Date date30DaysAgo = Date.from(startDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

        // 2. Получение данных
        List<Object[]> activityData = activityRepository.getDailyActivitySinceDate(userId, date30DaysAgo);
        List<Object[]> workoutCaloriesData = workoutRepository.getDailyCaloriesSinceDate(userId, date30DaysAgo);

        // 3. Объединение Activity и Workout данных в Map
        Map<LocalDate, ActivityByDayDTO> dailyStatsMap = Stream.concat(
                // Обработка Activity
                activityData.stream().map(arr -> {
                    // ИСПРАВЛЕНИЕ ДАТЫ: Используем java.sql.Date для преобразования
                    LocalDate date = ((java.sql.Date) arr[0]).toLocalDate();
                    ActivityByDayDTO dto = new ActivityByDayDTO();
                    dto.setDate(date);

                    // Упрощенное приведение (COALESCE гарантирует Number)
                    dto.setSteps(((Number) arr[1]).intValue());
                    dto.setDistance(((Number) arr[2]).doubleValue());
                    dto.setCaloriesBurned(((Number) arr[3]).intValue());

                    return dto;
                }),
                // Обработка Workout Calories
                workoutCaloriesData.stream().map(arr -> {
                    // ИСПРАВЛЕНИЕ ДАТЫ: Используем java.sql.Date для преобразования
                    LocalDate date = ((java.sql.Date) arr[0]).toLocalDate();
                    ActivityByDayDTO dto = new ActivityByDayDTO();
                    dto.setDate(date);

                    // Упрощенное приведение
                    dto.setCaloriesBurned(((Number) arr[1]).intValue());

                    return dto;
                })
        ).collect(Collectors.toMap(
                ActivityByDayDTO::getDate,
                dto -> dto,
                // Объединение: суммируем значения, если дата уже есть
                (dto1, dto2) -> {
                    dto1.setSteps(dto1.getSteps() + dto2.getSteps());
                    dto1.setDistance(dto1.getDistance() + dto2.getDistance());
                    dto1.setCaloriesBurned(dto1.getCaloriesBurned() + dto2.getCaloriesBurned());
                    return dto1;
                }
        ));

        // 4. Заполнение недостающих дней нулями (Java 8 fix)
        List<LocalDate> dates = Stream.iterate(startDate, date -> date.plusDays(1))
                .limit(ChronoUnit.DAYS.between(startDate, endDate) + 1)
                .collect(Collectors.toList());

        for (LocalDate date : dates) {
            dailyStatsMap.computeIfAbsent(date, d -> {
                ActivityByDayDTO dto = new ActivityByDayDTO();
                dto.setDate(d);
                return dto;
            });
        }

        // 5. Сортировка и возврат
        return dailyStatsMap.values().stream()
                .sorted(Comparator.comparing(ActivityByDayDTO::getDate))
                .collect(Collectors.toList());
    }
}