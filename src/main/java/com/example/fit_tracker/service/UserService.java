package com.example.fit_tracker.service;
//
//
//import com.example.fit_tracker.dto.PasswordResetRequest;
import com.example.fit_tracker.dto.UserProfileRequest;
import com.example.fit_tracker.entity.User;

public interface UserService {
    /**
     * Retrieves the currently authenticated user from the Spring Security context.
     * @return The currently authenticated User entity.
     * @throws jakarta.persistence.EntityNotFoundException if the user is not found.
     */
    User getCurrentUser();

    User updateProfile(User user, UserProfileRequest profileRequest);

//    String createPasswordResetToken(String email);
//
//    User resetPassword(PasswordResetRequest request);
}