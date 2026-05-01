package com.example.fit_tracker.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ActivityByDayDTO {
    private LocalDate date;
    private int steps = 0;           // int
    private double distance = 0.0;    // double
    private int caloriesBurned = 0;  // int
}