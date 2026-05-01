
package com.example.fit_tracker.controller;

import com.example.fit_tracker.dto.GoalDTO;
import com.example.fit_tracker.dto.WorkoutDTO;
import com.example.fit_tracker.service.GoalService;
import com.example.fit_tracker.service.WorkoutService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin("*")
@SecurityRequirement(name = "BearerAuth")
public class GoalController {

    private final GoalService goalService;
    private final WorkoutService workoutService;

    private final MessageSource messageSource;

    @PostMapping("/goal")
    public ResponseEntity<GoalDTO> postGoal(@Valid @RequestBody GoalDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(goalService.postGoal(dto));
    }

    @GetMapping("/goals")
    public ResponseEntity<List<GoalDTO>> getGoals() {
        return ResponseEntity.ok(goalService.getGoals());
    }

    @GetMapping("/goal/status/{id}")
    public ResponseEntity<GoalDTO> updateStatus(@PathVariable Long id) {
        return ResponseEntity.ok(goalService.updateStatus(id));
    }

    @PutMapping("/goal/{id}")
    public ResponseEntity<GoalDTO> updateGoal(@PathVariable Long id, @Valid @RequestBody GoalDTO dto) {
        return ResponseEntity.ok((GoalDTO) goalService.updateGoal(id, dto));
    }

    @DeleteMapping("/goal/{id}")
    public ResponseEntity<String> deleteGoal(@PathVariable Long id) {
        String successMsg = goalService.deleteGoal(id);
        return ResponseEntity.ok(successMsg);
    }

    @GetMapping("/workouts/date")
    public ResponseEntity<List<WorkoutDTO>> getWorkoutsByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date date) {

        // ВАЖНО: @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        // Гарантирует, что строка даты (YYYY-MM-DD) правильно преобразуется в объект java.util.Date.

        return ResponseEntity.ok(workoutService.getWorkoutsByDate(date));
    }
}
