package com.example.fit_tracker.dto;

import lombok.Data;

@Data
public class StatsDTO {

    private long achievedGoals;

    private long notAchievedGoals;

    private int steps;

    private double distance;

    private int totalCaloriesBurned;

    private int duration;

    private int stepsLast30Days;
    private double averageDistanceLast30Days;
    private int caloriesBurnedLast30Days;
}
