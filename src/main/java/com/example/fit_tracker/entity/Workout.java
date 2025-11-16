package com.example.fit_tracker.entity;

import com.example.fit_tracker.dto.WorkoutDTO;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
@Table(name = "workout")
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;

    private Date date;

    private int duration;

    @Column(name = "calories_burned")
    private int caloriesBurned;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false) // user_id - внешний ключ
    private User user;
    public WorkoutDTO getWorkoutDto() {
        WorkoutDTO workoutDTO = new WorkoutDTO();

        workoutDTO.setId(id);
        workoutDTO.setType(type);
        workoutDTO.setDate(date);
        workoutDTO.setDuration(duration);
        workoutDTO.setCaloriesBurned(caloriesBurned);

        return workoutDTO;
    }
}
