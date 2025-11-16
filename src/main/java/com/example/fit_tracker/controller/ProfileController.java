//package com.example.fit_tracker.controller;
//
//import com.example.fit_tracker.dto.UserProfileRequest;
//import com.example.fit_tracker.entity.User;
//import com.example.fit_tracker.service.UserService;
//import com.example.fit_tracker.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//
//@CrossOrigin(origins = "*", maxAge = 3600)
//@RestController
//@RequestMapping("/api/profile")
//@RequiredArgsConstructor
//@PreAuthorize("isAuthenticated()") // Все методы требуют токена
//public class ProfileController {
//
//    private final UserService userService;
//    private final UserRepository userRepository;
//
//
//    @GetMapping
//    public ResponseEntity<User> getCurrentUserProfile() {
//        User user = userService.getCurrentUser();
//
//        return ResponseEntity.ok(user);
//    }
//
//
//    @PutMapping
//    public ResponseEntity<?> updateProfile(@RequestBody UserProfileRequest profileRequest) {
//        User user = userService.getCurrentUser();
//
//        User updatedUser = userService.updateProfile(user, profileRequest);
//
//        return ResponseEntity.ok(updatedUser);
//    }
//
//
//    @DeleteMapping
//    public ResponseEntity<?> deleteMyAccount() {
//        User user = userService.getCurrentUser();
//        userRepository.delete(user);
//        return ResponseEntity.ok("Account deleted successfully!");
//    }
//}



package com.example.fit_tracker.controller;

import com.example.fit_tracker.dto.UserProfileRequest;
import com.example.fit_tracker.dto.MessageResponse;
import com.example.fit_tracker.entity.User;
import com.example.fit_tracker.service.UserService;
import com.example.fit_tracker.repository.UserRepository;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
@SecurityRequirement(name = "BearerAuth")
public class ProfileController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final MessageSource messageSource;

    @GetMapping
    // ИСПРАВЛЕНО: Указан конкретный тип User
    public ResponseEntity<User> getCurrentUserProfile() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(user);
    }


    @PutMapping
    // ИСПРАВЛЕНО: Указан конкретный тип User
    public ResponseEntity<User> updateProfile(@RequestBody UserProfileRequest profileRequest) {
        User user = userService.getCurrentUser();
        User updatedUser = userService.updateProfile(user, profileRequest);
        return ResponseEntity.ok(updatedUser);
    }


    @DeleteMapping
    // ИСПРАВЛЕНО: Указан конкретный тип MessageResponse
    public ResponseEntity<MessageResponse> deleteMyAccount() {
        User user = userService.getCurrentUser();
        userRepository.delete(user);

        Locale currentLocale = LocaleContextHolder.getLocale();
        String successMsg = messageSource.getMessage("profile.deleted.success", null, currentLocale);

        return ResponseEntity.ok(new MessageResponse(successMsg));
    }
}
