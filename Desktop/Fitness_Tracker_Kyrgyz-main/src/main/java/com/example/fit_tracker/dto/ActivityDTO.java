package com.example.fit_tracker.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;


import java.util.Date;

@Data
public class ActivityDTO {
    private Long id;

    @NotNull(message = "{activity.date.notnull}")
    private Date date;

    @Min(value = 0, message = "{activity.steps.min}")
    private int steps;

    @Min(value = 0, message = "{activity.distance.min}")
    private double distance;

    @Min(value = 0, message = "{activity.calories.min}")
    @JsonProperty("caloriesBurned")
    private int caloriesBurned;
}
