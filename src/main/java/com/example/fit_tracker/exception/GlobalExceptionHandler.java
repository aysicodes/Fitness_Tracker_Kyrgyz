//package com.example.fit_tracker.exception;
//
//import jakarta.persistence.EntityNotFoundException;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.ControllerAdvice;
//
//@ControllerAdvice
//public class GlobalExceptionHandler {
//
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<Object> handleException(Exception ex) {
//        ErrorDetails errorDetails = new ErrorDetails("INTERNAL_SERVER_ERROR", ex.getMessage());
//        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
//    }
//
//    @ExceptionHandler(EntityNotFoundException.class)
//    public ResponseEntity<Object> handleEntityNotFound(EntityNotFoundException ex) {
//        ErrorDetails errorDetails = new ErrorDetails("NOT_FOUND", ex.getMessage());
//        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
//    }
//
//    @ExceptionHandler(IllegalArgumentException.class)
//    public ResponseEntity<Object> handleIllegalArgument(IllegalArgumentException ex) {
//        ErrorDetails errorDetails = new ErrorDetails("BAD_REQUEST", ex.getMessage());
//        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
//    }
//
//}




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

import javax.naming.AuthenticationException;
import java.nio.file.AccessDeniedException;
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
        // 1. Извлекаем уже локализованные сообщения об ошибках
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.toList());

        // 2. Создаем структуру ответа для валидации (Map)
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("errorCode", "VALIDATION_FAILED");
        errorResponse.put("errors", errors);

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
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