//package com.example.fit_tracker.controller;
//
//import com.example.fit_tracker.dto.ActivityDTO;
//import com.example.fit_tracker.service.ActivityService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api")
//@RequiredArgsConstructor
//@CrossOrigin("*")
//public class ActivityController {
//
//    private final ActivityService activityService;
//
//    @PostMapping("/activity")
//    public ResponseEntity<?> postActivity(@RequestBody ActivityDTO dto) {
//        ActivityDTO createActivity = activityService.postActivity(dto);
//
//        if (createActivity != null) {
//            return ResponseEntity.status(HttpStatus.CREATED).body(createActivity);
//        } else {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Some thing went wrong. ");
//        }
//    }
//
//    @GetMapping("/activities")
//    public ResponseEntity<?> getActivities() {
//        try {
//            return ResponseEntity.ok(activityService.getActivities());
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong. ");
//        }
//    }
//
//    @PutMapping("/activity/{id}")
//    public ResponseEntity<?> updateActivity(@PathVariable Long id, @RequestBody ActivityDTO dto) {
//        try {
//            return ResponseEntity.ok(activityService.updateActivity(id, dto));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//        }
//    }
//
//    @DeleteMapping("/activity/{id}")
//    public ResponseEntity<?> deleteActivity(@PathVariable Long id) {
//        try {
//            activityService.deleteActivity(id);
//            return ResponseEntity.ok("Activity deleted successfully");
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
//        }
//    }
//}



package com.example.fit_tracker.controller;

import com.example.fit_tracker.dto.ActivityDTO;
import com.example.fit_tracker.service.ActivityService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List; // <<< ДОБАВЛЕН
import java.util.Locale;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin("*")
@SecurityRequirement(name = "BearerAuth")
public class ActivityController {

    private final ActivityService activityService;
    private final MessageSource messageSource;

    @PostMapping("/activity")
    // ИСПРАВЛЕНО: Убран ?
    public ResponseEntity<ActivityDTO> postActivity(@Valid @RequestBody ActivityDTO dto) {
        // Мы полагаемся на GlobalExceptionHandler, поэтому убираем проверку на null.
        return ResponseEntity.status(HttpStatus.CREATED).body(activityService.postActivity(dto));
    }

    @GetMapping("/activities")
    // ИСПРАВЛЕНО: Указан конкретный тип List<ActivityDTO>
    public ResponseEntity<List<ActivityDTO>> getActivities() {
        return ResponseEntity.ok(activityService.getActivities());
    }

    @PutMapping("/activity/{id}")
    // ИСПРАВЛЕНО: Указан конкретный тип ActivityDTO
    public ResponseEntity<ActivityDTO> updateActivity(@PathVariable Long id, @Valid @RequestBody ActivityDTO dto) {
        return ResponseEntity.ok(activityService.updateActivity(id, dto));
    }

    @DeleteMapping("/activity/{id}")
    // ИСПРАВЛЕНО: Указан конкретный тип String (для сообщения)
    public ResponseEntity<String> deleteActivity(@PathVariable Long id) {
        String successMsg = activityService.deleteActivity(id); // Сервис возвращает локализованное сообщение
        return ResponseEntity.ok(successMsg);
    }
}