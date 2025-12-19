package com.example.fit_tracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class SignupRequest {

    @NotBlank(message = "{user.username.notblank}") // Локализованное сообщение
    @Size(min = 3, max = 20, message = "{user.username.size}")
    private String username;

    @NotBlank(message = "{user.email.notblank}")
    @Size(max = 50, message = "{user.email.size}")
    @Email(message = "{user.email.invalid}")
    private String email;

    @NotBlank(message = "{user.password.notblank}")
    @Size(min = 6, max = 40, message = "{user.password.size}")
    private String password;
}
