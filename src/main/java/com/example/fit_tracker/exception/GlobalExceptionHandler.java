
package com.example.fit_tracker.exception;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;

import javax.naming.AuthenticationException;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private final MessageSource messageSource;


    // --- ОБЩИЙ ОБРАБОТЧИК (500) ---
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleException(Exception ex) {
        ErrorDetails errorDetails = new ErrorDetails("INTERNAL_SERVER_ERROR", ex.getMessage());
        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // --- 404 NOT FOUND ---
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Object> handleEntityNotFound(EntityNotFoundException ex) {
        // Мы используем сообщение, переданное из сервиса (которое уже локализовано)
        ErrorDetails errorDetails = new ErrorDetails("NOT_FOUND", ex.getMessage());
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }

    // --- 401 AUTH FAILED (Bad Credentials) ---
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Object> handleBadCredentials(BadCredentialsException ex) {
        Locale currentLocale = LocaleContextHolder.getLocale();

        String localizedMessage = messageSource.getMessage(
                "auth.bad.credentials",
                null,
                "Invalid username or password.",
                currentLocale
        );

        ErrorDetails errorDetails = new ErrorDetails("AUTHENTICATION_FAILED", localizedMessage);
        return new ResponseEntity<>(errorDetails, HttpStatus.UNAUTHORIZED);
    }

    // --- 400 BAD REQUEST (IllegalArgumentException) ---
    // Этот обработчик должен использоваться для бизнес-логики (например, "Нельзя удалить чужой ресурс"
    // если мы не используем AccessDeniedException)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgument(IllegalArgumentException ex) {
        // Мы используем сообщение, переданное из сервиса (которое уже локализовано)
        ErrorDetails errorDetails = new ErrorDetails("BAD_REQUEST", ex.getMessage());
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    // --- 400 VALIDATION ERRORS (MethodArgumentNotValidException) ---
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationErrors(MethodArgumentNotValidException ex) {

        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        err -> err.getField(),
                        err -> err.getDefaultMessage()
                ));

        Map<String, Object> body = new HashMap<>();
        body.put("errorCode", "VALIDATION_FAILED");
        body.put("errors", fieldErrors);

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    // --- 403 FORBIDDEN (Access Denied / Spring Security) ---
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> handleAccessDenied(AccessDeniedException ex) {
        // Мы используем сообщение, переданное из сервиса (которое уже локализовано)
        ErrorDetails errorDetails = new ErrorDetails("FORBIDDEN", ex.getMessage());
        return new ResponseEntity<>(errorDetails, HttpStatus.FORBIDDEN);
    }

    // --- 403 FORBIDDEN (Custom Exception - для проверки владения) ---
    @ExceptionHandler(CustomAccessDeniedException.class)
    public ResponseEntity<Object> handleCustomAccessDenied(CustomAccessDeniedException ex) {
        // Используем сообщение, которое мы передали из GoalServiceImpl (оно уже локализовано)
        ErrorDetails errorDetails = new ErrorDetails("FORBIDDEN", ex.getMessage());
        return new ResponseEntity<>(errorDetails, HttpStatus.FORBIDDEN);
    }

    // --- 401 UNAUTHORIZED (Other Auth Errors) ---
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Object> handleAuthenticationException(AuthenticationException ex) {
        Locale currentLocale = LocaleContextHolder.getLocale();

        String localizedMessage = messageSource.getMessage(
                "auth.unauthorized",
                null,
                "Authentication failed.",
                currentLocale
        );

        ErrorDetails errorDetails = new ErrorDetails("UNAUTHORIZED", localizedMessage);
        return new ResponseEntity<>(errorDetails, HttpStatus.UNAUTHORIZED);
    }
}