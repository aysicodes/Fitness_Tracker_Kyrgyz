//package com.example.fit_tracker.controller;
//
//import com.example.fit_tracker.dto.GoalDTO;
//import com.example.fit_tracker.service.GoalService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//
//@RestController
//@RequestMapping("/api")
//@RequiredArgsConstructor
//@CrossOrigin("*")
//public class GoalController {
//
//    private final GoalService goalService;
//
//    @PostMapping("/goal")
//    public ResponseEntity<?> postGoal(@RequestBody GoalDTO dto) {
//        try {
//            return ResponseEntity.status(HttpStatus.CREATED).body(goalService.postGoal(dto));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
//        }
//    }
//
//    @GetMapping("/goals")
//    public ResponseEntity<?> getGoals() {
//        try {
//            return ResponseEntity.ok(goalService.getGoals());
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Some thing went wrong. ");
//        }
//    }
//
//    @GetMapping("/goal/status/{id}")
//    public ResponseEntity<?> updateStatus(@PathVariable Long id) {
//        try {
//            return ResponseEntity.ok(goalService.updateStatus(id));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//        }
//    }
//
//    @PutMapping("/goal/{id}")
//    public ResponseEntity<?> updateGoal(@PathVariable Long id, @RequestBody GoalDTO dto) {
//        try {
//            return ResponseEntity.ok(goalService.updateGoal(id, dto));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//        }
//    }
//
//    @DeleteMapping("/goal/{id}")
//    public ResponseEntity<?> deleteGoal(@PathVariable Long id) {
//        try {
//            goalService.deleteGoal(id);
//            return ResponseEntity.ok("Goal deleted successfully");
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
//        }
//    }
//}
//


package com.example.fit_tracker.controller;

import com.example.fit_tracker.dto.GoalDTO;
// ... (импорты)
import com.example.fit_tracker.service.GoalService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
// ... (импорты)
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List; // <<< ДОБАВЛЕН
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin("*")
@SecurityRequirement(name = "BearerAuth")
public class GoalController {

    private final GoalService goalService;
    private final MessageSource messageSource; // (Уже есть)

    @PostMapping("/goal")
    public ResponseEntity<GoalDTO> postGoal(@Valid @RequestBody GoalDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(goalService.postGoal(dto));
    }

    @GetMapping("/goals")
    // ИСПРАВЛЕНО: Указан конкретный тип List<GoalDTO>
    public ResponseEntity<List<GoalDTO>> getGoals() {
        return ResponseEntity.ok(goalService.getGoals());
    }

    @GetMapping("/goal/status/{id}")
    // ИСПРАВЛЕНО: Указан конкретный тип GoalDTO
    public ResponseEntity<GoalDTO> updateStatus(@PathVariable Long id) {
        return ResponseEntity.ok(goalService.updateStatus(id));
    }

    @PutMapping("/goal/{id}")
    // ИСПРАВЛЕНО: Указан конкретный тип GoalDTO
    public ResponseEntity<GoalDTO> updateGoal(@PathVariable Long id, @Valid @RequestBody GoalDTO dto) {
        return ResponseEntity.ok((GoalDTO) goalService.updateGoal(id, dto));
    }

    @DeleteMapping("/goal/{id}")
    // ИСПРАВЛЕНО: Указан конкретный тип String (для сообщения)
    public ResponseEntity<String> deleteGoal(@PathVariable Long id) {
        String successMsg = goalService.deleteGoal(id); // Сервис возвращает локализованное сообщение
        return ResponseEntity.ok(successMsg);
    }
}