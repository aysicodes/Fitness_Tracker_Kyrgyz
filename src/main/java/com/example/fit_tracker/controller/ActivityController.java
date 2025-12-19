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
    public ResponseEntity<ActivityDTO> postActivity(@Valid @RequestBody ActivityDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(activityService.postActivity(dto));
    }

    @GetMapping("/activities")
    public ResponseEntity<List<ActivityDTO>> getActivities() {
        return ResponseEntity.ok(activityService.getActivities());
    }

    @PutMapping("/activity/{id}")
    public ResponseEntity<ActivityDTO> updateActivity(@PathVariable Long id, @Valid @RequestBody ActivityDTO dto) {
        return ResponseEntity.ok(activityService.updateActivity(id, dto));
    }

    @DeleteMapping("/activity/{id}")
    public ResponseEntity<String> deleteActivity(@PathVariable Long id) {
        String successMsg = activityService.deleteActivity(id);
        return ResponseEntity.ok(successMsg);
    }
}