package com.example.fit_tracker.controller;

import com.example.fit_tracker.dto.WorkoutDTO;
import com.example.fit_tracker.service.WorkoutService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin("*")
@SecurityRequirement(name = "BearerAuth")
public class WorkoutController {

    private final WorkoutService workoutService;
    private final MessageSource messageSource;

    @Operation(summary = "Создать новую запись о тренировке")
    @PostMapping("/workout")
    public ResponseEntity<WorkoutDTO> postWorkout(@Validated @RequestBody WorkoutDTO workoutDTO) {
        return new ResponseEntity<>(workoutService.postWorkout(workoutDTO), HttpStatus.CREATED);
    }

    @GetMapping("/workouts")
    public ResponseEntity<List<WorkoutDTO>> getWorkouts() {
        return ResponseEntity.ok(workoutService.getWorkouts());
    }

    @PutMapping("/workout/{id}")
    public ResponseEntity<WorkoutDTO> updateWorkout(@PathVariable Long id,@Valid @RequestBody WorkoutDTO workoutDTO) {
        return ResponseEntity.ok(workoutService.updateWorkout(id, workoutDTO));
    }

    @DeleteMapping("/workout/{id}")
    public ResponseEntity<String> deleteWorkout(@PathVariable Long id) {
        String successMsg = workoutService.deleteWorkout(id);
        return ResponseEntity.ok(successMsg);
    }
}