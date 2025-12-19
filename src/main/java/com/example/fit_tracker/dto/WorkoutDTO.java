
package com.example.fit_tracker.dto;

import com.example.fit_tracker.entity.Workout;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.Date;

@Data
public class WorkoutDTO {

    private Long id;

    private String typeKey;

    // Если заполнено, то это ввод пользователя
    private String customType;

    private String type;

    @NotNull(message = "{workout.date.notnull}")
    private Date date;

    @Min(value = 1, message = "{workout.duration.min}")
    private int duration;

    @Min(value = 1, message = "{workout.calories.min}")
    @JsonProperty("caloriesBurned")
    private int caloriesBurned;

    // Новый статический метод для конвертации сущности в DTO с локализацией
    public static WorkoutDTO fromEntity(Workout workout, String translatedType) {
        WorkoutDTO dto = new WorkoutDTO();
        dto.setId(workout.getId());
        dto.setTypeKey(workout.getTypeKey());
        dto.setCustomType(workout.getCustomType());
        dto.setDate(workout.getDate());
        dto.setDuration(workout.getDuration());
        dto.setCaloriesBurned(workout.getCaloriesBurned());
        dto.setType(translatedType); // Устанавливаем переведенное значение
        return dto;
    }
}