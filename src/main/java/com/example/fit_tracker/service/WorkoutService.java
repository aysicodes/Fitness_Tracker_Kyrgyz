package com.example.fit_tracker.service;

import com.example.fit_tracker.dto.WorkoutDTO;

import java.util.List;

public interface WorkoutService {

    WorkoutDTO postWorkout(WorkoutDTO workoutDTO);

    List<WorkoutDTO> getWorkouts();

    WorkoutDTO updateWorkout(Long id, WorkoutDTO workoutDTO); // Изменен Object на WorkoutDTO
    String deleteWorkout(Long id);
}
