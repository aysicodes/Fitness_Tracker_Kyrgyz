package com.example.fit_tracker.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.Date;

@Data
public class WorkoutDTO {

    private Long id;

    @NotBlank(message = "{workout.type.notblank}")
    private String type;

    @NotNull(message = "{workout.date.notnull}")
    private Date date;

    @Min(value = 1, message = "{workout.duration.min}")
    private int duration;

    @Min(value = 1, message = "{workout.calories.min}")
    @JsonProperty("caloriesBurned")
    private int caloriesBurned;
}
