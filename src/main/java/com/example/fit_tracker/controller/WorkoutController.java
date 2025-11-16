//package com.example.fit_tracker.controller;
//
//import com.example.fit_tracker.dto.WorkoutDTO;
//import com.example.fit_tracker.service.WorkoutService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api")
//@RequiredArgsConstructor
//@CrossOrigin("*")
//public class WorkoutController {
//
//    private final WorkoutService workoutService;
//
//    @PostMapping("/workout")
//    public ResponseEntity<?> postWorkout(@RequestBody WorkoutDTO workoutDTO) {
//        try {
//            return ResponseEntity.ok(workoutService.postWorkout(workoutDTO));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong. ");
//        }
//    }
//
//    @GetMapping("/workouts")
//    public ResponseEntity<?> getWorkouts() {
//        try {
//            return ResponseEntity.ok(workoutService.getWorkouts());
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong. ");
//        }
//    }
//
//    @PutMapping("/workout/{id}")
//    public ResponseEntity<?> updateWorkout(@PathVariable Long id, @RequestBody WorkoutDTO workoutDTO) {
//        try {
//            return ResponseEntity.ok(workoutService.updateWorkout(id, workoutDTO));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//        }
//    }
//
//    @DeleteMapping("/workout/{id}")
//    public ResponseEntity<?> deleteWorkout(@PathVariable Long id) {
//        try {
//            workoutService.deleteWorkout(id);
//            return ResponseEntity.ok("Workout deleted successfully");
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
//        }
//    }
//
//}




package com.example.fit_tracker.controller;

import com.example.fit_tracker.dto.WorkoutDTO;
import com.example.fit_tracker.service.WorkoutService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;

import com.example.fit_tracker.dto.WorkoutDTO;
// ... (импорты)
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
// ... (импорты)

import java.util.List; // <<< ДОБАВЛЕН

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin("*")
@SecurityRequirement(name = "BearerAuth")
public class WorkoutController {

    private final WorkoutService workoutService;
    private final MessageSource messageSource;

    @PostMapping("/workout")
    // ИСПРАВЛЕНО: Указан конкретный тип WorkoutDTO
    public ResponseEntity<WorkoutDTO> postWorkout(@Valid @RequestBody WorkoutDTO workoutDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(workoutService.postWorkout(workoutDTO));
    }

    @GetMapping("/workouts")
    // ИСПРАВЛЕНО: Указан конкретный тип List<WorkoutDTO>
    public ResponseEntity<List<WorkoutDTO>> getWorkouts() {
        return ResponseEntity.ok(workoutService.getWorkouts());
    }

    @PutMapping("/workout/{id}")
    // ИСПРАВЛЕНО: Указан конкретный тип WorkoutDTO
    public ResponseEntity<WorkoutDTO> updateWorkout(@PathVariable Long id,@Valid @RequestBody WorkoutDTO workoutDTO) {
        return ResponseEntity.ok(workoutService.updateWorkout(id, workoutDTO));
    }

    @DeleteMapping("/workout/{id}")
    // ИСПРАВЛЕНО: Указан конкретный тип String
    public ResponseEntity<String> deleteWorkout(@PathVariable Long id) {
        String successMsg = workoutService.deleteWorkout(id);
        return ResponseEntity.ok(successMsg);
    }
}